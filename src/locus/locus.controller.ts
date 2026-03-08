import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocusService } from './locus.service';
import { CreateLocusDto } from './dto/create-locus.dto';
import { UpdateLocusDto } from './dto/update-locus.dto';

@Controller('locus')
export class LocusController {
  constructor(private readonly locusService: LocusService) {}
  @Get()
  findAll() {
    return this.locusService.findAll();
  }
}
