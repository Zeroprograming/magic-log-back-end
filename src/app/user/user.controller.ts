import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  ListaUsuariosResponse,
  UserProfileFiltersDto,
} from '../../models/user/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get users by role with filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users with the specified filters.',
    type: ListaUsuariosResponse,
  })
  @Get('list')
  async getUsersByRole(
    @Query() filters: UserProfileFiltersDto,
  ): Promise<ListaUsuariosResponse> {
    return this.userService.getUsersByRole(filters);
  }
}
