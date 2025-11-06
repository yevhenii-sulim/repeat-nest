import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { UserModule } from '~/user/user.module';
import { PrismaService } from '~/prisma/prisma.service';
import { TagModule } from '~/tag/tag.module';
import { MiddlewareBuilder } from '@nestjs/core';
import { UserMiddleware } from '~/user/user.middleware';
import { PrismaModule } from '~/prisma/prisma.module';
import { ArticlesModule } from '~/articles/articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TagModule,
    UserModule,
    PrismaModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
