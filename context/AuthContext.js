'use client'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState, useContext } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setUserDataObj] = useState(null)
    const [loading, setLoading] = useState(true)

    // signing up user with firebase
    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // login
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // logout, set user obj and current user to default
    function logout() {
        setUserDataObj(null)
        setCurrentUser(null)
        return signOut(auth)
    }

    // empty array = listens to when app is rendered then event happens
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                // set user to local context state
                setLoading(true)
                setCurrentUser(user)
                if (!user) {
                    console.log('No User Found')
                    return
                }

                // if user exists, fetch date from firestore db
                console.log('Fetching User Data')
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)
                let firebaseData = {}

                if (docSnap.exists()) {
                    console.log('Found User Data')
                    firebaseData = docSnap.data()
                }

                setUserDataObj(firebaseData)
            } catch(err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        })

        return unsubscribe

    }, [])

    const value = {
        currentUser,
        userDataObj,
        setUserDataObj,
        signup,
        logout,
        login,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}