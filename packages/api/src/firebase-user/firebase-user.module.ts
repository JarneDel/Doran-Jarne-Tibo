import { Module } from '@nestjs/common'
import { FirebaseUserService } from './firebase-user.service'
import { FirebaseUser } from './models/firebase-user.model'

@Module({
  exports: [FirebaseUserService, FirebaseUser],
  providers: [FirebaseUserService, FirebaseUser],
})
export class FirebaseUserModule {}
