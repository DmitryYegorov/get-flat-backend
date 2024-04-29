import { TelegramService } from "./telegram.services";
import { Context, Markup, Telegraf } from "telegraf";
import { Action, InjectBot, Start, Update } from "nestjs-telegraf";
import * as dayjs from "dayjs";

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

        const message = [
            "<b>Ваши брони:</b>\n\n"
        ];
        bookings.forEach((b, i) => {
            const location: any = b.realty.location;
            const row = [`<b>${b.realty.title}</b>`, location?.label, location?.cityName, `<i><u>c ${dayjs(b.startDate).format('DD-MM-YYYY')} по ${dayjs(b.endDate).format('DD-MM-YYYY')}</u></i>`, `<b><a href='http://127.0.0.1:3000/my-bookings/${b.id}'>Паспорт бронирования</a></b>`, `\n\n`].filter(s => !!s);
            message.push(`${i+1})`.concat(row.join(', ')));
        });

        console.log(message.join(''))

        await ctx.replyWithHTML(message.join(''));
    }
}