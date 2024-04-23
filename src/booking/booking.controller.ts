import { Controller, Post, UseGuards, Body, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { AuthGuard } from 'src/users/auth/auth.guard';

@Controller('/bookings')
export class BookingContrller {
  constructor(private readonly service: BookingService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createBooking(@Request() req, @Body() body) {
    const user = req.user;

    return this.service.bookRealty(user.id, body);
  }
}
