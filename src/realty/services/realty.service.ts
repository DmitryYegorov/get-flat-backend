import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRealtyDto } from '../dto/create-realty.dto';
import { RealtyStatus } from '../types/relaty-status.enum';
import { Prisma } from '@prisma/client';
import { ReviewStatus } from 'src/common/enum';
import * as dayjs from 'dayjs';
import { every } from 'rxjs';

function getDatesInRange(startDate: Date, endDate: Date): Date[] {
  const dateArray = [];
  const currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    const newDate = new Date(currentDate);
    newDate.setUTCMilliseconds(0);
    newDate.setUTCHours(0);
    newDate.setUTCMinutes(0);
    newDate.setUTCSeconds(0);
    dateArray.push(dayjs(newDate).toISOString());
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

function areIntervalsNonOverlapping(
  startDate1: Date,
  endDate1: Date,
  startDate2: Date,
  endDate2: Date,
): boolean {
  // Проверяем, что начальная и конечная дата первого интервала лежат в правильном порядке
  if (startDate1 > endDate1) {
    return false;
  }
  // Проверяем, что начальная и конечная дата второго интервала лежат в правильном порядке
  if (startDate2 > endDate2) {
    return false;
  }

  // Периоды пересекаются если один из них начинается в другом
  if (endDate1 < startDate2 || startDate1 > endDate2) {
    // Интервалы не пересекаются
    return true;
  } else {
    // Интервалы пересекаются
    return false;
  }
}

@Injectable()
export class RealtyService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewRealty(data: any, userId: string) {
    const realty = await this.prisma.realty.create({
      data: {
        categoryId: data.categoryId,
        status: RealtyStatus.DRAFT,
        description: data.description,
        ownerId: userId,
        mainPhoto: data.imageSrc,
        price: new Prisma.Decimal(data.price),
        guestCount: data.guestCount,
        bathroomCount: data.bathroomCount,
        title: data.title,
        location: data.location,
        wcCount: data.wcCount,
        hasKitchen: data.hasKitchen,
        hasParking: data.hasParking,
        city: data.city || '',
        address: data.address || '',
        images: data.images || [],
        roomCount: data.roomCount,
        childrenCount: data.childrenCount,
        bathType: data.bathType,
        showerCount: data.showerCount,
        hasPlayground: data.hasPlayground,
        bathroomIsCombined: data.bathroomIsCombined,
        isAccessible: data.isAccessible,
        hasBreakfast: data.hasBreakfast,
        hasDinner: data.hasDinner,
        hasLunch: data.hasLunch,
      },
    });

    return realty;
  }

  async getAll(body = null) {
    let where: any = {};

    if (body.forUserId != null) {
      where.ownerId = {
        not: body.forUserId,
      };
    }

    if (body.location?.label) {
      where.location = { equals: body.location };
    }

    // if (body.city?.label) {
    //   where.location = { equals: body.city };
    // }

    if (body.guestCount != null) {
      where.guestCount = {
        gte: body.guestCount,
      };
    }

    if (body.childrenCount != null) {
      where.childrenCount = {
        gte: body.childrenCount,
      };
    }

    if (body.categoryId != null) {
      where.categoryId = body.categoryId;
    }

    if (body.hasParking != null) {
      where.hasParking = body.hasParking;
    }

    if (body.isAccessible != null) {
      where.isAccessible = body.isAccessible;
    }

    if (body.hasPlayground != null) {
      where.hasPlayground = body.hasPlayground;
    }

    if (body.wcCount != null) {
      where.wcCount = body.wcCount;
    }

    if (body.bathType != null) {
      where.bathType = body.bathType;
    }

    if (body.bathroomIsCombined != null) {
      where.bathroomIsCombined = body.bathroomIsCombined;
    }

    if (body.showerCount != null) {
      where.showerCount = body.showerCount;
    }

    if (body.bathroomCount != null) {
      where.bathroomCount = body.bathroomCount;
    }

    if (body.hasKitchen != null) {
      where.hasKitchen = body.hasKitchen;
    }

    if (body.hasBreakfast != null) {
      where.hasBreakfast = body.hasBreakfast;
    }

    if (body.hasLunch != null) {
      where.hasLunch = body.hasLunch;
    }

    if (body.hasLunch != null) {
      where.hasLunch = body.hasLunch;
    }

    if (body.startDate != null && body.endDate != null) {
      const { startDate, endDate } = body;
      const range = getDatesInRange(new Date(startDate), new Date(endDate));

      where = {
        ...where,
        bookingSlots: {
          some: {
            date: {
              lte: endDate,
              gte: startDate,
            },
          },
        },
      };
    }

    where = {
      ...where,
      price: {
        gte: body.priceMin || 0,
        lte: body.priceMax || 10000,
      },
    };

    console.log({
      where,
    });

    let list = await this.prisma.realty.findMany({
      include: {
        category: true,
        favorites: true,
        bookings: {
          select: {
            startDate: true,
            endDate: true,
            reviews: true,
          },
        },
        bookingSlots: true,
      },
      where,
    });

    if (body.startDate != null && body.endDate != null) {
      const { startDate, endDate } = body;
      const range = getDatesInRange(new Date(startDate), new Date(endDate));

      list = list.filter((realty) => {
        const hasAllSlotsOfRange = () => {
          const set = new Set(
            [...range].map((d) => dayjs(d).format('YYYY-MM-DD')),
          );
          console.log(1, {
            set,
            range,
          });
          for (const bs of realty.bookingSlots) {
            const key = dayjs(bs.date).format('YYYY-MM-DD');
            set.delete(key);
          }

          console.log(2, {
            set,
            range,
          });
          return set.size === 0;
        };

        const allSlotsFree = () => {
          const bookings = realty.bookings;

          for (const b of bookings) {
            const hasOverlaps = areIntervalsNonOverlapping(
              startDate,
              endDate,
              b.startDate,
              b.endDate,
            );

            if (hasOverlaps) {
              console.log(startDate, endDate, b.startDate, b.endDate);
              return false;
            }
          }

          return true;
        };

        return hasAllSlotsOfRange() && allSlotsFree();
      });
    }

    return list.map((item) => {
      let reviewsCount = 0;
      let sum = 0;

      item.bookings.forEach((b) => {
        reviewsCount += b.reviews?.length;
        sum += b?.reviews
          .filter((r) => r.status === ReviewStatus.APPROOVED)
          .reduce((acc, value) => acc + value.rating, 0);
      });

      return {
        ...item,
        rating: +(sum / reviewsCount).toFixed(2),
      };
    });
  }

  async getById(id: string) {
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

  async getRealtiesByUser(userId: string) {
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

    return {
      list: list.map((i) => ({
        ...i,
        rating: +(sum / reviewsCount).toFixed(2),
      })),
    };
  }

  async like(realtyId: string, userId: string) {
    const found = await this.prisma.favorites.findFirst({
      where: {
        realtyId,
        userId,
      },
    });

    if (found) {
      await this.prisma.favorites.delete({
        where: {
          id: found.id,
        },
      });
    } else {
      await this.prisma.favorites.create({
        data: {
          userId,
          realtyId,
        },
      });
    }
  }

  async getFavoritesRealties(userId: string) {
    const list = await this.prisma.favorites.findMany({
      where: {
        userId,
      },
      select: {
        realty: {
          include: {
            category: true,
            favorites: true,
            bookingSlots: true,
          },
        },
      },
    });

    return {
      list: list.map((i) => i.realty),
    };
  }

  async updateRealtyInfo(id: string, data) {
    const oldData = await this.prisma.realty.findUnique({
      where: {
        id,
      },
    });

    // const images = [];
    // if (data.images) {
    //   new Set([...data.images, ...oldData.images]).forEach((item) =>
    //     images.push(item),
    //   );
    // }

    if (data.price != null) {
      data.price = new Prisma.Decimal(data.price);
    }

    const categoryId = data.categoryId;

    let updateCategory: any = {
      category: {
        connect: {
          id: categoryId,
        },
      },
    };

    if (categoryId == null) {
      updateCategory = {};
    }

    delete data.categoryId;

    const updated = await this.prisma.realty.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...updateCategory,
      },
    });

    return updated;
  }

  async addBookingSlots(realtyId: string, dates: Date[]) {
    const created = await this.prisma.bookingSlots.createMany({
      data: dates.map((date) => ({
        realtyId,
        date,
      })),
    });

    return created;
  }
}
