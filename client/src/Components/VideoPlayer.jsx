import React from 'react'

const VideoPlayer = ({ myVideo, userVideo, callAccepted, callEnded, name, call, stream }) => {
    return (
        <div className='grid grid-cols-2 justify-center items-center max-w-5xl'>
            {
                stream && (
                    <div>
                        <h1>{name || 'Name'}</h1>
                        <video playsInline muted ref={myVideo} autoPlay></video>
                    </div>
                )
            }
            {
                callAccepted && !callEnded && (
                    <div>
                        <h1>{name || 'Name'}</h1>
                        <video playsInline muted ref={userVideo} autoPlay></video>
                    </div>
                )
            }
        </div>
    )
}

export default VideoPlayer