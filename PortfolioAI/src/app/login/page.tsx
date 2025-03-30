import React from "react";
import Image from 'next/image';
import AuthImg from '@/public/Abstract Curves and Colors.jpeg'
import { Logo } from "@/components/Logo";

const AuthenticationPage = () =>{
    return (
       <main className='h-screen grid grid-cols-2 relatives'> 
            <div className="relative w-full flex flex-col bg-muted p-10 text-primary-foreground">

                <div className='w-full h-[30%] bg-gradient-to-t from-transparent to-black/50 absolute top-0 left-0 z-10'></div>

                <Image src={AuthImg} alt="login Image" fill className="w-full h-full object-cover"/>
                <div className="relative z-20 flex item-center">
                    <Logo/>
                </div>

                <div className='relative z-20 mt-auto'>
                    <blockquote className='spacey-y-2'>
                        <p className='text-lg'>
                        &ldquo;Pictoria AI is a game changer for me. I have been able to generate high quality professional headshots within minutes. It has saved me countless hours of work and cost as well.&rdquo;
                        </p>
                        <footer className='text-sm'>Make by Tuan Anh</footer>
                    </blockquote>
                </div>

                <div className='w-full h-[40%] bg-gradient-to-b from-transparent to-black/50 absolute bottom-0 left-0 z-10'></div>

            </div>
            <div >
                Loginform
            </div>
       </main>
    )
}
export default AuthenticationPage