import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { Public } from 'src/common/decorators/public.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { UserMessageResponse } from './dto/user-message-response.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@CurrentUser('sub') id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  updateProfile(
    @CurrentUser('sub') userId: number,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.updateProfile(userId, input);
  }

  @Mutation(() => Boolean)
  deactivateAccount(@CurrentUser('sub') userId: number) {
    return this.userService.deactivateAccount(userId);
  }

  @Mutation(() => UserMessageResponse)
  changePassword(
    @CurrentUser('sub') userId: number,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.userService.changePassword(
      userId,
      input.currentPassword,
      input.newPassword,
    );
  }
}
