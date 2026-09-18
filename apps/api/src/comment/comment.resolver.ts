import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { DEFAULT_PAGE_SIZE } from 'src/constants';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Resolver(() => CommentEntity)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Query(() => [CommentEntity])
  getPostComments(
    @Args('postId', { type: () => Int! }) postId: number,
    @Args('take', {
      type: () => Int,
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    take: number,
    @Args('skip', {
      type: () => Int,
      nullable: true,
      defaultValue: 0,
    })
    skip: number,
  ) {
    return this.commentService.findOneByPost({ postId, take, skip });
  }

  @Public()
  @Query(() => Int)
  postCommentCount(@Args('postId', { type: () => Int! }) postId: number) {
    return this.commentService.count(postId);
  }

  @Mutation(() => CommentEntity)
  createComment(
    @CurrentUser('sub') authorId: number,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.create(createCommentInput, authorId);
  }
}
