import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

import * as jwtConstants from './contants/jwt';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, MailService],
  exports: [AuthService],
  imports: [
    PrismaModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.JwtSecretAccess,
      signOptions: { expiresIn: '6000s' },
    }),
  ],
})
export class AuthModule {}
