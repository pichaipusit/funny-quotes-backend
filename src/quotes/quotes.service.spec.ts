import { Test } from '@nestjs/testing';
import { QuotesService } from './quotes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quote } from './quote.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

describe('QuotesService', () => {
  let service: QuotesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuotesService,
        { provide: getRepositoryToken(Quote), useClass: Repository },
      ],
    }).compile();

    service = module.get<QuotesService>(QuotesService);
  });

  it('should create quote', async () => {
    const result = await service.create('Test quote', { id: 1 } as User);
    expect(result).toBeDefined();
  });
});
