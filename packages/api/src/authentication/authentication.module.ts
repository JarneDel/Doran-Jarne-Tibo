import { Module } from '@nestjs/common'
import { FirebaseService } from './services/firebase.service'
import { PassportModule } from '@nestjs/passport'
import { FirebaseAuthStrategy } from './firebase.strategy'

@Module({
  providers: [FirebaseService, FirebaseAuthStrategy],
  imports: [PassportModule],
})
export class AuthenticationModule {}
