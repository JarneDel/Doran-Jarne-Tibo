import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { StockModule } from './stock/stock.module'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedModule } from './seed/seed.module'
import { GroupsModule } from './groups/groups.module'
import { LoanableMaterialsModule } from './loanable-materials/loanable-materials.module'
import { AuthenticationModule } from './authentication/authentication.module'
import { ConfigModule } from '@nestjs/config'
import { StaffModule } from './staff/staff.module'
import { ServiceModule } from './service/service.module'
import { RoomModule } from './room/room.module'
import { SportModule } from './sport/sport.module'
import { UsersModule } from './users/users.module'
import { ReservationModule } from './reservation/reservation.module'
import { RepairRequestModule } from './repair-request/repair-request.module'
import { VacationRequestModule } from './vacation-request/vacation-request.module'

@Module({
  imports: [
    ConfigModule.forRoot({}),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // includeStacktraceInErrorResponses: process.env.NODE_ENV != 'production',
      includeStacktraceInErrorResponses: false,
      // playground: process.env.NODE_ENV == "production" ? false : true, // todo: uncomment before production
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`,
      database: process.env.DB_NAME ?? 'api',
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: process.env.NODE_ENV != 'production', // Careful with this in production
      useNewUrlParser: true,
      useUnifiedTopology: true, // Disable deprecated warnings
      directConnection: true,
    }),
    StockModule,
    GroupsModule,
    SeedModule,
    LoanableMaterialsModule,
    AuthenticationModule,
    StaffModule,
    ServiceModule,
    RoomModule,
    SportModule,
    UsersModule,
    ReservationModule,
    RepairRequestModule,
    VacationRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
