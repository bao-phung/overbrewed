'use client'
import { Libre_Bodoni, Suranna } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import Calendar from './Calendar';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import { average, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Loading from './Loading';
import Login from './Login';
import { gradient } from '@/utils'

const suranna = Suranna({ subsets: ["latin"], weight: ["400"], });

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400"],
});

const drinkTypes = {
    'Coffee' : '/drinkicons/coffee.png',
    'Tea' : '/drinkicons/tea.png',
    'Matcha' : '/drinkicons/matcha.png',
    'Energy Drink' : '/drinkicons/energy-drink.png',
    'Soda' : '/drinkicons/soda.png',
    'Other' : '/drinkicons/other.png',
}

const drinkOptions = {
    'Coffee': [
      { name: 'Espresso Shot, 0.75 oz (75 mg)', caffeine: 75 },
      { name: 'Decaf (~2 mg)', caffeine: 2 },
      { name: 'Macchiato, 0.8 oz (75 mg)', caffeine: 75 },
      { name: 'Latte, 16 oz (150 mg)', caffeine: 150 },
      { name: 'Cappuccino, 16 oz (150 mg)', caffeine: 150 },
      { name: 'Americano, 16 oz (225 mg)', caffeine: 225 },
      { name: 'Mocha, 16 oz (175 mg)', caffeine: 175 },
      { name: 'Flat White, 12 oz (130 mg)', caffeine: 130 },
    ],
    'Tea': [
      { name: 'Green Tea, 16 oz (30 mg)', caffeine: 30 },
      { name: 'Oolong Tea, 16 oz (30 mg)', caffeine: 30 },
      { name: 'Black Tea, 16 oz (40 mg)', caffeine: 40 },
      { name: 'Chai Tea, 16 oz (40 mg)', caffeine: 40 },
    ],
    'Matcha': [
      { name: 'Matcha Latte, 8 oz (20 mg)', caffeine: 20 },
      { name: 'Matcha Latte, 12 oz (45 mg)', caffeine: 45 },
      { name: 'Matcha Latte, 16 oz (65 mg)', caffeine: 65 },
      { name: 'Matcha Latte, 20 oz (85 mg)', caffeine: 85 },
    ],
    'Energy Drink': [
      { name: 'Celsius, 12 oz (200 mg)', caffeine: 200 },
      { name: 'Red Bull, 8.4 oz (80 mg)', caffeine: 80 },
      { name: 'Monster, 16 oz (160 mg)', caffeine: 160 },
      { name: 'Rockstar, 16 oz (160 mg)', caffeine: 160 },
      { name: 'Prime Energy, 12 oz (200 mg)', caffeine: 200 },
      { name: '5-Hour Energy Regular Strength, 1.93 oz (200 mg)', caffeine: 200 },
      { name: '5-Hour Energy Extra Strength, 1.93 oz (230 mg)', caffeine: 200 },
      
    ],
    'Soda': [
      { name: 'Coca-Cola, 12 oz (34 mg)', caffeine: 34 },
      { name: 'Diet Coke, 12 oz (46 mg)', caffeine: 46 },
      { name: 'Pepsi, 12 oz (38 mg)', caffeine: 38 },
      { name: 'Mountain Dew, 12 oz (54 mg)', caffeine: 54 },
      { name: 'Dr. Pepper, 12 oz (41 mg)', caffeine: 41 },
    ],
    'Other': [
      { name: 'Vitaminwater Energy Tropical Citrus, 20 oz (50 mg)', caffeine: 50 },
      { name: 'Starbucks Refresher Drink, 24 oz (85 mg)', caffeine: 85 },
      { name: 'Milk Boba Tea, 16 oz (50 mg)', caffeine: 50 },
      { name: 'Hot Chocolate, 16 oz (25 mg)', caffeine: 25 },
    ],
  };
  

