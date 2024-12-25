import React from 'react'

export default function Button(props) {
    const { text, dark, full, handleSubmit } = props;
    return (
        <button onClick={handleSubmit} className={
            ' rounded-full overflow-hidden duration-200 hover:opacity-75 border border-solid border-stone-800 ' + 
            (dark ? ' text-white bg-stone-800 border-stone-900 ' : ' text-stone-900 ') +
            (full ? ' grid place-items-center w-full ' : ' ')}>
            <p className={'px-6 sm:px-10 whitespace-nowrap py-2 sm:py-3'}>{text}</p>
        </button>
    )
}
