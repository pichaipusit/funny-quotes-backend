import { Module } from '@nestjs/common';

import { Quote } from './quotes/quote.entity';
import { User } from './users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { QuotesModule } from './quotes/quotes.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // ❗️Set to false in production
    }),
    TypeOrmModule.forFeature([User, Quote]),
    AuthModule,
    UsersModule,
    QuotesModule,
  ],
})
export class AppModule {}
