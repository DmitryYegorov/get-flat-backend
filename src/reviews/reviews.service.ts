import {Injectable} from "@nestjs/common";
import {ReviewStatus} from "src/common/enum";
import {PrismaService} from "src/prisma/prisma.service";

@Injectable()
export class ReviewsService {
	constructor(
		private readonly prisma: PrismaService,
	) {}

	async getAllCreatedReviews() {
		const reviews = await this.prisma.reviews.findMany({
			where: {
				status: ReviewStatus.CREATED,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				booking: {
					include: {
						realty: true,
						user: true,
					}
				}
			}
		});

		return reviews.map(r => ({
			...r,
			user: r.booking.user,
			realty: r.booking.realty,
		}));
	}

	async getAllRejectedReviews() {
		const reviews = await this.prisma.reviews.findMany({
			where: {
				status: ReviewStatus.REJECTED,
			},
			orderBy: {
				createdAt: 'desc',
			}
		});

		return reviews;
	}

	async rejectReview(reviewId: string, notes: string) {
		const updatedReview = await this.prisma.reviews.update({
			where: {
				id: reviewId,
			},
			data: {
				status: ReviewStatus.REJECTED,
				rejectNotes: notes,
			},
		});

		return updatedReview;
	}

	async approoveReview(reviewId: string) {
		const updatedReview = await this.prisma.reviews.update({
			where: {
				id: reviewId,
			},
			data: {
				status: ReviewStatus.APPROOVED,
			},
		});

		return updatedReview;
	}

}