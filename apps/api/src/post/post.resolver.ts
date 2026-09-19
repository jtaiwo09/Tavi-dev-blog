import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

import { Post } from './entities/post.entity';
import { PostService } from './post.service';

import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostFiltersInput } from './dto/post-filters.input';
import { PostsResponse } from './dto/post-response.dto';
import { PostStatus } from 'src/generated/prisma/enums';
import { UserPostsResponse } from './dto/user-posts-response.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Query(() => PostsResponse, {
    name: 'posts',
  })
  findAll(
    @Args('skip', {
      type: () => Int,
      nullable: true,
      defaultValue: 0,
    })
    skip?: number,

    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    take?: number,

    @Args('filters', {
      type: () => PostFiltersInput,
      nullable: true,
    })
    filters?: PostFiltersInput,
  ) {
    return this.postService.findAll({
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
      filters,
    });
  }

  @Public()
  @Query(() => Post)
  getPostById(
    @Args('id', { type: () => Int })
    id: number,
  ) {
    return this.postService.findOne(id);
  }

  @Query(() => UserPostsResponse)
  getUserPosts(
    @CurrentUser('sub') userId: number,
    @Args('skip', { nullable: true, type: () => Int }) skip?: number,
    @Args('take', { nullable: true, type: () => Int }) take?: number,
    @Args('status', { nullable: true, type: () => PostStatus })
    status?: PostStatus,
  ) {
    return this.postService.findByUser({
      userId,
      skip: skip ?? 0,
      take: take ?? DEFAULT_PAGE_SIZE,
      status,
    });
  }

  @Query(() => Int)
  userPostCount(
    @CurrentUser('sub')
    userId: number,
  ) {
    return this.postService.userPostCount(userId);
  }

  @Mutation(() => Post)
  createPost(
    @CurrentUser('sub')
    authorId: number,

    @Args('createPostInput')
    createPostInput: CreatePostInput,
  ) {
    return this.postService.create({
      createPostInput,
      authorId,
    });
  }

  @Mutation(() => Post)
  updatePost(
    @CurrentUser('sub')
    userId: number,

    @Args('updatePostInput')
    updatePostInput: UpdatePostInput,
  ) {
    return this.postService.update({
      userId,
      updatePostInput,
    });
  }

  @Mutation(() => Boolean)
  deletePost(
    @CurrentUser('sub')
    userId: number,

    @Args('postId', {
      type: () => Int,
    })
    postId: number,
  ) {
    return this.postService.delete({
      postId,
      userId,
    });
  }
}
