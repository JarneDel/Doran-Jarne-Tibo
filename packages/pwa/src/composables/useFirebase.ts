import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, onAuthStateChanged,browserLocalPersistence, signInWithEmailAndPassword, sendPasswordResetEmail, type User } from 'firebase/auth'
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
setPersistence(auth, browserLocalPersistence)


const firebaseUser = ref<User | null>(auth.currentUser)

const login = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        firebaseUser.value = userCredential.user
        resolve(userCredential.user)
      })
      .catch(error => {
        reject(error)
      })
  })
}

const passwordReset = async (email: string): Promise<void> => {
  new Promise((resolve, reject) => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
          resolve(true)
        })
        .catch(error => {
          const errorCode = error.code
          const errorMessage = error.message
          reject({ code: errorCode, message: errorMessage })
        })
  })
}

const restoreUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => {
      if (user){
        firebaseUser.value = user;
        resolve(user);
      }
      else{
        reject()
      }
    })
  });
}


export default () => {
  // State for each composable
  return {
    firebaseUser,

    restoreUser,
    passwordReset,
    login,
  }
}
