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
            await ctx.reply(`${foundUser.firstName} ${foundUser.middleName} ${foundUser.lastName}, чем могу вам помочь?`, Markup.keyboard([
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

        const message = [];
        bookings.forEach((b, i) => {
            const location: any = b.realty.location;
            console.log({location});
            message.push(`${i+1}) ${b.realty.title}, ${location?.label!}, ${location?.cityName!} c ${dayjs(b.startDate).format('DD-MM-YYYY')} по ${dayjs(b.endDate).format('DD-MM-YYYY')}\n`);
        });

        await ctx.reply(message.join(''));
    }
}