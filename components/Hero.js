import React from 'react'
import { Libre_Bodoni, Suranna } from "next/font/google";
import Calendar from './Calendar';
import Action from './Action';

const suranna = Suranna({ subsets: ["latin"], weight: ["400"], });

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400"],
  style: ['italic'],
});

export default function Hero() {
    return (
        <div className='py-8 md:py-10 flex flex-col gap-10 sm:gap-12 md:gap-14'>
            <h1 className={'text-5xl sm:text-text-6xl md:text-7xl text-center ' + suranna.className}>
                <span className={'brewedText ' + libreBodoni.className}>Overbrewed </span>
                <span> helps you track your daily </span>
                <span className='brewedText'>caffeine intake.</span>
            </h1>
            <p className='text-md sm:text-lg md:text-xl text-center
            w-full mx-auto max-w-[650px]'>
                Keep track of your<span className='font-semibold'> daily consumption, caffeine level 
                and more,</span> every day of the year.
            </p>
            <Action/>
            <Calendar demo/>
        </div>
    )
}
