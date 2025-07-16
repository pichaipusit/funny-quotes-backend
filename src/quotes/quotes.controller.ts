import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QuotesService } from './quotes.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('quotes')
export class QuotesController {
  constructor(private quoteService: QuotesService) {}

  @Post()
  async create(@Body() body: { text: string }, @Request() req) {
    return await this.quoteService.create(body.text, req.user);
  }

  @Get()
  async findAll(@Query() query: { search?: string; sort?: 'votes' | 'text' }) {
    return await this.quoteService.findAll(query);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: { text: string },
    @Request() req,
  ) {
    return this.quoteService.update(id, body.text, req.user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req) {
    return await this.quoteService.delete(id, req.user.userId);
  }

  @Post(':id/vote')
  vote(@Param('id') id: number) {
    return this.quoteService.vote(id);
  }
}
