import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user;
  }

  async updateUserData(id: string, body) {
    const { firstName, middleName, lastName, email, telegram } = body;

    const updated = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        middleName,
        lastName,
        email,
        telegram,
      },
    });

    return updated;
  }
}
