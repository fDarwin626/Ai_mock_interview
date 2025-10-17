import Link from 'next/link'
import React, { ReactNode } from 'react'
import Image from 'next/image'
import { isAuthenaticated } from '@/lib/actions/auth.action'
import {redirect } from "next/navigation";


const RootLayout = async ({children}: {children: ReactNode}) => {

  const isUserAuthenaticated = await isAuthenaticated();
  if(!isUserAuthenaticated) redirect('/sign-in');
  return (
    <div className='root-layout'>
       <nav>
        <Link href='/' className='flex items-center
        gap-2'>
         <h2 className='text-primary-100'>PrepSmart</h2>
            <Image src='/logo.svg' alt='Logo' width={38}
        height={32} />
        </Link>
       </nav>
       {children}
    </div>
  )
}

export default RootLayout