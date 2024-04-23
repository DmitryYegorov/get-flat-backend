import { Module } from '@nestjs/common';
import { BookingContrller } from './booking.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingService } from './booking.service';

@Module({
  controllers: [BookingContrller],
  providers: [PrismaService, BookingService],
})
export class BookingModule {}
