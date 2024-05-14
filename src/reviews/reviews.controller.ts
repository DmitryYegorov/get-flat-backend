import {Body, Controller, Get, Post} from "@nestjs/common";
import {ReviewsService} from "./reviews.service";

@Controller('/admin/reviews')
export class ReviewsController {
	constructor(
		private readonly service: ReviewsService
	) {}

	@Get('created')
	async getAllCreatedReviews() {
		const res = await this.service.getAllCreatedReviews();

		return res;
	}

	@Post('approve')
	async approveReview(@Body() body) {
		const {reviewId} = body;

		return this.service.approoveReview(reviewId);
	}

	@Post('reject')
	async rejectReview(@Body() body) {
		const {reviewId, rejectNotes} = body;

		return this.service.rejectReview(reviewId, rejectNotes);
	}

}