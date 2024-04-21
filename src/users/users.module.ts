import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UsersService, PrismaService],
  imports: [AuthModule],
})
export class UsersModule {}
