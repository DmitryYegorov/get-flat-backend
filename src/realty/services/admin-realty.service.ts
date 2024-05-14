import {Injectable} from "@nestjs/common";
import {PrismaService} from "src/prisma/prisma.service";
import {RealtyStatus} from "../../common/enum";

@Injectable()
export class AdminRealtyService {
	constructor(
		private readonly prisma: PrismaService
	) {}

	async rejectRealty(realtyId: string, notes: string) {
		const updated = await this.prisma.realty.update({
			where: {
				id: realtyId,
			},
			data: {
				status: RealtyStatus.REJECTED,
				rejectionNotes: notes,
			}
		});

		return updated;
	}

	async approveRealty(realtyId: string) {
		const updated = await this.prisma.realty.update({
			where: {
				id: realtyId,
			},
			data: {
				status: RealtyStatus.ACTIVE
			}
		});

		return updated;
	}

	async getCreatedRealties() {
		const list = await this.prisma.realty.findMany({
			where: {
				status: {
					in: [RealtyStatus.MODERATION, RealtyStatus.REJECTED]
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		});

		console.log(list);

		return list;
	}
}