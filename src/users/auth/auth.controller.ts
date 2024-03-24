import { Body, Post, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
