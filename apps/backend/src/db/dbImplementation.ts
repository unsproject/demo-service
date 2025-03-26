import { DBContext } from '@unsproject/service-gateway/dist/api';
import { AuthTicketModel } from '../model/authTicket';
import { AuthTicket } from '@unsproject/common';
import { UserModel } from '../model/users';

export class DBImplementation implements DBContext {
	async createTicket(ticket: AuthTicket): Promise<AuthTicket> {
		return await AuthTicketModel.create(ticket);
	}
	async updateTicketToAuthorized(
		ticket: AuthTicket,
		serviceUserId: string
	): Promise<AuthTicket> {
		const returnTicket = await AuthTicketModel.findOneAndUpdate(
			{ nonce: ticket.nonce },
			{ status: 'AUTHORIZED', serviceUserId: serviceUserId },
			{ new: true }
		);
		if (!returnTicket) throw Error('Missing Ticket');
		let user = await UserModel.findOne({ serviceUserId });
		if (!user) user = await UserModel.create({ serviceUserId });
		if (!user) throw Error('User Wasnt Created');
		return returnTicket;
	}
	async updateTicketToClaimed(ticket: AuthTicket): Promise<AuthTicket> {
		const returnTicket = await AuthTicketModel.findOneAndUpdate(
			{ nonce: ticket.nonce },
			{ status: 'CLAIMED', guardianUrl: ticket.guardianUrl },
			{ new: true }
		);
		if (returnTicket) return returnTicket;
		throw Error('Missing Ticket');
	}
	async getTicket(nonce: string): Promise<AuthTicket> {
		const ticket = await AuthTicketModel.findOne({ nonce: nonce });
		if (ticket) return ticket;
		throw Error('Missing Ticket');
	}
}
