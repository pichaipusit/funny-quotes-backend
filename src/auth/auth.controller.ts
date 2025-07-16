import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() dto: { username: string; password: string }) {
    try {
      return await this.usersService.create(dto.username, dto.password);
    } catch (err) {
      console.error(err); // Log the real error
      throw new InternalServerErrorException('Registration failed');
    }
  }

  @Post('login')
  async login(@Body() dto: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    if (!user) throw new UnauthorizedException();
    return this.authService.login(user);
  }
}
