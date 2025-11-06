import { Body, Controller, Get, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { createUserDTO, loginUserDTO, updateUserDTO, UserResponseInterface } from '~/user/user.dto';
import { UserService } from '~/user/user.service';
import { User } from '~/user/user.decorator';
import { AuthGuard } from '~/guard/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(AuthGuard)
  currentUser(@User() user: any): UserResponseInterface {
    return this.userService.buildUserResponse(user);
  }
  @Post('signup')
  async createUser(
    @Body(new ValidationPipe()) user: createUserDTO
  ): Promise<UserResponseInterface> {
    const newUse = await this.userService.createUser(user);
    return this.userService.buildUserResponse(newUse);
  }
  @Post('signin')
  async loginUser(@Body(new ValidationPipe()) user: loginUserDTO): Promise<UserResponseInterface> {
    const authorizedUser = await this.userService.login(user);
    return this.userService.buildUserResponse(authorizedUser);
  }
  @Patch('update')
  @UseGuards(AuthGuard)
  async update(
    @User('id') currentUser: number,
    @Body(new ValidationPipe()) body: updateUserDTO
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.update(currentUser, body);
    return this.userService.buildUserResponse(updatedUser);
  }
}
