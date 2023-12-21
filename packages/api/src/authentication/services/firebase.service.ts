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
    console.log('Firebase app initialized')
    console.log(this.firebaseApp)
  }

  getAuth = (): Auth => getAuth()
}
