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

  @Get('/trips')
  @UseGuards(AuthGuard)
  async getUserTrips(@Request() req) {
    const user = req.user;

    return this.service.getTripsByUser(user.id);
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

  @Post('/:id/review/create')
  @UseGuards(AuthGuard)
  async createReview(@Request() req, @Body() body, @Param('id') bookingId: string) {
    const user = req.user;
    console.log({
      bookingId,
      userId: user.id
    });

    return this.service.addReview(bookingId, user.id, body);
  }

}
