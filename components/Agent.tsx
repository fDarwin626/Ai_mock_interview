import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils';


enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const Agent = ({userName}: AgentProps) => {
    const whoIsSpeaking = true;
    const callStatus = CallStatus.FINISHED;
    const messages =[
        'Whats your name?',
        'My name is Lexa from sigma coperation , nice to meet you!',
    ];
    const lastMessage = messages[messages.length -1 ];
  return (
    <>
    <div className='call-view'>
        <div className="card-interviewer">
            <div className="avatar">
                <Image src="/ai-avatar.png" alt='S.I.G.M.A'
                width={70} height={55} className='object-cover'/> 
                {whoIsSpeaking && <span className='animate-speak'/>}
            </div>
            <h3>S.I.G.M.A interviewer</h3>
        </div>
        <div className="card-border">
            <div className="card-content">
                <Image src='/user-avatar2.jpg' alt='user profile'
                width={540} height={540} className='rounded-full
                object-cover size-[120px]'/>
                <h3>{userName}</h3>
            </div>
        </div>
    </div>


    {messages.length > 0 && (
        <div className="transcript-border">
            <div className="transcript">
                <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0',
                    'animate-fadeOut opacity-100'
                )}>
                    {lastMessage}

                </p>
            </div>
        </div>
    )}

    <div className="w-full flex justify-center">
        {callStatus != 'ACTIVE' ? (
            <button className='relative btn-call'>
                <span className={cn('absolute animate-ping rounded-full opacity-75', 
                    callStatus != 'CONNECTING' && 'hidden'
                )}/>
                 <span>
                    {callStatus === 'INACTIVE' || 
                    callStatus === 'FINISHED' ? 'Call':
                    '....'} 
                </span>
    
            </button>
        ):(
            <button className='btn-disconnect'>
                End Interview Session
            </button>
        ) }
    </div>
    </>
  )
}

export default Agent