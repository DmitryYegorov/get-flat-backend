import { TelegramService } from './telegram.services';
import { Context, Markup, Telegraf } from 'telegraf';
import { Action, InjectBot, Start, Update } from 'nestjs-telegraf';
import * as dayjs from 'dayjs';
import { RealtyStatus } from 'src/common/enum';
import { response } from 'express';

function getHiddenLink(url, parse_mode = 'markdown') {
  const emptyChar = '‎'; // copied and pasted the char from https://emptycharacter.com/

  switch (parse_mode) {
    case 'markdown':
      return `[${emptyChar}](${url})`;
    case 'HTML':
      return `<a href="${url}">${emptyChar}</a>`;
    default:
      throw new Error('invalid parse_mode');
  }
}

const statusMap = {
  [RealtyStatus.ACTIVE]: '✅',
  [RealtyStatus.CREATED]: '⚪',
  [RealtyStatus.DRAFT]: '🖊️',
  [RealtyStatus.MODERATION]: '👀',
  [RealtyStatus.REJECTED]: '🔴',
};

const statusWordMap = {
  [RealtyStatus.ACTIVE]: 'Активно',
  [RealtyStatus.CREATED]: 'Создано',
  [RealtyStatus.DRAFT]: 'Черновик',
  [RealtyStatus.MODERATION]: 'На проверке',
  [RealtyStatus.REJECTED]: `Отклонено`,
};

@Update()
export class TelegramController {
  constructor(private readonly service: TelegramService) {}

  @Start()
  async startCommand(ctx: Context) {
    const from = ctx.message.from;

    const foundUser = await this.service.getUserByTelegram(from.username);
    if (foundUser) {
      const chatId = (await ctx.getChat()).id;
      await ctx.reply(
        `${foundUser.firstName} ${foundUser.middleName} ${foundUser.lastName}, чем могу вам помочь?`,
        Markup.inlineKeyboard(
          [
            Markup.button.callback('Мои брони', 'my_bookings'),
            Markup.button.callback('Моя недвижимость', 'my_realty'),
            // Markup.button.callback('Оставить отзыв', 'add_review'),
            // Markup.button.callback('Найти жилье', 'search_realty'),
          ],
          {
            columns: 2,
          },
        ),
      );

      await this.service.saveChatId(foundUser.id, String(chatId));
    } else {
      await ctx.reply(
        `${from.first_name} ${from.last_name}, добро пожаловать! Рекомендую привязать свой Telegram-аккаунт к нашему сайту чтобы я мог быть Вам ешё полезнее!`,
      );
    }
  }

  @Action('my_bookings')
  async getMyBookings(ctx: Context) {
    const from = ctx.from;
    const user = await this.service.getUserByTelegram(from.username);
    const bookings = await this.service.getMyBookingsList(user.id);

    if (bookings.length === 0) {
      await ctx.reply(
        'У вас пока нет предстоящих броней. Но вы можете выбрать что-нибудь на нашем сайте 😜',
      );
      return;
    }

    await ctx.reply(
      'Ваши брони:',
      Markup.inlineKeyboard(
        bookings.map((b) => {
          const dateStr = `c ${dayjs(b.startDate).format('DD-MM-YYYY')} по ${dayjs(b.endDate).format('DD-MM-YYYY')}`;
          const locationStr = `${(b?.realty?.location as any)?.label} ${(b?.realty?.location as any)?.cityName ?? ''}`;
          const labelBtn = `${b?.realty?.title} ${dateStr}, ${locationStr}`;
          return [Markup.button.callback(labelBtn, `booking-${b.id}`)];
        }),
      ),
    );
  }

  @Action('my_realty')
  async getMyRealties(ctx: Context) {
    const from = ctx.from;
    const user = await this.service.getUserByTelegram(from.username);
    const realties = await this.service.getMyRealties(user.id);

    if (realties.length === 0) {
      await ctx.reply(
        'У вас пока нет созданный объявлений. Но Вы можете это сделать на нашем сайте!',
      );
      return;
    }

    await ctx.reply(
      'Ваши недвижимости:',
      Markup.inlineKeyboard(
        realties.map((r) => {
          const labelBtn = `${r.title}, ${statusMap[r.status]} ${statusWordMap[r.status]}`;
          return [Markup.button.callback(labelBtn, `realty-${r.id}`)];
        }),
      ),
    );
  }

  @Action(/^booking-(.*)$/)
  async getBookingData(ctx: Context) {
    const bookingId = (ctx as any).match[1];
    const booking = await this.service.getBookingById(bookingId);

    const message = [
      `<b>${booking.realty.category.name}</b>: ${booking.realty.title}`,
      `<b>Где</b>: ${(booking.realty?.location as any)?.flag} ${(booking.realty?.location as any).label ?? ''} ${(booking.realty?.location as any).cityName ?? ''} ${booking.realty?.address}`,
      `<b>Стоимость</b>: ${booking.total}$, (${dayjs(booking.endDate).diff(dayjs(booking.startDate), 'days')} дней)`,
      `<b>Дата въезда</b>: <i>${dayjs(booking.startDate).format('DD-MM-YYYY')}</i>`,
      `<b>Дата выезда</b>: <i>${dayjs(booking.endDate).format('DD-MM-YYYY')}</i>`,
      `<b>Кол-во гостей</b>: ${booking.guestCount}, ${booking.childrenCount == 0 ? 'без детей' : `+ ${booking.childrenCount} мест для детей`}\n`,
      `<b>Код для въезда</b>: <u>${booking.secretCode}</u> - назовите этот код по приезду для того, чтобы хозяин убедился что это Вы`,

      getHiddenLink(booking.realty.mainPhoto, 'HTML'),
    ];

    await ctx.reply(message.join('\n'), {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback(`❌ Отменить`, `cancelbooking-${bookingId}`)],
      ]),
    });
  }

  @Action(/^cancelbooking-(.*)$/)
  async cancelBooking(ctx: Context) {
	console.log('удаление брони');
    const bookingId = (ctx as any).match[1];


    await this.service.cancelBooking(bookingId);

    await ctx.reply('Бронирование успешно отменено!', {
      parse_mode: 'HTML',
    });
  }

  @Action(/realty-(.*)/)
  async getOneRealty(ctx: Context) {
    const realtyId = (ctx as any).match[1];
    const realty = await this.service.getRealty(realtyId);

    const response = `
	<b>${realty.title}</b>\n
	
	<b>Статус:</b> ${statusMap[realty.status]} <i>${statusWordMap[realty.status]}</i>\n
	${realty.status === RealtyStatus.REJECTED ? `<b>Причина блокировки</b>: ${realty.rejectionNotes}]\n` : ''}\n
	=== <b>Ваше Описание</b> ====
	<i>${realty.description}</i>
	===================\n
	${getHiddenLink(realty.mainPhoto, 'HTML')}
	`;

    const btns = [
      [
        Markup.button.url(
          'Редактирование',
          `http://127.0.0.1:3000/my-realty/${realtyId}`,
        ),
      ],
    ];

    await ctx.reply(response, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(btns),
    });
  }
}
