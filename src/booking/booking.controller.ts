import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
  Param,
} from '@nestjs/common';
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

  @Get('/my')
  @UseGuards(AuthGuard)
  async getUserBookings(@Request() req) {
    const user = req.user;

    return this.service.getBookingsByUser(user.id);
  }

  @Post('/check-code')
  async confirmCode(@Body() body) {
    return this.service.checkCode(body.bookingId, body.secretCode);
  }

  @Get('/for-owner')
  @UseGuards(AuthGuard)
  async getOwnerBookings(@Request() req) {
    const user = req.user;

    return this.service.getBookingsForOwner(user.id);
  }

  @Get('/:id')
  async getBookingById(@Param('id') id: string) {
    return this.service.getBookingById(id);
  }

  @Get('/:id/chat')
  @UseGuards(AuthGuard)
  async getChat(@Request() req, @Param('id') id: string) {
    const user = req.user;

    return this.service.getBookingChat(user.id, id);
  }

}
