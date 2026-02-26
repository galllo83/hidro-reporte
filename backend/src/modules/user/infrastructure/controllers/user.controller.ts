import {
  Controller,
  Inject,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { User } from '../../domain/entities/user.model';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { IUserService } from '../../application/ports/in/user-service.interface';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UserSortParamsEnum } from '../../../../helpers/enums/userParamsEnum';
import { OrderParamsEnum } from '../../../../helpers/enums/orderParamsEnum';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { Role } from '../../../../helpers/enums/role.enum';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    @Inject('IUserService')
    private readonly userService: IUserService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, description: 'The user has been found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiQuery({
    name: 'order',
    enum: OrderParamsEnum,
    required: false,
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'sortBy',
    enum: UserSortParamsEnum,
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'page',
    example: 1,
    required: true,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    example: 10,
    required: true,
    description: 'Record limit',
  })
  async findAll(
    @Query('sortBy') sortBy: UserSortParamsEnum,
    @Query('order') order: OrderParamsEnum,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll(sortBy, order, { page, limit });
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The user has been found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, description: 'The user has been deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only.' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.delete(id);
  }
}
