import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestsModule } from './requests/requests.module';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [
    MessagesModule,
    NotificationsModule,
    RequestsModule,
    OffersModule,
  ],
  exports: [
    MessagesModule,
    NotificationsModule,
    RequestsModule,
    OffersModule,
  ],
})
export class CommunicationModule {}

