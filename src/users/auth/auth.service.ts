import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { JwtSecretAccess, salt } from './contants/jwt';
import { WelcomeNewUserContext } from 'src/mail/types/context/welcome-new-user.context';
import { MailService } from '../../mail/mail.service';
import { UserRole } from '../enum/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(input: RegisterDto) {
    const { email, password, firstName, lastName, middleName, telegram } =
      input;

    const foundUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { telegram }],
      },
    });

    if (foundUser) {
      throw new HttpException(
        'Такой пользователь существует. Используйте логин и пароль для авторизации',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        role: UserRole.USER,
        middleName,
        telegram,
        email,
        password: hashPassword,
      },
    });

    const mailContext: WelcomeNewUserContext = {
      fullName: `${newUser.firstName} ${newUser.middleName} ${newUser.lastName}`,
      activationCode: newUser.id,
    };
    await this.mailService
      .sendMail<WelcomeNewUserContext>(
        {
          email: newUser.email,
          templateId: 'welcome-new-user',
          subject: 'Welcome to the HomeGuru!',
        },
        mailContext,
      )
      .catch(async (err) => {
        await this.prisma.user.delete({ where: { id: newUser.id } });
        console.log({err});
        throw new HttpException(
          'Прозошла ошибка на сервере при проверке Вашей электронной почты. попробуйте позже',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return newUser;
  }

  async login(input: LoginDto) {
    const { email, password } = input;

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
      throw new UnauthorizedException(
        'Проверьте введенные данные, кажется есть ошибки',
      );
    }

    const payload = {
      user: {
        id: foundUser.id,
        role: foundUser.role,
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
        secret: JwtSecretAccess
      }),
      payload,
    };
  }

  async getCurrentUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const payload = {
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
      },
      authorized: new Date(),
    };

    return payload;
  }
}
