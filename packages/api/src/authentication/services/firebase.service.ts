import { Injectable } from '@nestjs/common'
import { App, applicationDefault, initializeApp } from 'firebase-admin/app'
import { Auth, getAuth } from 'firebase-admin/auth'

@Injectable()
export class FirebaseService {
  private firebaseApp: App

  constructor() {
    this.firebaseApp = initializeApp({
      credential: applicationDefault(), // looks at env GOOGLE_APPLICATION_CREDENTIALS
    })
  }

  getAuth = (): Auth => getAuth()
}
