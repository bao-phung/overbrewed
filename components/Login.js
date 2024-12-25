'use client'
import { Suranna } from 'next/font/google';
import React, { useState } from 'react'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';

const suranna = Suranna({ subsets: ["latin"], weight: ["400"], });

export default function Login() {
    const [ email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistered, setIsRegistered] = useState(false)
    const [authenticating, setAuthenicating] = useState(false)

    const { signup, login } = useAuth()

    async function handleSubmit() {
        if (!email || !password || password.length < 6) {
            return
        }

        setAuthenicating(true)

        try {
            if (isRegistered) {
                await signup(email, password)
            } else {
                await login(email, password)
            }
        } catch (err) {
            console.log(err.message)
        } finally {
            setAuthenicating(false)
        }
    }

    return (
        <div className='flex flex-col flex-1 justify-center
        items-center gap-4'>
            <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + suranna.className}>
                {isRegistered ? 'Sign Up' : 'Log In'}
            </h3>
            <p>
                Balance your buzz, log in to track all your drinks. 
            </p>
            <input className='max-w-[400px] w-full mx-auto px-3 py-2 
            sm:py-3 border border-solid border-stone-300 rounded-md outline-none 
            duration-200 hover:border-stone-900 focus:border-stone-900'
            placeholder="Email" value={email}
            onChange={(e) => {
                setEmail(e.target.value)
            }}/>
            <input className='max-w-[400px] w-full mx-auto px-3 py-2 
            sm:py-3 border border-solid border-stone-300 rounded-md outline-none 
            duration-200 hover:border-stone-900 focus:border-stone-900'
            type="password" placeholder="Password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value)
            }}/>
            <div className='max-w-[400px] w-full mx-auto'>
                <Button handleSubmit={handleSubmit} text={authenticating ? 'Submitting' : 'Submit'} dark full/>
            </div>
            <p className='text-center'>
                {isRegistered ? 'Already have an account? ' : 'Don\'t have an account? '} 
                <button className='underline'
                onClick={() => {setIsRegistered(!isRegistered)}}>
                    {isRegistered ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
    )
}
