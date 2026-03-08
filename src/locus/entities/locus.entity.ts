import { LocusMember } from './locus-member.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rnc_locus')
export class Locus {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'assembly_id' })
  assemblyId: string;

  @ApiProperty()
  @Column({ name: 'locus_name' })
  locusName: string;

  @ApiProperty()
  @Column({ name: 'public_locus_name' })
  publicLocusName: string;

  @ApiProperty()
  @Column()
  chromosome: string;

  @ApiProperty()
  @Column()
  strand: string;

  @ApiProperty()
  @Column({ name: 'locus_start', type: 'bigint' })
  locusStart: number;

  @ApiProperty()
  @Column({ name: 'locus_stop', type: 'bigint' })
  locusStop: number;

  @ApiProperty()
  @Column({ name: 'member_count' })
  memberCount: number;

  @ApiProperty({ type: () => [LocusMember], required: false })
  @OneToMany(() => LocusMember, (member) => member.locus)
  locusMembers: LocusMember[];
}
