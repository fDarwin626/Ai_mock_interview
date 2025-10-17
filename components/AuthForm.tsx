"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"

import { Button } from '@/components/ui/button'
import{
  Form,
} from '@/components/ui/form'
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/dist/client/components/navigation"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"
import { signIn, signUp } from "@/lib/actions/auth.action"
import { sign } from "crypto"



interface AuthFormProps{
  type: 'sign-in' | 'sign-up'
}

const authFormSchema =(type: FormType) => {
 return z.object({
  name: type === 'sign-up' ? z.string().min(3)
  : z.string().optional(), // cuz we dont need after sign in
  email: z.string().email(),
  password: z.string().min(3),
 })
}

const AuthForm = ({type}: AuthFormProps) => {
  const router = useRouter()
  const formSchema = authFormSchema(type);
 
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    name: "",
    email: "",
    password: "",

  },
})
 
// 2. Define a submit handler.
async function onSubmit (values: z.infer<typeof formSchema>){
  try{
    if(type === 'sign-up' ){
      const {name, email, password} = values;
      // authenaticate user
      const userCredientials = await createUserWithEmailAndPassword(auth, email,password);

      // sign user up

      const result = await signUp({
        uid: userCredientials.user.uid,
        name: name!,
        email,
        password,
      })
      if(!result?.success){
        toast.error(result?.message)
        return;
      }
      toast.success("🎉 Account Created Succesfully 🎉  please sign in ");
       router.push('/sign-in')
    }else{
      const {email, password} = values;
      const userCridentials = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCridentials.user.getIdToken();
      if(!idToken){
        toast.error('Failed to sign in')
        return;
      }
      await signIn({
        email, idToken
      })
      toast.success(" sign in  successfully");
       router.push('/')

    }
  }catch (error) {
    console.log(error);
    toast.error(`Oops unExpected error: ${error}`)
  }
}

const isSignIn = type === 'sign-in';
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card 
      py-14 px-10">
       <div className="flex flex-row gap-2 justify-center">
          <h2 className="text-primary-100">PrepSmart</h2>
          <Image src='/logo.svg' alt='logo' height={32}
          width={38}/>
       </div>
       <h3>Prectice job interview with S.I.G.M.A</h3>
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
       className='w-full space-y-6 mt-4 form'>
        {!isSignIn && (
          <FormField control={form.control} name='name'
          label="Name" placeholder='Your Name Here'/>
        )} 

       <FormField control={form.control} name='email'
          label="Email" placeholder='Your email address'
          type="email"/>

          <FormField control={form.control} name='password'
          label="Password" placeholder='Enter your password'
          type='password'/>
      
      
       <Button className="btn" type="submit"> {isSignIn ? 'Sign in': 'Create an Account'} </Button>
      </form>
     </Form>
      <p className="text-center">
        {isSignIn ? 'Dont have an Account?'
        : 'Have an Account?' }
        <Link href={!isSignIn ? '/sign-in': '/sign-up' }
        className="font-bold text-user-primary ml-1">
          {!isSignIn ? 'Sign in Instead': 'Lets create an Account'}
        </Link>
      </p>
      </div>


    </div>
  )
}

export default AuthForm