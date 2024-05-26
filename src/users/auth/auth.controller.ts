import { Body, Post, Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('/users/auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/register')
  async registerUser(@Body() body: RegisterDto) {
    const res = await this.service.register(body);

    return res;
  }

  @Post('/login')
  async loginUser(@Body() body: LoginDto) {
    const res = await this.service.login(body);

    return res;
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req) {
    let user = req.user;

    user = await this.service.getCurrentUser(user.id);
    return {
      payload: user,
    };
  }

  @Get('/confirm-email/:id')
  async confirmEmail(@Param('id') id) {
    return this.service.confirmEmail(id);
  }
}
