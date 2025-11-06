import { Body, Controller, Get, Post, Req, ValidationPipe } from '@nestjs/common';
import { createUserDTO, loginUserDTO, UserResponseInterface } from '~/user/user.dto';
import { UserService } from '~/user/user.service';
import { ExpressRequestInterface } from '~/types/expressRequest.interface';
import { User } from '~/user/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  currentUser(
    @Req() request: ExpressRequestInterface,
    @User() user: any
  ): UserResponseInterface | null {
    if (!request.user) return null;
    return this.userService.buildUserResponse(request.user);
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
}
