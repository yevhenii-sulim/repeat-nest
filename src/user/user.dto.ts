import { User as UserModel } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class updateUserDTO {
  @IsString()
  @IsOptional()
  readonly userName: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email: string;
  @IsOptional()
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  readonly bio: string;
  @IsOptional()
  @IsString()
  readonly image: string;
}