export default function Dashboard() {
    const { currentUser, userDataObj, setUserDataObj, loading } = useAuth()
    const [data, setData] = useState({})
    const now = new Date()

    function countValues() {
        let daysLogged = 0
        let caffeineSum = 0
        let dailyCaffeine = 0

        for (let year in data) {
            for (let month in data[year]) {
                for (let day in data[year][month]) {
                    dailyCaffeine = data[year][month][day]
                    daysLogged++
                    caffeineSum += dailyCaffeine
                }
            }
        }

        return { consumed_today: dailyCaffeine,
                 total_average: daysLogged ? (caffeineSum / daysLogged).toFixed(2) : 0,
                 days_logged: daysLogged }
    }

    const status = {
        ...countValues(),
    }

    async function handleSetCaffeine(caffeine) {

        const day = now.getDate()
        const month = now.getMonth()
        const year = now.getFullYear()

        try {
            const newData = { ...userDataObj }
            if (!newData?.[year]) {
                newData[year] = {}
            }
            if (!newData?.[year][month]) {
                newData[year][month] = {}
            }

            if (!newData[year][month][day]) {
                newData[year][month][day] = caffeine
            } else {
                newData[year][month][day] += caffeine
            }

            setData(newData)    // set current state
            setUserDataObj(newData) // set global state

            const docRef = doc(db, 'users', currentUser.uid)
            const res = await setDoc(docRef, {
                [year]: {
                    [month]: {
                        [day]: newData[year][month][day]
                    }
                }
            }, {merge: true})

        } catch (err) {
            console.log('Failed to set data: ', err.message)
        }

        toggleDropdown(null)
    }

    const [dropdown, setDropdown] = useState(null);

    const toggleDropdown = (drinkType) => {
        if (dropdown === drinkType) {
            setDropdown(null);
            setDrinkCaffeine(drinkOptions[drinkType]?.[0].caffeine);
        } else {
            setDropdown(drinkType);
            setDrinkCaffeine(drinkOptions[drinkType]?.[0].caffeine);
        }
    };

    const [drinkCaffeine, setDrinkCaffeine] = useState(0);
    // const [totalCaffeine, setTotalCaffeine] = useState(0);

    // render data from firebase
    useEffect(() => {
        if (!currentUser || !userDataObj) {
            return
        }

        setData(userDataObj)
    }, [currentUser, userDataObj])
    
    if (loading) {
        return <Loading/>
    }
    
    if (!currentUser) {
        return <Login/>
    }

    let dailyIntake = Object.values(countValues())[0];

    const message = dailyIntake === 0
        ? 'No caffeine consumed today. Stay hydrated!'
        : dailyIntake < 100
        ? 'Light boost in energy, focus, and mood with minimal side effects.'
        : dailyIntake < 200
        ? 'Enchanced alertness and concentration with possible jitteriness, mild anxiety, and restlessness.'
        : dailyIntake < 300
        ? 'Significant energy boost and temporary enchanced physical performance. You may expereince increased heart rate, dehydration, and sleep or digestive issues. Consider limiting your intake.'
        : 'Extreme caffeiene consumption can cause potential adverse health effects, such as confusion, dizziness, vomiting, and irregular heartbeats or seizures. Be cautious of your caffeine consumption. ';

    const caffeineLevel = dailyIntake === 0
        ? { level: 'None', rating: 0 }
        : dailyIntake < 100
        ? { level: 'Low', rating: 1 }
        : dailyIntake < 200
        ? { level: 'Moderate', rating: 2 }
        : dailyIntake < 300
        ? { level: 'High', rating: 3 }
        : { level: 'Extreme', rating: 4 };



    return (
        <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16 text-center'>
            <div className='flex flex-col gap-4'>
                <div className='grid grid-cols-3 rounded-md'>
                    {Object.keys(status).map((stat, statIndex) => {
                        const { level, rating } = caffeineLevel
                        let color = gradient.levels[rating]

                        return (
                            <div key={statIndex} className='p-4 flex flex-col 
                            gap-1 sm:gap-2'>
                                <p className={'font-semibold capitalize text-sm sm:text-md'}>
                                    {stat.replaceAll('_', ' ')}
                                </p>
                                <div className={'flex flex-col gap-2'}>
                                    <div className='text-base sm:text-lg text-neutral-600'>
                                        {status[stat]}
                                        {(statIndex === 0 || statIndex === 1) ? ' mg' : ''}
                                    </div>
                                    {statIndex === 0 ? 
                                        <p style={{background: color}}
                                        className='text-sm inline-block px-4 py-1 mx-auto rounded-md'>
                                            {level}
                                        </p> 
                                    : ''}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='w-full mx-auto max-w-[900px] p-5'>
                    <p className='text-md text-center max-w-[900px]'>{message}</p>
                </div>
            </div>
            <h4 className=
            {'brewedText text-4xl sm:text-5xl md:text-6xl text-center ' + suranna.className}>
                Select a Drink Type
            </h4>
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {Object.keys(drinkTypes).map((drinkType, drinkTypeIndex) => {
                    return (
                        <button key={drinkTypeIndex} 
                        className='flex flex-col items-center
                        p-10 rounded-lg duration-200 bg-stone-100
                        hover:bg-neutral-200 hover:scale-95 space-y-3 text-center'
                        onClick={() => toggleDropdown(drinkType)}>
                            <img className='text-4xl sm:text-5xl md:text-6xl 
                            h-[50px] sm:h-[75px] w-auto'
                                src={drinkTypes[drinkType]}
                            />
                            <p className=
                            {'text-center text-xs sm:text-sm md:text-base'}>
                                {drinkType}
                            </p>
                        </button>
                    )
                })}
            </div>

            {dropdown && (
                <div className='flex flex-col md:flex-row max-w-[750px] w-full mx-auto justify-center gap-4'>
                    <select id={`${dropdown}-select`} name={dropdown}
                    className="px-3 py-2 sm:py-3 w-full md:w-2/3 border border-solid border-stone-300 rounded-md outline-none 
                    duration-200 hover:border-stone-900 focus:border-stone-900"
                    onChange={(e) => {
                        setDrinkCaffeine(parseInt(e.target.value, 10) || 0)
                    }}>
                        {drinkOptions[dropdown].map((drink, drinkIndex) => (
                            <option key={drinkIndex} value={drink.caffeine}>
                                {drink.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => {
                        //handleSetCaffeine(0)
                        handleSetCaffeine(drinkCaffeine)
                    }} 
                    className='rounded-full overflow-hidden duration-200 hover:opacity-75 border border-solid border-stone-800 
                    text-white bg-stone-800 border-stone-900'>
                        <p className={'px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3'}>Log Drink</p>
                    </button>
                </div>
            )}
           
            <Calendar completeData={data} handleSetCaffeine={handleSetCaffeine}/>
        </div>
    )
}
