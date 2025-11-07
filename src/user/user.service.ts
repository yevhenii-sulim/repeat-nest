import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from '~/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { createUserDTO, loginUserDTO, updateUserDTO, UserResponseInterface } from '~/user/user.dto';

@Injectable()
export class UserService {
  private readonly JWT_SECRET: string;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.JWT_SECRET = this.configService.get<string>('JWT_SECRET')!;
  }

  async getUser(user: createUserDTO): Promise<UserModel | null> {
    try {
      const foundUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: user.email }, { userName: user.userName }],
        },
      });
      return foundUser;
    } catch (error) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async getUserById(id: number): Promise<UserModel | null> {
    try {
      const foundUser = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });
      return foundUser;
    } catch (error) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }

  async createUser(user: createUserDTO): Promise<UserModel> {
    try {
      const foundUser = await this.getUser(user);
      user.password = await hash(user.password, 10);
      const newUser = await this.prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      throw new HttpException('Email or userName are taken', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  generateToken(user: UserModel): string {
    const payload = { id: user.id, email: user.email, userName: user.userName };
    const token = sign(payload, this.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
    return token;
  }

  buildUserResponse(user: UserModel): UserResponseInterface {
    const { password, ...safeUser } = user;
    return {
      user: {
        ...safeUser,
        token: this.generateToken(user),
      },
    };
  }

  async login(user: loginUserDTO): Promise<UserModel> {
    try {
      const foundUser = await this.prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      if (!foundUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isMatchPassword = await compare(user.password, foundUser.password);
      if (!isMatchPassword) {
        throw new HttpException('Email or password is not correct', HttpStatus.UNAUTHORIZED);
      }
      return foundUser;
    } catch (error) {
      throw error;
    }
  }

  async update(currentUserId: number, body: updateUserDTO) {
    try {
      const updatedUser = this.prisma.user.update({
        where: { id: currentUserId },
        data: body,
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
  }
}
