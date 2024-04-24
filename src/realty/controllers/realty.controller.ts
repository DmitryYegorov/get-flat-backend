import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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

  @Get('/users/:userId')
  async getAllRealties(@Param('userId') userId: string) {
    return this.service.getRealtiesByUser(userId);
  }

  @Post('/like')
  @UseGuards(AuthGuard)
  async addOrDeleteFavorites(@Body() body, @Request() req) {
    const realtyId = body.realtyId;
    const user = req.user;

    return this.service.like(realtyId, user.id);
  }

  @Get('/favorites')
  @UseGuards(AuthGuard)
  async getFavoritesRealties(@Request() req) {
    const user = req.user;

    console.log(user.id);
    return this.service.getFavoritesRealties(user.id);
  }

  @Get('/:id')
  async getRealtyById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Patch('/:realtyId')
  async updateRealtyInfo(@Param('realtyId') id: string, @Body() body) {
    return this.service.updateRealtyInfo(id, body);
  }

  @Post('/booking-slot/add')
  async addSlotsBooking(@Body() body) {
    return this.service.addBookingSlots(body.realtyId, body.dates);
  }
}
