import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Role } from '../auth/decorators/roles.decorator';
import { Roles } from '../enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  @ApiBearerAuth('bearer')
  findAll() {
    return this.dashboardService.findAll();
  }
}
