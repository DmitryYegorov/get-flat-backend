import {Body, Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
import {AdminUsersService} from "../services/admin-users.service";
import {AuthGuard} from "../auth/auth.guard";

@Controller('/admin/users')
export class AdminUsersController {
	constructor(
		private readonly service: AdminUsersService
	) {}

	@Get('/list')
	@UseGuards(AuthGuard)
	async getUsersList(@Request() req) {
		const user = req.user;

		return this.service.getUsersList(user.id);
	}

	@Post('/block')
	async blockUser(@Body() body) {
		return this.service.blockUser(body.userId, body.blockNotes);
	}

	@Post('/unblock')
	async unblockUser(@Body() body) {
		return this.service.unblockUser(body.userId);
	}

	@Post('/block-publications')
	async blockPublicationsForUser(@Body() body) {
		return this.service.blockPublicationsForUser(body.userId, body.blockNotes);
	}

	@Post('/send-activation-letter')
	async sendActivationLetter(@Body() body) {
		return this.service.sendActicationLetter(body.userId);
	}
}