import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListOfCategoriesDto } from '../dto/create-categories.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategories(data: ListOfCategoriesDto) {
    const { list } = data;

    return this.prisma.realtyCategory.createMany({
      data: list,
    });
  }

  async getAllCategories() {
    return this.prisma.realtyCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
