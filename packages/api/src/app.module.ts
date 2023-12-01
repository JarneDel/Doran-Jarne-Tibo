import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
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
import { AppLoggerMiddleware } from './middleware/app.logger.middleware'
import { StaffRegisterModule } from './staff-register/staff-register.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'

@Module({
  imports: [
    ConfigModule.forRoot({}),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      // installSubscriptionHandlers: true,
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
    MailerModule.forRoot({
      transport: {
        service: 'outlook',
        auth: {
          user: process.env['MAIL_USER'],
          pass: process.env['MAIL_PASSWORD'],
        },
      },
      defaults: {
        from: `"No Reply" <${process.env['MAIL_USER']}>`,
      },
      template: {
        dir:
          process.env.NODE_ENV == 'production'
            ? __dirname + '/templates'
            : 'templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
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
    StaffRegisterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*')
  }
}
