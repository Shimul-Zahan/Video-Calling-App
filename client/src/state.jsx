import React, { useState, useEffect } from 'react'

const State = () => {

    // const [currentValue, setCurrentValue] = useState(1);

    return (
        <div>
            <h1>We learn about useState and useEffect</h1>
            <h1 className='text-2xl font-bold'>{currentValue}</h1>
            <button onClick={() => setCurrentValue(currentValue + 2)} className='text-xl font-bold bg-gray-500 py-2 px-4'>+</button>
        </div>
    )
}

export default State