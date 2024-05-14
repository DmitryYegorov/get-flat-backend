import {Body, Controller, Get, Post} from "@nestjs/common";
import {AdminRealtyService} from "../services/admin-realty.service";

@Controller('/admin/realty')
export class AdminRealtyController {
	constructor(
		private readonly service: AdminRealtyService
	) {}

	@Get('/created')
	async getAllCreated() {
		const list = await this.service.getCreatedRealties();

		return list;
	}

	@Post('/reject')
	async rejectRealty(@Body() body) {
		const {realtyId, rejectionNotes} = body;
		
		return this.service.rejectRealty(realtyId, rejectionNotes);
	}

	@Post('/approve')
	async approveRealty(@Body() body) {
		const {realtyId} = body;
		
		return this.service.approveRealty(realtyId);
	}
}