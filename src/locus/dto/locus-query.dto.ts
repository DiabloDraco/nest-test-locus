import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SideloadEnum } from 'src/common/enums/sideload.enum';

export class LocusQueryDto {
  @ApiPropertyOptional({
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  id?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional({
    description: 'Можно несколько так: ?regionId=1&regionId=2',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  regionId?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({
    description: 'С какой табллицы включить связь лефт жойн',
    enum: SideloadEnum,
  })
  @IsOptional()
  @IsEnum(SideloadEnum)
  include?: 'locusMembers';

  @ApiPropertyOptional({ description: 'Пагинация стр', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'сколько за раз выводить щас 1000',
    default: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  limit?: number = 1000;

  @ApiPropertyOptional({
    description: 'По какому полю сортировать (id, locusStart, locusStop, memberCount)',
    example: 'id',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'аск деск',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
