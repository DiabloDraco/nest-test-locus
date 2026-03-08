import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { LocusQueryDto } from './dto/locus-query.dto';
import { Locus } from './entities/locus.entity';
import { SideloadEnum } from 'src/common/enums/sideload.enum';

const RESTRICTED_REGION_IDS = [86118093, 86696489, 88186467];

const SORTABLE_FIELDS = new Set([
  'id',
  'assemblyId',
  'locusName',
  'publicLocusName',
  'chromosome',
  'strand',
  'locusStart',
  'locusStop',
  'memberCount',
]);

export interface LocusResponse {
  data: Partial<Locus>[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class LocusService {
  constructor(
    @InjectRepository(Locus)
    private locusRepository: Repository<Locus>,
  ) {}

  async getLocus(query: LocusQueryDto, user: { role: Role }): Promise<LocusResponse> {
    const {
      id,
      assemblyId,
      regionId,
      membershipStatus,
      include,
      page = 1,
      limit = 1000,
      sortBy,
      sortOrder = 'ASC',
    } = query;

    const qb = this.locusRepository.createQueryBuilder('rl');

    const withSideload =
      include === SideloadEnum.locusMembers && user.role !== Role.USER;

    if (withSideload) {
      qb.leftJoinAndSelect('rl.locusMembers', 'rlm');
    }

    if (user.role === Role.RESTRICTED) {
      if (withSideload) {
        qb.andWhere('rlm.regionId IN (:...restrictedIds)', {
          restrictedIds: RESTRICTED_REGION_IDS,
        });
      } else {
        qb.innerJoin('rl.locusMembers', 'rlmRestrict').andWhere(
          'rlmRestrict.regionId IN (:...restrictedIds)',
          { restrictedIds: RESTRICTED_REGION_IDS },
        );
      }
    }

    if (id && id.length > 0) {
      qb.andWhere('rl.id IN (:...ids)', { ids: id });
    }

    if (assemblyId) {
      qb.andWhere('rl.assemblyId = :assemblyId', { assemblyId });
    }

    if ((regionId && regionId.length > 0) || membershipStatus) {
      if (!withSideload && user.role !== Role.RESTRICTED) {
        qb.innerJoin('rl.locusMembers', 'rlmFilter');
        if (regionId && regionId.length > 0) {
          qb.andWhere('rlmFilter.regionId IN (:...regionIds)', { regionIds: regionId });
        }
        if (membershipStatus) {
          qb.andWhere('rlmFilter.membershipStatus = :membershipStatus', {
            membershipStatus,
          });
        }
      } else {
        const alias = withSideload ? 'rlm' : 'rlmRestrict';
        if (regionId && regionId.length > 0) {
          qb.andWhere(`${alias}.regionId IN (:...regionIds)`, { regionIds: regionId });
        }
        if (membershipStatus) {
          qb.andWhere(`${alias}.membershipStatus = :membershipStatus`, {
            membershipStatus,
          });
        }
      }
    }

    if (sortBy && SORTABLE_FIELDS.has(sortBy)) {
      qb.orderBy(`rl.${sortBy}`, sortOrder);
    } else {
      qb.orderBy('rl.id', 'ASC');
    }

    const total = await qb.getCount();

    qb.skip((page - 1) * limit).take(limit);

    const results = await qb.getMany();

    const data = results.map((locus) => this.applyRoleFilter(locus, user.role, withSideload));

    return { data, total, page, limit };
  }

  private applyRoleFilter(
    locus: Locus,
    role: Role,
    withSideload: boolean,
  ): Partial<Locus> {
    if (role === Role.USER) {
      const { locusMembers: _lm, ...rest } = locus;
      return rest;
    }
    if (!withSideload) {
      const { locusMembers: _lm, ...rest } = locus;
      return rest;
    }
    return locus;
  }
}
