import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewStatus } from 'src/common/enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf<Context>;

  constructor(
    private readonly prisma: PrismaService,
    // private readonly bot: Telegraf<Context>,
  ) {
    this.bot = new Telegraf<Context>(
      '7117840684:AAGMXnodIULlZoeGqblM2itoDVlpE85xJVU',
    );
  }

  async getUserByTelegram(telegram: string) {
    const foundUser = await this.prisma.user.findFirst({
      where: {
        telegram,
      },
    });

    if (!foundUser) {
      return null;
    }

    return foundUser;
  }

  async getMyBookingsList(userId: string) {
    const bookings = await this.getBookingsByUser(userId);

    return bookings;
  }
  async getBookingsByUser(userId: string) {
    const bookings = await this.prisma.bookings.findMany({
      where: {
        userId,
        startDate: {
          gte: new Date(),
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

  async getBookingById(bookingId: string) {
    const booking = await this._getBookingById(bookingId);

    return booking;
  }
  async _getBookingById(id: string) {
    const booking = await this.prisma.bookings.findUnique({
      where: {
        id,
      },
      include: {
        realty: {
          include: {
            owner: true,
            category: true,
          },
        },
        reviews: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Бронь не найдена');
    }

    const getTripStatus = (start: Date, end: Date) => {
      const now = new Date();
      console.log({ start, end, now }, end < now);
      if (end > now && booking.confirmed) {
        return {
          label: 'В процессе',
          value: 'in_progress',
        };
      } else if (end > now && !booking.confirmed) {
        return {
          label: 'Не состоялась',
          value: 'canceled',
        };
      }

      return {
        label: 'Закончена',
        value: 'completed',
      };
    };

    return {
      ...booking,
      tripStatus: getTripStatus(
        new Date(booking.startDate),
        new Date(booking.endDate),
      ),
    };
  }

  async getMyRealties(userId: string) {
    const list = await this.prisma.realty.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        category: true,
        bookings: {
          include: {
            reviews: true,
          },
        },
        bookingSlots: true,
      },
    });

    let reviewsCount = 0;
    let sum = 0;

    for (const item of list) {
      item.bookings.forEach((b) => {
        reviewsCount += b.reviews?.length;
        sum += b?.reviews
          .filter((r) => r.status === ReviewStatus.APPROOVED)
          .reduce((acc, value) => acc + value.rating, 0);
      });
    }

    return list.map((i) => ({
      ...i,
      rating: +(sum / reviewsCount).toFixed(2),
    }));
  }

  async getRealty(id: string) {
    const found = await this.prisma.realty.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        favorites: true,
        bookings: {
          include: {
            reviews: {
              include: {
                author: true,
              },
            },
          },
        },
        bookingSlots: true,
      },
    });

    const reviews = [];

    const slots = found.bookingSlots.map((b) => b.date);
    const booked = found.bookings.map((b) => [b.startDate, b.endDate]);

    const bookings = found.bookings;

    for (const booking of bookings) {
      reviews.push(
        ...booking?.reviews.filter((r) => r.status === ReviewStatus.APPROOVED),
      );
    }

    for (const book of booked) {
      const [start, end] = book;

      slots.forEach((slot, index) => {
        if (slot >= start && slot <= end) {
          slots[index] = null;
        }
      });
    }

    let count = 0;
    let sum = 0;

    for (const r of reviews) {
      count++;
      sum += r.rating;
    }

    return {
      ...found,
      reviews,
      rating: +(sum / count).toFixed(2),
      slots,
      booked,
    };
  }

  async saveChatId(userId: string, chatId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        chatId,
      },
    });
  }

  async sendMessageToChat(chatId: string, message: string, options?: any) {
    console.log('message to telegram');
    await this.bot.telegram
      .sendMessage(chatId, message, {
        parse_mode: 'HTML',
        ...options,
      })
      .then((res) => {
        console.log(res);
      });
  }

  async cancelBooking(bookingId: string) {
    await this.prisma.bookings.delete({
      where: { id: bookingId },
    });
  }
}
