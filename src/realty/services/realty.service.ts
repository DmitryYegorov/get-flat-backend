import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRealtyDto } from '../dto/create-realty.dto';
import { RealtyStatus } from '../types/relaty-status.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class RealtyService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewRealty(data: CreateRealtyDto, userId: string) {
    const realty = await this.prisma.realty.create({
      data: {
        categoryId: data.categoryId,
        status: RealtyStatus.DRAFT,
        type: '',
        description: data.description,
        ownerId: userId,
        mainPhoto: data.imageSrc,
        price: new Prisma.Decimal(data.price),
        guestCount: data.guestCount,
        bathroomCount: data.bathroomCount,
        title: data.title,
        location: data.location,
      },
    });

    return realty;
  }

  async getAll() {
    const list = await this.prisma.realty.findMany({
      include: {
        category: true,
      },
    });

    return list;
  }

  async getById(id: string) {
    return this.prisma.realty.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  async getRealtiesByUser(userId: string) {
    const list = await this.prisma.realty.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        category: true,
      },
    });

    return { list };
  }
}
