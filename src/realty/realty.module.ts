import { Module } from '@nestjs/common';
import { RealtyController } from './controllers/realty.controller';
import { CategoriesController } from './controllers/categories.controller';
import { RealtyService } from './services/realty.service';
import { CategoryService } from './services/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RealtyController, CategoriesController],
  providers: [RealtyService, CategoryService, PrismaService],
  imports: [PrismaModule],
})
export class RealtyModule {}
