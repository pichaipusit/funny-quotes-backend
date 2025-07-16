import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { Quote } from './quote.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, User])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
