import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(input: RegisterDto) {
    const { email, password, firstName, lastName, middleName, telegram } = input;

    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        middleName,
        telegram,
        email,
        password: hashPassword,
      },
    });

    return newUser;
  }
}
