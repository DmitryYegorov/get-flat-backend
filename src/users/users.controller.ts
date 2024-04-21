import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from './auth/auth.guard';

@Controller('/users')
export class UserController {
  constructor(private readonly service: UsersService) {}

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    return this.service.getUserById(id);
  }

  @Patch('/:id/update')
  @UseGuards(AuthGuard)
  updateUserData(@Param('id') id: string, @Body() body: any) {
    return this.service.updateUserData(id, body);
  }
}
