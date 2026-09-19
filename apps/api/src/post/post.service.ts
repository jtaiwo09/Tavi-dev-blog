import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostFiltersInput } from './dto/post-filters.input';
import { calculateArticleStats } from './utils/article-stats';
import { PostStatus } from 'src/generated/prisma/enums';

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFKD') // Split accented characters into base letters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
    .toLowerCase() // Convert to lowercase
    .trim() // Trim leading and trailing whitespace
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters (keep alphanumerics, spaces, and hyphens)
    .replace(/\s+/g, '-') // Replace spaces (and multiple spaces) with a single hyphen
    .replace(/-+/g, '-'); // Collapse consecutive hyphens into a single hyphen
}

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    skip,
    take,
    filters,
  }: {
    skip?: number;
    take?: number;
    filters?: PostFiltersInput;
  }) {
    const where = {
      status: PostStatus.PUBLISHED,

      ...(filters?.categoryId !== undefined && {
        categoryId: filters.categoryId,
      }),

      ...(filters?.tag?.trim() && {
        tags: {
          some: {
            name: filters.tag.trim(),
          },
        },
      }),

      ...(filters?.search?.trim() && {
        OR: [
          {
            title: {
              contains: filters.search.trim(),
            },
          },
          {
            excerpt: {
              contains: filters.search.trim(),
            },
          },
        ],
      }),
    };

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: {
          publishedAt: 'desc',
        },

        include: {
          author: true,
          category: true,
          tags: true,

          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),

      this.prisma.post.count({ where }),
    ]);

    return {
      posts,
      total,
    };
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findFirst({
      where: {
        id,
      },
      include: {
        author: true,
        tags: true,
        category: true,

        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }

  async findByUser({
    userId,
    skip,
    take,
    status,
  }: {
    userId: number;
    skip: number;
    take: number;
    status?: PostStatus;
  }) {
    const where = {
      authorId: userId,

      ...(status && {
        status,
      }),
    };

    const [posts, total, published, drafts] = await Promise.all([
      this.prisma.post.findMany({
        where,

        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,

          status: true,
          publishedAt: true,

          wordCount: true,
          readingTimeMinutes: true,

          slug: true,
          title: true,
          excerpt: true,
          thumbnail: true,

          category: true,
          tags: true,
          author: true,

          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },

        orderBy: {
          updatedAt: 'desc',
        },

        take,
        skip,
      }),
      this.prisma.post.count({
        where,
      }),
      this.prisma.post.count({
        where: {
          ...where,
          status: PostStatus.PUBLISHED,
        },
      }),
      this.prisma.post.count({
        where: {
          ...where,
          status: PostStatus.DRAFT,
        },
      }),
    ]);

    return {
      posts,
      total,
      stats: {
        total,
        published,
        drafts,
      },
    };
  }

  async userPostCount(userId: number) {
    return this.prisma.post.count({
      where: {
        authorId: userId,
      },
    });
  }

  async create({
    createPostInput,
    authorId,
  }: {
    createPostInput: CreatePostInput;
    authorId: number;
  }) {
    // 1. Validate Category Existence
    const category = await this.prisma.category.findUnique({
      where: {
        id: createPostInput.categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('The selected category does not exist.');
    }

    // 2. Calculate Reading Metadata
    const { wordCount, readingTimeMinutes } = calculateArticleStats(
      createPostInput.content,
    );

    // 3. Determine Publication Status and Date
    const status = createPostInput.status ?? PostStatus.DRAFT;
    const publishedAt = status === PostStatus.PUBLISHED ? new Date() : null;

    // 4. Generate Unique Slug (Prevents P2002 Unique Constraint Failures)
    const baseSlug = slugify(createPostInput.title);
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    // 5. Create Post Record in Database
    const post = await this.prisma.post.create({
      data: {
        title: createPostInput.title,
        excerpt: createPostInput.excerpt ?? null,
        content: createPostInput.content,
        status,
        publishedAt,
        wordCount,
        readingTimeMinutes,
        thumbnail: createPostInput.thumbnail ?? null,
        slug,

        category: {
          connect: {
            id: createPostInput.categoryId,
          },
        },

        author: {
          connect: {
            id: authorId,
          },
        },

        tags: createPostInput.tags?.length
          ? {
              connectOrCreate: createPostInput.tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },

      include: {
        author: true,
        category: true,
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const message =
      status === PostStatus.PUBLISHED
        ? 'Post published successfully!'
        : 'Draft saved successfully!';

    return {
      message,
    };
  }

  async update({
    userId,
    updatePostInput,
  }: {
    userId: number;
    updatePostInput: UpdatePostInput;
  }) {
    // 1. Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: {
        id: updatePostInput.postId,
      },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found.');
    }

    // 2. Ensure the requester is the owner
    if (existingPost.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this post.');
    }

    // 3. Verify category existence if categoryId is being updated
    const categoryId = updatePostInput.categoryId ?? existingPost.categoryId;
    if (updatePostInput.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new BadRequestException('The selected category does not exist.');
      }
    }

    // 4. Safe fallback for content & stats calculation
    const contentToAnalyze = updatePostInput.content ?? existingPost.content;
    const { wordCount, readingTimeMinutes } =
      calculateArticleStats(contentToAnalyze);

    // 5. Handle publication status and publishedAt date transitions
    const previousStatus = existingPost.status;
    const nextStatus = updatePostInput.status ?? previousStatus;
    let publishedAt = existingPost.publishedAt;

    if (
      previousStatus === PostStatus.DRAFT &&
      nextStatus === PostStatus.PUBLISHED
    ) {
      publishedAt = new Date();
    } else if (
      previousStatus === PostStatus.PUBLISHED &&
      nextStatus === PostStatus.DRAFT
    ) {
      publishedAt = null;
    }

    // 6. Safe title & slug handling
    const title = updatePostInput.title ?? existingPost.title;
    const slug = updatePostInput.title
      ? slugify(updatePostInput.title)
      : existingPost.slug;

    // 7. Execute Prisma update
    const updatedPost = await this.prisma.post.update({
      where: {
        id: updatePostInput.postId,
      },
      data: {
        title,
        slug,
        excerpt: updatePostInput.excerpt ?? existingPost.excerpt,
        content: contentToAnalyze,
        categoryId,
        status: nextStatus,
        publishedAt,
        wordCount,
        readingTimeMinutes,

        ...(updatePostInput.thumbnail !== undefined && {
          thumbnail: updatePostInput.thumbnail,
        }),

        ...(updatePostInput.tags !== undefined && {
          tags: {
            set: [],
            connectOrCreate: updatePostInput.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        }),
      },
      include: {
        author: true,
        category: true,
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // 8. Correct dynamic success message
    const message =
      previousStatus === PostStatus.DRAFT && nextStatus === PostStatus.PUBLISHED
        ? 'Post published successfully!'
        : 'Post updated successfully!';

    return {
      message,
    };
  }

  async delete({ postId, userId }: { postId: number; userId: number }) {
    const authorIdMatched = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
    });

    if (!authorIdMatched) throw new UnauthorizedException();

    const result = await this.prisma.post.delete({
      where: {
        id: postId,
        authorId: userId,
      },
    });

    return !!result;
  }
}
