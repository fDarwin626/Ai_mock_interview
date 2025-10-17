'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 ;

export async function signUp(params: SignUpParams){
      const { uid, name, email } = params;
      try{
        const userRecord = await db.collection('users')
        .doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: 'User already exist. please sign in instead.'
            }
        }
        // if the user doesnt exist 
        await db.collection('users').doc(uid).set({
            name, email
        }) // creating a new user
        return{
          success: true,
          message: 'Account created successfully. sign in'
        }
      } catch(e: any){
          console.error('Error creating user:', e);

          // handle firebaase specific errors too//
          if (e.code === 'auth/email-already-exists'){
             return{
                success: false,
                message: 'This email already exists'
             }
          }
          return{
            success: false,
            message: 'Failed to create and account'
          }
      }
}


export async function signIn(params:SignInParams) {
  const { email, idToken} = params;
   try{
        const userRecord = await auth.getUserByEmail(email);
          if(!userRecord){
            return {
            success: false,
            message: 'User does not exist. Create an account instead'
            }

          }
          await setSessionCookie(idToken);
   } catch(e){
           console.log(e);

             return{
                success: false,
                message: 'Failed to log into account'
             }
   }
}

export async function setSessionCookie(idToken:string) {
   const cookieStore = await cookies();

   const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // this expires in a week times 1000 miliseconds
  })

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK ,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })
}


export async function getCurrentUser(): Promise<User | null>{
  const cookieStore = await cookies();
  const sessionCookie =cookieStore.get('session')?.value; 

  if(!sessionCookie) return null;

  try{
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

    if(!userRecord.exists) return null;

    return{
      ...userRecord.data(),
      id: userRecord.id,

    } as User;
  }catch(e){
    console.log(e)
    return null;
  }
}

export async function isAuthenaticated(){
  const user = await getCurrentUser();
  return !!user; // !! to turn a truthy or falsey value into a bool

}