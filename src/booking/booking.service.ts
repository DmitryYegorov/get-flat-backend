import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { Prisma } from '@prisma/client';

function generateRandomEightDigitNumber() {
  // Генерируем число от 10000000 (включительно) до 99999999 (включительно)
  return Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000;
}  

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async bookRealty(userId, data) {

    const realtyId = data.realtyId;
    const secretCode = generateRandomEightDigitNumber();

    const realty = await this.prisma.realty.findUnique({
      where: {
        id: realtyId,
      }
    });

    const diff = dayjs(data.endDate).diff(dayjs(data.startDate), 'days') + 1;
    const total = Number(realty.price) * diff;

    console.log({diff, total});

    const booking = await this.prisma.bookings.create({
      data: {
        ...data,
        secretCode: String(secretCode).padStart(8, '0'),
        userId,
        total: new Prisma.Decimal(total),
      },
    });

    return booking;
  }

  async getBookingsByUser(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        userId,
      },
      include: {
        realty: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return bookings;
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id,
      },
      include: {
        realty: {
          include: {
            owner: true,
          },
        },
        reviews: true
      },
    });

    if (!booking) {
      throw new NotFoundException('Бронь не найдена');
    }


    const getTripStatus = (start: Date, end: Date) => {
      const now = new Date();
      console.log({start, end, now}, end < now)
      if (end > now && booking.confirmed) {
        return {
          label: 'В процессе',
          value: 'in_progress',
        };
      } else if (end > now && !booking.confirmed) {
        return {
          label: 'Не состоялась',
          value: 'canceled'
        };
      }
      
      return {
        label: 'Закончена',
        value: 'completed'
      };
    }

    return {
      ...booking,
      tripStatus: getTripStatus(new Date(booking.startDate), new Date(booking.endDate))
    };
  }

  async getBookingChat(userId: string, bookingId: string) {
    const messages = await this.prisma.messages.findMany({
      where: {
        bookingId,
      },
      include: {
        fromUser: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages.map((message) => ({
      id: message.id,
      from: message.from,
      position: message.from !== userId ? 'right' : 'left',
      type: 'text',
      title: `${message.fromUser?.firstName} ${message.fromUser?.middleName} ${message.fromUser?.lastName}`,
      text: message.text,
      isRead: message.isRead,
    }));
  }

  async addMessage(bookingId: string, userId: string, message: string) {
    return await this.prisma.messages.create({
      data: {
        booking: { connect: { id: bookingId } },
        fromUser: { connect: { id: userId } },
        text: message,
      },
    });
  }

  async getBookingsForOwner(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        realty: {
          ownerId: userId,
        },
      },
      include: {
        realty: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return bookings;
  }

  async allMessagesRead(bookingId: string) {
    await this.prisma.messages.updateMany({
      where: {
        id: bookingId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async checkCode(bookingId: string, secretCode: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id: bookingId,
      }
    });

    if (booking.secretCode !== secretCode) {
      throw new BadRequestException("Неверный код!");
    }

    return this.prisma.bookings.update({
      where: {
        id: bookingId,
      },
      data: {
        confirmed: true,
      }
    });
  }

  async getTripsByUser(userId: string) {
    const trips = await this.prisma.bookings.findMany({
      where: {
        userId,
        confirmed: true,
      },
      orderBy: {
        endDate: 'asc',
      },

    });

    const getTripStatus = (start, end) => {
      const now = new Date();
      console.log(start, end, now)
      if (end < now) {
        return {
          label: 'В процессе',
          value: 'in_progress',
        };
      }
      
      return {
        label: 'Закончена',
        value: 'completed'
      };
    }

    return trips.map((t) => ({
      ...t,
      tripStatus: getTripStatus(new Date(t.startDate), new Date(t.endDate)),
    }));
  }

  async addReview(bookingId: string, userId: string, data) {
    console.log({
      bookingId,
      userId,
      data
    })
    const review = await this.prisma.reviews.create({
      data: {
        ...data,
        authorId: userId,
        bookingId,
      }
    });

    return review;
  }
}
