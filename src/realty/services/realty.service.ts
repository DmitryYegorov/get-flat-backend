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
        description: data.description,
        ownerId: userId,
        mainPhoto: data.imageSrc,
        price: new Prisma.Decimal(data.price),
        guestCount: data.guestCount,
        bathroomCount: data.bathroomCount,
        title: data.title,
        location: data.location,
        wcCount: data.wcCount,
        hasKitchen: data.hasKitchen,
        hasParking: data.hasParking,
        city: '',
        address: '',
        images: [],
        roomCount: data.roomCount,
      },
    });

    return realty;
  }

  async getAll() {
    const list = await this.prisma.realty.findMany({
      include: {
        category: true,
        favorites: true,
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
        favorites: true,
        bookings: true,
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

  async like(realtyId: string, userId: string) {
    const found = await this.prisma.favorites.findFirst({
      where: {
        realtyId,
        userId,
      },
    });

    if (found) {
      await this.prisma.favorites.delete({
        where: {
          id: found.id,
        },
      });
    } else {
      await this.prisma.favorites.create({
        data: {
          userId,
          realtyId,
        },
      });
    }
  }

  async getFavoritesRealties(userId: string) {
    const list = await this.prisma.favorites.findMany({
      where: {
        userId,
      },
      select: {
        realty: {
          include: {
            category: true,
            favorites: true,
          },
        },
      },
    });

    return {
      list: list.map((i) => i.realty),
    };
  }

  async updateRealtyInfo(id: string, data) {
    const oldData = await this.prisma.realty.findUnique({
      where: {
        id,
      },
    });

    // const images = [];
    // if (data.images) {
    //   new Set([...data.images, ...oldData.images]).forEach((item) =>
    //     images.push(item),
    //   );
    // }

    const updated = await this.prisma.realty.update({
      where: {
        id,
      },
      data: {
        ...data,
        // images: [...images],
      },
    });

    return updated;
  }
}
