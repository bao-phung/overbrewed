'use client'
import { gradient, baseRating } from '@/utils'
import { Libre_Bodoni, Suranna } from 'next/font/google';
import React, { useState } from 'react'

const suranna = Suranna({ subsets: ["latin"], weight: ["400"], });

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400"],
});

const months = { 'January': 'Jan', 'February': 'Feb', 'March': 'Mar',
                 'April': 'Apr', 'May': 'May', 'June': 'Jun', 
                 'July': 'Jul', 'August': 'Aug', 'September': 'Sept', 
                 'October': 'Oct', 'November': 'Nov', 'December': 'Dec' }
const monthsArr = Object.keys(months)
const now = new Date()
const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


export default function Calendar(props) {
    const { demo, completeData, handleSetCaffeine } = props

    const now = new Date()
    const currentMonth = now.getMonth()
    const [selectedMonth, setSelectedMonth] = useState(Object.keys(months)[currentMonth])
    const [selectedYear, setSelectedYear] = useState(now.getFullYear())

    const numericMonth = monthsArr.indexOf(selectedMonth)
    const data = completeData?.[selectedYear]?.[numericMonth] || {}


    function handleIncMonth(val) {
        if (numericMonth + val < 0) {
            // set month value to 11 and dec year
            setSelectedYear(curr => curr - 1)
            setSelectedMonth(monthsArr[monthsArr.length - 1])
        } else if (numericMonth + val > 11) {
            // set month value to 0 and inc year
            setSelectedYear(curr => curr + 1)
            setSelectedMonth(monthsArr[0])
        } else {
            setSelectedMonth(monthsArr[numericMonth + val])
        }

    }

    const monthNow = new Date(selectedYear, numericMonth, 1);
    const firstDayOfMonth = monthNow.getDay();
    const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate();

    const daysToDisplay = firstDayOfMonth + daysInMonth;
    
    const numRows = (Math.floor(daysToDisplay / 7) + (daysToDisplay % 7 ? 1 : 0));

    return (
        <div className='flex flex-col gap-4 overflow-hidden w-full mx-auto max-w-[900px] py-4 sm:py-6'>
            <div className='grid grid-cols-5 gap-4'>
                <button className='mr-auto px-2 duration-200 hover:scale-125 hover:text-neutral-500'
                onClick={() => { handleIncMonth(-1) }}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <p className={'text-neutral-600 text-center capitalized col-span-3 whitespace-nowrap font-semibold text-lg sm:text-lg '}>
                    {selectedMonth} {selectedYear}
                </p>
                <button className='ml-auto px-2 duration-200 hover:scale-125 hover:text-neutral-500'
                onClick={() => { handleIncMonth(+1) }}>
                    <i className="fa-solid fa-chevron-right"></i>
                </button>
            </div>


            <div className='flex flex-col overflow-hidden w-full mx-auto max-w-[900px] gap-1 py-4 sm:py-6 md:py-10'>
                <div className='grid grid-cols-7 gap-1 py-3 underline'>
                    {dayList.map((day, index) => (
                        <div key={index} className="text-center text-sm">
                            {day}
                        </div>
                    ))}
                </div>

                {[...Array(numRows).keys()].map((row, rowIndex) => {
                    return (
                        <div key={rowIndex} className='grid grid-cols-7 gap-1'>
                            {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                                let dayIndex = (rowIndex * 7) + dayOfWeekIndex - (firstDayOfMonth - 1)

                                let dayDisplay = dayIndex > daysInMonth ? false : 
                                (row === 0 && dayOfWeekIndex < firstDayOfMonth) ? false : true
                                
                                let isToday = dayIndex === now.getDate()

                                if (!dayDisplay) {
                                    return (
                                        <div className='bg-white' key={dayOfWeekIndex}/>
                                    )
                                }

                                let level = demo ?
                                    baseRating[dayIndex] :
                                    dayIndex in data && data[dayIndex] > 0 ?
                                        Math.min(Math.floor(data[dayIndex] / 100), 4) : null

                                let color = (level !== null) ? 
                                    gradient.steeped[level] : "white"
                                
                                return (
                                    <div style={{background: color}} className={'text-xs sm:text-sm py-3 border border-solid p-2 flex items-center gap-2 justify-between rounded-md ' +
                                    (isToday ? 'border-2 border-stone-700 font-bold ' : 'border-stone-300 ') +
                                    (color === 'white' ? 'text-stone-900 ' : 'text-white ')}
                                    key={dayOfWeekIndex}>
                                        <p>{dayIndex}</p>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
