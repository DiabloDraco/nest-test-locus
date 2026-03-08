import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../common/enums/role.enum';
import { LocusQueryDto } from './dto/locus-query.dto';
import { LocusService } from './locus.service';

@ApiTags('Locus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('locus')
export class LocusController {
  constructor(private locusService: LocusService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список локусов',
    description:
      'Доступ зависит от роли: admin видит все данные  user видит тока обычные данные без подгрузки, ' +
      'restricted видит только записи с regionId из (86118093, 86696489, 88186467)',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [
          {
            id: 3106326,
            assemblyId: 'WEWSeq_v.1.0',
            locusName:
              'cfc38349266a6bc69956bedc917d0edb@4A/547925668-547987324:1',
            publicLocusName: '432B32430F9FCBB8',
            chromosome: '4A',
            strand: '1',
            locusStart: 547925668,
            locusStop: 547987324,
            memberCount: 259,
          },
        ],
        total: 12000,
        page: 1,
        limit: 1000,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getLocus(
    @Query() query: LocusQueryDto,
    @CurrentUser() user: { role: Role },
  ) {
    return this.locusService.getLocus(query, user);
  }
}
