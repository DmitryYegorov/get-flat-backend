import { Module } from '@nestjs/common';
import { RealtyController } from './controllers/realty.controller';
import { CategoriesController } from './controllers/categories.controller';
import { RealtyService } from './services/realty.service';
import { CategoryService } from './services/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import {AdminRealtyController} from './controllers/admin-realty.controller';
import {AdminRealtyService} from './services/admin-realty.service';

@Module({
  controllers: [RealtyController, CategoriesController, AdminRealtyController],
  providers: [RealtyService, CategoryService, PrismaService, AdminRealtyService],
  imports: [PrismaModule],
})
export class RealtyModule {}
