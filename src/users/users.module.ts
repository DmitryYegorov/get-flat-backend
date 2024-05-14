import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './services/users.service';
import { UserController } from './controllers/users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import {AdminUsersController} from './controllers/admin-users.controller';
import {AdminUsersService} from './services/admin-users.service';
import {MailService} from 'src/mail/mail.service';

@Module({
  controllers: [UserController, AdminUsersController],
  providers: [UsersService, PrismaService, AdminUsersService, MailService],
  imports: [AuthModule],
})
export class UsersModule {}
