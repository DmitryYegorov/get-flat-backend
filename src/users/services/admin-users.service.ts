import {Injectable} from "@nestjs/common";
import {UserStatus} from "src/common/enum";
import {WelcomeNewUserContext} from "src/mail/types/context/welcome-new-user.context";
import {PrismaService} from "src/prisma/prisma.service";
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AdminUsersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly mailService: MailService
	) {}

	async getUsersList(userId: string) {
		const list = await this.prisma.user.findMany({
			where: {
				id: {
					not: userId,
				}
			}
		});

		return list;
	}

	async blockUser(userId: string, reason: string) {
		const updated = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				status: UserStatus.BLOCKED,
				blockNotes: reason,
			}
		});

		return updated;
	}

	async unblockUser(userId: string) {
		const updated = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				status: UserStatus.CREATED,
				blockNotes: null,
			}
		});

		return updated;
	}

	async blockPublicationsForUser(userId: string, reason: string) {
		const updated = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				status: UserStatus.PUBLICATIONS_BLOCKED,
				blockNotes: reason,
			}
		});

		return updated;
	}

	async unblockPublicationsForUser(userId: string) {
		const updated = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				status: UserStatus.CREATED,
				blockNotes: null
			}
		});

		return updated;
	}

	async sendActicationLetter(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		const mailContext: WelcomeNewUserContext = {
			fullName: `${user.firstName} ${user.middleName} ${user.lastName}`,
			activationCode: user.id,
		  };
		  await this.mailService
			.sendMail<WelcomeNewUserContext>(
			  {
				email: user.email,
				templateId: 'welcome-new-user',
				subject: 'Welcome to the HomeGuru!',
			  },
			  mailContext,
			)
	}
}