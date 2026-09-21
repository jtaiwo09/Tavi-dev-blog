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
import { Prisma } from 'src/generated/prisma/client';
import { decodeBase64Content } from 'src/common/utils/base64.util';

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
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
    const where: Prisma.PostWhereInput = {
      status: PostStatus.PUBLISHED,

      ...(filters?.categoryId !== undefined && {
        categoryId: filters.categoryId,
      }),

      ...(filters?.categorySlug && {
        category: {
          slug: filters.categorySlug,
        },
      }),

      ...(filters?.tag?.trim() && {
        tags: {
          some: {
            tag: {
              slug: filters.tag.trim(),
            },
          },
        },
      }),

      ...(filters?.search?.trim() && {
        OR: [
          {
            title: {
              contains: filters.search.trim(),
              mode: 'insensitive',
            },
          },
          {
            excerpt: {
              contains: filters.search.trim(),
              mode: 'insensitive',
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
        orderBy: [
          {
            publishedAt: 'desc',
          },
          {
            id: 'desc',
          },
        ],
        include: {
          author: true,
          category: true,

          tags: {
            include: {
              tag: true,
            },
          },

          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      }),

      this.prisma.post.count({
        where,
      }),
    ]);

    return {
      posts: posts.map((post) => ({
        ...post,
        tags: post.tags.map((postTag) => postTag.tag),
      })),
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
        tags: {
          include: { tag: true },
        },
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
    return {
      ...post,
      tags: post.tags.map((postTag) => postTag.tag),
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        status: PostStatus.PUBLISHED,
      },
      include: {
        author: true,
        tags: {
          include: {
            tag: true,
          },
        },
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

    return {
      ...post,
      tags: post.tags.map((postTag) => postTag.tag),
    };
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
          tags: { include: { tag: true } },
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
      posts: posts.map((post) => ({
        ...post,
        tags: post.tags.map((postTag) => postTag.tag),
      })),
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
    const { categoryId, tags = [], ...postData } = createPostInput;

    const rawContent = decodeBase64Content(postData.content);

    // 1. Enforce maximum of 3 tags
    if (tags.length > 3) {
      throw new BadRequestException('A post can have a maximum of 3 tags.');
    }

    // 2. Validate category
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('The selected category does not exist.');
    }

    // 3. Validate tags
    const uniqueTagIds = [...new Set(tags)];

    if (uniqueTagIds.length !== tags.length) {
      throw new BadRequestException('A tag cannot be selected more than once.');
    }

    if (uniqueTagIds.length > 0) {
      const existingTags = await this.prisma.tag.findMany({
        where: {
          id: {
            in: uniqueTagIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (existingTags.length !== uniqueTagIds.length) {
        throw new BadRequestException(
          'One or more selected tags do not exist.',
        );
      }
    }

    // 4. Calculate article metadata
    const { wordCount, readingTimeMinutes } = calculateArticleStats(
      postData.content,
    );

    // 5. Publication state
    const status = postData.status ?? PostStatus.DRAFT;

    const publishedAt = status === PostStatus.PUBLISHED ? new Date() : null;

    // 6. Generate slug
    const baseSlug = slugify(postData.title);
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);

    const slug = `${baseSlug}-${uniqueSuffix}`;

    // 7. Create post
    const post = await this.prisma.post.create({
      data: {
        title: postData.title,
        excerpt: postData.excerpt ?? null,
        content: rawContent,
        status,
        publishedAt,
        wordCount,
        readingTimeMinutes,
        thumbnail: postData.thumbnail ?? null,
        slug,

        category: {
          connect: {
            id: categoryId,
          },
        },

        author: {
          connect: {
            id: authorId,
          },
        },

        tags: {
          create: uniqueTagIds.map((tagId) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },

      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
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

    if (updatePostInput.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new BadRequestException('The selected category does not exist.');
      }
    }

    const contentToAnalyze = updatePostInput.content
      ? decodeBase64Content(updatePostInput.content)
      : existingPost.content;

    const { wordCount, readingTimeMinutes } =
      calculateArticleStats(contentToAnalyze);

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

    // 6. Handle title and slug
    const title = updatePostInput.title ?? existingPost.title;

    const slug = updatePostInput.title
      ? slugify(updatePostInput.title)
      : existingPost.slug;

    // 7. Validate tags if they were provided
    let tagIds: number[] | undefined;

    if (updatePostInput.tags !== undefined) {
      // Remove duplicate tag IDs
      tagIds = [...new Set(updatePostInput.tags)];

      // Maximum of 3 tags per post
      if (tagIds.length > 3) {
        throw new BadRequestException('A post can have a maximum of 3 tags.');
      }

      // Verify that every selected tag exists
      if (tagIds.length > 0) {
        const existingTags = await this.prisma.tag.findMany({
          where: {
            id: {
              in: tagIds,
            },
          },
          select: {
            id: true,
          },
        });

        if (existingTags.length !== tagIds.length) {
          throw new BadRequestException(
            'One or more selected tags do not exist.',
          );
        }
      }
    }

    // 8. Build update data
    const data: any = {
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
    };

    // 9. Update tags only when tags were provided
    //
    // An empty array means:
    // "Remove all tags from this post."
    //
    // An undefined value means:
    // "Don't change the existing tags."
    if (tagIds !== undefined) {
      data.tags = {
        deleteMany: {},
        create: tagIds.map((tagId) => ({
          tag: {
            connect: {
              id: tagId,
            },
          },
        })),
      };
    }

    // 10. Update the post
    const updatedPost = await this.prisma.post.update({
      where: {
        id: updatePostInput.postId,
      },
      data,
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // 11. Success message
    const message =
      previousStatus === PostStatus.DRAFT && nextStatus === PostStatus.PUBLISHED
        ? 'Post published successfully!'
        : 'Post updated successfully!';

    return {
      message,
    };
  }

  async updatePostStatus({
    postId,
    userId,
  }: {
    postId: number;
    userId: number;
  }) {
    // 1. Find the post
    const existingPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
        status: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundException('Post not found.');
    }

    if (existingPost.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to update this post.');
    }

    const nextStatus =
      existingPost.status === PostStatus.PUBLISHED
        ? PostStatus.DRAFT
        : PostStatus.PUBLISHED;

    const publishedAt = nextStatus === PostStatus.PUBLISHED ? new Date() : null;

    // 5. Update only the fields relevant to publication
    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: nextStatus,
        publishedAt,
      },
    });

    return {
      message:
        nextStatus === PostStatus.PUBLISHED
          ? 'Post published successfully!'
          : 'Post unpublished successfully!',
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
