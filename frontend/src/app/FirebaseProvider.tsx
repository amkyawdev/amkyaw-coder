'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface FirebaseProviderProps {
  children: ReactNode
}

export default function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Firebase
    if (typeof window !== 'undefined' && (window as any).firebase) {
      const firebase = (window as any).firebase
      
      const firebaseConfig = {
        apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
        authDomain: "smart-burme-app.firebaseapp.com",
        projectId: "smart-burme-app",
        storageBucket: "smart-burme-app.appspot.com",
        messagingSenderId: "851502425686",
        appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
      }
      
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig)
      }
      
      // Listen for auth state changes
      const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser: any) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return () => unsubscribe()
    } else {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
      const firebase = (window as any).firebase
      await firebase.auth().signInWithEmailAndPassword(email, password)
    }
  }

  const signUp = async (email: string, password: string) => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
      const firebase = (window as any).firebase
      await firebase.auth().createUserWithEmailAndPassword(email, password)
    }
  }

  const signOut = async () => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
      const firebase = (window as any).firebase
      await firebase.auth().signOut()
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Default export
export default FirebaseProvider