import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react'

const Options = ({ me, leaveCall, myVideo, userVideo, callAccepted, callEnded, name, call, stream, callUser, setName, answeCall }) => {

    const [idToCall, setIdToCall] = useState('')
    console.log(idToCall);

    console.log(call);

    return (
        <div>
            <div className='grid gap-4 grid-cols-2 justify-center items-center w-[400px]'>
                <div className='flex flex-col gap-2'>
                    <h1>Account Info</h1>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='border w-full border-black rounded-sm' placeholder='name' />
                    <button className='px-5 py-1 w-full bg-red-500'>Copy to Clipboard</button>
                </div>
                <div className='flex flex-col gap-2'>
                    <h1>Make a call</h1>
                    <input type="text" onChange={(e) => setIdToCall(e.target.value)} value={me} placeholder='id to call' className='border border-black w-full rounded-sm' />
                    {
                        callAccepted && !callEnded ? (
                            <button onClick={leaveCall} className='text-xl font-bold bg-gray-500 w-full px-5 py-1'>Leave Call</button>
                        ) : (
                            <button onClick={() => callUser(idToCall)} className=' bg-gray-500 w-full px-5 py-1'>Call Now</button>

                        )
                    }
                </div>
            </div>
            {
                call?.isRecievedCall && !callAccepted && (
                    <div>
                        <h1>{call.name} is calling.....</h1>
                        <button onClick={answeCall} className='px-3 py-1 bg-green-500'> Answer Now</button>
                    </div>
                )
            }
        </div>
    )
}

export default Options