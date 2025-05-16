import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/enum';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  @ApiBearerAuth('bearer')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Elementos por página',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.auditLogService.findAll(page, limit);
  }
}
