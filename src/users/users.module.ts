import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [],
  imports: [AuthModule],
})
export class UsersModule {}
