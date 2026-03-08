import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocusModule } from './locus/locus.module';
import { Locus } from './locus/entities/locus.entity';
import { LocusMember } from './locus/entities/locus-member.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'hh-pgsql-public.ebi.ac.uk',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'pfmegrnargs',
      username: process.env.DB_USER || 'reader',
      password: process.env.DB_PASS || 'NWDMCE5xdipIjRrp',
      entities: [Locus, LocusMember],
      synchronize: false,
      ssl: false,
      logging: false,
    }),
    AuthModule,
    LocusModule,
  ],
})
export class AppModule {}
