import { Injectable } from '@nestjs/common'
import { getAuth } from 'firebase-admin/auth'
import { FirebaseUser } from './models/firebase-user.model'

@Injectable()
export class FirebaseUserService {
  async createFirebaseUser(user: FirebaseUser) {
    const userRecord = await getAuth().createUser({
      email: user.email,
      password: user.password,
      uid: user.uid,
    })
    return {
      uid: userRecord.uid,
      email: userRecord.email,
    }
  }

  async deleteFirebaseUser(uid: string) {
    await getAuth().deleteUser(uid)
  }

  async getFirebaseUsers() {
    const listUsersResult = await getAuth().listUsers()
    return listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
    }))
  }
}
