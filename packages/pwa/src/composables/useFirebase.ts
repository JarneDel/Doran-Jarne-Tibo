import { initializeApp } from 'firebase/app'
import {
  AuthError,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage'
import { ref } from 'vue'

// Shared state
const app = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
})
const auth = getAuth(app)
const storage = getStorage(app)
setPersistence(auth, browserLocalPersistence)

const firebaseUser = ref<User | null>(auth.currentUser)

/**
 * Login the user
 * @param email Email of the user
 * @param password Password of the user
 * @returns {Promise<User>} The logged in user
 * @exception {AuthError} If the email or password is incorrect
 */
const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        firebaseUser.value = userCredential.user
        resolve(userCredential.user)
      })
      .catch((error: AuthError) => {
        reject(mapAuthCodeToMessage(error.code))
      })
  })
}

/**
 * Register the user
 * @param email
 * @param password
 * @returns {Promise<User>} The registered user
 * @exception {AuthError} If the email is already used
 */
const register = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        firebaseUser.value = userCredential.user
        resolve(userCredential.user)
      })
      .catch((err: AuthError) => {
        reject(mapAuthCodeToMessage(err.code))
      })
  })
}

/**
 * Send a password reset email
 * @param email Email of the user
 * @returns {Promise<void>} true if the email was sent
 * @exception {AuthError} If the email is not valid
 */
const passwordReset = async (email: string): Promise<void> => {
  new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        resolve(true)
      })
      .catch((err: AuthError) => {
        reject(mapAuthCodeToMessage(err.code))
      })
  })
}

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
const logout = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        firebaseUser.value = null
        resolve()
      })
      .catch((err: AuthError) => {
        reject(mapAuthCodeToMessage(err.code))
      })
  })
}

const restoreUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
      if (user) {
        firebaseUser.value = user
        resolve(user)
      } else {
        resolve(null)
      }
    })
  })
}

/**
 * Map an auth code to a message
 * @param code The auth code coming from AuthError.code
 */
const mapAuthCodeToMessage = (code: string): string => {
  let error: string
  switch (code) {
    case 'auth/invalid-email':
      error = 'Email provided is invalid.'
      break
    case 'auth/user-disabled':
      error = 'User corresponding to the given email has been disabled.'
      break
    case 'auth/user-not-found':
      error = 'There is no user found with the given email.'
      return error
    case 'auth/invalid-password':
      error = 'Password provided is invalid.'
      break
    case 'auth/email-already-in-use':
      error = 'Email provided is already in use.'
      break
    default:
      console.error(`Unhandled error code: ${code}`)
      error = 'An error occurred.'
  }
  return error
}

/**
 * Upload a profile picture and update the user profile
 * @param file
 */
const uploadProfilePicture = async (file: File): Promise<string> => {
  const user = auth.currentUser
  if (!user) throw new Error('No user found')
  const storageReference = storageRef(storage, `profile/${user.uid}`)
  const res = await uploadBytes(storageReference, file)
  const url = await getDownloadURL(res.ref)
  await updateProfile(user, { photoURL: url })
  return url
}

const getProfilePictureUrl = async (): Promise<string | null> => {
  const user = firebaseUser.value
  if (!user) {
    console.log('no user')
    return null
  }
  return user.photoURL
}

export default () => {
  // State for each composable
  return {
    firebaseUser,
    login,
    logout,
    passwordReset,
    register,
    restoreUser,
    uploadProfilePicture,
    getProfilePictureUrl,
  }
}
