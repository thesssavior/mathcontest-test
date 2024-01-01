import {Login} from "../components/login-page/login";
import {ProblemSet} from "../components/problem-list/problem-set";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LoggedIn } from "../components/login-page/logged-in";
import { LoginWithEmail } from "../components/login-page/login-email";
import '../styles/home.css'

export default function Home() {
    const [username, setUsername] = useState('')
    const [show, setShow] = useState(true)
    const [signInAsGuest,setSignInAsGuest] = useState(true)
    const [clickWithoutUser, setClickWithoutUser] = useState(false)
    
    const onLogOut = async() => {
        await signOut(auth)
    }

    useEffect(()=>{
        onAuthStateChanged(auth, async (user)=>{
            if(user){
                setShow(false)
                setUsername(user.displayName||'')
            }else{
                setShow(true)
            }
        })    
    },[])

    return (
        <div>
            {signInAsGuest && show && <Login setUsername={setUsername}/>}
            {!signInAsGuest && show && <LoginWithEmail setUsername={setUsername}/>}
            {!show && <LoggedIn username={username} onLogOut={onLogOut}/>}

            {show? 
            <div className="switcher flex w-full justify-center items-center">
            {!signInAsGuest? 
            <button className="flex w-1/4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
            onClick={()=>setSignInAsGuest(true)}>게스트로 로그인</button>
            : <button className="flex w-1/4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
            onClick={()=>setSignInAsGuest(false)}>이메일로 로그인</button>
            }        
            </div>
            :null}

            {clickWithoutUser?<div className="error left-0 fixed w-screen flex justify-center items-center mt-4">로그인 후 이용해 주세요</div>:null}

            <ProblemSet setClickWithoutUser={setClickWithoutUser}/>
        </div>
    );
}