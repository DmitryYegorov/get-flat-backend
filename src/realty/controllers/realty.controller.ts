import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
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
}
