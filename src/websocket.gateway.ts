import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { BookingService } from './booking/booking.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly bookingService: BookingService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { from: string; text: string; bookingId: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const message = await this.bookingService.addMessage(
      data.bookingId,
      data.from,
      data.text,
    );
    console.log('created message', message);
    const list = await this.bookingService.getBookingChat(
      data.from,
      data.bookingId,
    );
    this.server.emit('newMessage', list);
  }

  @SubscribeMessage('requestAllMessages')
  async handleAllMessagesRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: string; bookingId: string },
  ): Promise<void> {
    const messages = await this.bookingService.getBookingChat(
      payload.userId,
      payload.bookingId,
    );
    client.emit('allMessages', messages);
  }

  @SubscribeMessage('readMessages')
  async readMessages(@MessageBody() payload: { bookingId: string }) {
    await this.bookingService.allMessagesRead(payload.bookingId);
  }
}
