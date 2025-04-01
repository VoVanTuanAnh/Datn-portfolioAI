'use client'
import React, { useState } from 'react'
import LoginForm from './LoginForm'
import { Button } from '../ui/button'
import SignUpForm from './SignupForm'
import { Link } from 'lucide-react'
import ResetPassword from './ResetPassword'
import ResetPasswordForm from './ResetPassword'



const AuthForm = () => {
        const[mode, setMode] = useState('login')
    return(
        <div className='space-y-6'>
            <div className='flex flex-col space-y-2 text-center'>
                <div className =' text-2xl font-semibold tracking-tight'>
                {
                    mode === "reset" ? "Reset Password" : mode === "login" ? "Login" : "Sign Up"
                }
                </div>
                <p className =' text-sm text-muted-foreground'>
                {
                    mode === "reset" ? "Enter your email below to reset your password" : mode === "login" ? "Enter your email below to login to your account" : "Enter your information below to create an account"
                }
                </p>
            </div>
            {
                mode === "login" && <>
                <LoginForm/>
                <div className='text-center flex justify-between'>
                    <Button variant={"link"} className='p-0' onClick={() => setMode("signup")}>
                        Need an account ? Sign up
                    </Button>
                    <Button variant={"link"} className='p-0' onClick={() => setMode("reset")}>
                        Forgot password?
                    </Button>
                </div>
                </>
            }
            {
                mode === "signup" && <>
                <SignUpForm/>
                <div className='text-center '>
                    <Button variant={"link"} className='p-0' onClick={() => setMode("login")}>
                        Already have an account ? Login now
                    </Button>
                </div>
                <p className='px-8 text-center text-sm text-muted-foreground'>
                    By clicing sign up, you agree to our <Link href='#' className='underline underline-offset-4 hover:text-primary'>Terms of Service</Link>
                    and <Link href='#' className='underline underline-offset-4 hover:text-primary'>Privacy Policy.</Link>
                </p>
                </>
            }
            {
                mode === "reset" && <>
                <ResetPasswordForm/>
                <div className='text-center '>
                    <Button variant={"link"} className='p-0' onClick={() => setMode("login")}>
                       Back to login
                    </Button>
                </div>
                </>
            }
        </div>
    )
}

export default AuthForm 