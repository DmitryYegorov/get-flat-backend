import { TelegramService } from "./telegram.services";
import { Context, Markup, Telegraf } from "telegraf";
import { Action, InjectBot, Start, Update } from "nestjs-telegraf";
import * as dayjs from "dayjs";

function getHiddenLink(url, parse_mode = "markdown") {
	const emptyChar = "‎"; // copied and pasted the char from https://emptycharacter.com/
  
	switch (parse_mode) {
	  case "markdown":
		return `[${emptyChar}](${url})`;
	  case "HTML":
		return `<a href="${url}">${emptyChar}</a>`;
	  default:
		throw new Error("invalid parse_mode");
	}
  }

@Update()
export class TelegramController {
    constructor(
        @InjectBot() private readonly bot: Telegraf<Context>,
        private readonly service: TelegramService
    ) {}

    @Start()
    async startCommand(ctx: Context) {
        const from = ctx.message.from;

        const foundUser = await this.service.getUserByTelegram(from.username);
        if (foundUser) {
            await ctx.reply(`${foundUser.firstName} ${foundUser.middleName} ${foundUser.lastName}, чем могу вам помочь?`, Markup.inlineKeyboard([
                // 'Мои брони', 'Моя недвижимость',
                // 'Оставить отзыв', 'Найти жилье',
                Markup.button.callback('Мои брони', 'my_bookings'),
                Markup.button.callback('Моя недвижимость', 'my_realty'),
                Markup.button.callback('Оставить отзыв', 'add_review'),
                Markup.button.callback('Найти жилье', 'search_realty'),
            ], {
                columns: 2
            }));
        } else {
            await ctx.reply(`${from.first_name} ${from.last_name}, добро пожаловать! Рекомендую привязать свой Telegram-аккаунт к нашему сайту чтобы я мог быть Вам ешё полезнее!`);
        }
    }

    @Action('my_bookings')
    async getMyBookings(ctx: Context) {
        const from = ctx.from;
        const user = await this.service.getUserByTelegram(from.username);
        const bookings = await this.service.getMyBookingsList(user.id);

		if (bookings.length === 0) {
			await ctx.reply('У вас пока нет предстоящих броней. Но вы можете выбрать что-нибудь на нашем сайте 😜');
			return;
		}

		await ctx.reply('Ваши брони:', Markup.inlineKeyboard([
			bookings.map(b => {

				const dateStr = `c ${dayjs(b.startDate).format('DD-MM-YYYY')} по ${dayjs(b.endDate).format('DD-MM-YYYY')}`;
				const locationStr = `${(b?.realty?.location as any)?.label} ${(b?.realty?.location as any)?.cityName ?? ''}`
				const labelBtn = `${b?.realty?.title} ${dateStr}, ${locationStr}`;
				return Markup.button.callback(labelBtn, `booking-${b.id}`);
			}, {columns: 1})
		]));
    }

	@Action(/booking-(.*)/)
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
			...Markup.inlineKeyboard([[
				Markup.button.callback('❌ Отменить', `cancel-booking-${bookingId}`)
			]])
		});
	}
}