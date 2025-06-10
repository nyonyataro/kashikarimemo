import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDVjw2QFyHhO-FW8Ks7MeILx9GSX0a7G8A",
  authDomain: "kashikarimemo-app.firebaseapp.com",
  projectId: "kashikarimemo-app",
  storageBucket: "kashikarimemo-app.firebasestorage.app",
  messagingSenderId: "318618763275",
  appId: "1:318618763275:web:e4e62b931e24c95364070e"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)