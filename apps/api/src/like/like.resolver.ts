import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @Mutation(() => Boolean)
  async likePost(
    @CurrentUser('sub') userId: number,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    return await this.likeService.likePost({ postId, userId });
  }

  @Mutation(() => Boolean)
  async unlikePost(
    @CurrentUser('sub') userId: number,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    return await this.likeService.unlikePost({ postId, userId });
  }

  @Public()
  @Query(() => Int)
  postLikesCount(@Args('postId', { type: () => Int! }) postId: number) {
    return this.likeService.getPostLikesCount(postId);
  }

  @Query(() => Boolean)
  userLikedPost(
    @CurrentUser('sub') userId: number,
    @Args('postId', { type: () => Int! }) postId: number,
  ) {
    return this.likeService.userLikedPost({ postId, userId });
  }
}
