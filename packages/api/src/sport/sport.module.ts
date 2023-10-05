// Common
import { Module } from '@nestjs/common'
// Services
import { SportService } from './sport.service'
// Resolvers
import { SportResolver } from './sport.resolver'
// TypeOrm
import { TypeOrmModule } from '@nestjs/typeorm'
// Entities
import { Sport } from './entities/sport.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  providers: [SportResolver, SportService],
  exports: [SportService],
})
export class SportModule {}
