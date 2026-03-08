import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Locus } from './locus.entity';

@Entity('rnc_locus_members')
export class LocusMember {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'locus_id' })
  locusId: number;

  @ApiProperty()
  @Column({ name: 'region_id' })
  regionId: number;

  @ApiProperty()
  @Column({ name: 'membership_status' })
  membershipStatus: string;

  @ApiProperty({ nullable: true })
  @Column({ name: 'assembly_id', nullable: true })
  assemblyId: string;

  @ApiProperty({ nullable: true })
  @Column({ name: 'urs_taxid', nullable: true })
  ursTaxid: string;

  @ManyToOne(() => Locus, (locus) => locus.locusMembers)
  @JoinColumn({ name: 'locus_id' })
  locus: Locus;
}
