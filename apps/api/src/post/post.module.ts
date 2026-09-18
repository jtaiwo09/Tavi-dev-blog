import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import './enums/post-status.enum';

@Module({
  providers: [PostResolver, PostService],
})
export class PostModule {}
