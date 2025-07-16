import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from './quote.entity';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote) private quoteRepo: Repository<Quote>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  private async validateQuoteAccess(
    id: number,
    userId: number,
    forEdit = false,
  ): Promise<Quote> {
    const quote = await this.quoteRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!quote) throw new NotFoundException('Quote not found');
    if (quote.user.id !== userId)
      throw new ForbiddenException('You can only modify your own quotes');
    if (forEdit && quote.votes > 0)
      throw new ForbiddenException('Cannot modify a quote that has votes');

    return quote;
  }

  async create(text: string, user: User) {
    const fullUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!fullUser) throw new NotFoundException('User not found');

    const quote = this.quoteRepo.create({ text, user: fullUser });
    return this.quoteRepo.save(quote);
  }

  async findAll({
    search,
    sort,
  }: {
    search?: string;
    sort?: 'votes' | 'text';
  }) {
    const query = this.quoteRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.user', 'user');

    if (search) {
      query.where('quote.text LIKE :search', { search: `%${search}%` });
    }

    if (sort) {
      query.orderBy(`quote.${sort}`, 'DESC');
    }

    return query.getMany();
  }

  async update(id: number, text: string, userId: number) {
    const quote = await this.validateQuoteAccess(id, userId, true); // true = for edit
    quote.text = text;
    const updated = await this.quoteRepo.save(quote);

    return {
      message: 'Quote updated successfully',
      updatedQuote: {
        text: updated.text,
        votes: updated.votes,
        user: {
          id: updated.user.id,
          username: updated.user.username,
        },
      },
    };
  }

  async delete(id: number, userId: number) {
    const quote = await this.validateQuoteAccess(id, userId, true);
    await this.quoteRepo.remove(quote);

    return {
      message: 'Quote deleted successfully',
      deletedQuote: {
        text: quote.text,
        votes: quote.votes,
        user: {
          id: quote.user.id,
          username: quote.user.username,
        },
      },
    };
  }

  async vote(id: number) {
    const quote = await this.quoteRepo.findOneBy({ id });

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    quote.votes += 1;
    return this.quoteRepo.save(quote);
  }
}
