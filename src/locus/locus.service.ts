import { Injectable } from '@nestjs/common';
import { CreateLocusDto } from './dto/create-locus.dto';
import { UpdateLocusDto } from './dto/update-locus.dto';

@Injectable()
export class LocusService {
  create(createLocusDto: CreateLocusDto) {
    return 'This action adds a new locus';
  }

  findAll() {
    return `This action returns all locus`;
  }

  findOne(id: number) {
    return `This action returns a #${id} locus`;
  }

  update(id: number, updateLocusDto: UpdateLocusDto) {
    return `This action updates a #${id} locus`;
  }

  remove(id: number) {
    return `This action removes a #${id} locus`;
  }
}
