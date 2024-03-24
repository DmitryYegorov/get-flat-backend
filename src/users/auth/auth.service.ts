import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { JwtSecretAccess, salt } from './contants/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterDto) {
    const { email, password, firstName, lastName, middleName, telegram } =
      input;

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

  async login(input: LoginDto) {
    const { email, password } = input;

    const hashPassword = await bcrypt.hash(password, salt);

    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const passwordMatches = await bcrypt.compare(
      password,
      foundUser?.password || '',
    );

    if (foundUser == null || !passwordMatches) {
      throw new UnauthorizedException('User is not found');
    }

    const payload = {
      user: {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        middleName: foundUser.middleName,
        lastName: foundUser.lastName,
        fullName: `${foundUser.firstName} ${foundUser.middleName} ${foundUser.lastName}`,
      },
      authorized: new Date(),
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: JwtSecretAccess,
      }),
      payload,
    };
  }
}
