import { user as UserModel } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface UserResponseInterface {
  user: Omit<UserModel, 'password'> & { token: string };
}

export class createUserDTO {
  @IsNotEmpty()
  @IsString()
  readonly userName: string;
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class loginUserDTO {
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
