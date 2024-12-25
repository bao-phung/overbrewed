'use client'
import Link from 'next/link'
import React from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'

export default function Action() {
    const { currentUser } = useAuth()

    if (currentUser) {
        return (
            <div className='flex justify-center mx-auto w-full'>
                <Link href={'/dashboard'}>
                    <Button text="Go to Dashboard"/>
                </Link>
            </div>
        )
    }

    return (
        <div className='flex justify-center mx-auto w-full'>
            <Link href={'/dashboard'}>
                <Button text="Start Tracking Your Sips" dark/>
            </Link>
        </div>
    )
}
