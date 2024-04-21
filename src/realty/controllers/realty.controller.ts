import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateRealtyDto } from '../dto/create-realty.dto';
import { RealtyService } from '../services/realty.service';
import { AuthGuard } from 'src/users/auth/auth.guard';

@Controller('/realty')
export class RealtyController {
  constructor(private readonly service: RealtyService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createNewRealty(@Body() body: CreateRealtyDto, @Request() req) {
    const user = req.user;
    return this.service.createNewRealty(body, user.id);
  }

  @Get()
  async getListOfRealtyForMain() {
    const list = await this.service.getAll();

    return { list };
  }

  @Get('/:id')
  async getRealtyById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('/users/:userId')
  async getAllRealties(@Param('userId') userId: string) {
    return this.service.getRealtiesByUser(userId);
  }
}
