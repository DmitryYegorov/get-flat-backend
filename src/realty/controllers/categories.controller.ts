import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { ListOfCategoriesDto } from '../dto/create-categories.dto';

@Controller('/realty-categories')
export class CategoriesController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  async createCategories(@Body() body: ListOfCategoriesDto) {
    return this.service.createCategories(body);
  }

  @Get()
  async getAllCategories() {
    return this.service.getAllCategories();
  }
}
