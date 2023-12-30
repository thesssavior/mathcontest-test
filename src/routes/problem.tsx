import { useParams } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import Main from "../components/stopwatch/Main/Main";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import Leaderboard from "../components/leaderboard";
import '../styles/problem.css'
import Overlay from "../components/overlay";
import Whiteboard from "../components/whiteboard";

export default function Problem() {
    // Params from router 
    const { folderName, number } = useParams<{folderName:string; number:string}>()

    // component states
    const [wrong, setWrong] = useState(false) 
    const [isLoading, setIsLoading] = useState(false) 
    const [showOverlay, setShowOverlay] = useState(true);
    const [imgUrl, setImgUrl] = useState('')
    const [answer, setAnswer] = useState('') 
    const [realAnswer, setRealAnswer] = useState<number>()
    const [timeInSeconds, setTimeInSeconds] = useState(0);

    const onChange =async (e:React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value)
    }
    
    // stopwatch
    const [intervalId, setIntervalId] = useState<number>(0);
    const handlePlayButton = () => {
        const interval:any = setInterval(() => {
            setTimeInSeconds((previousState:number) => previousState + 1);
        }, 1000);

        setIntervalId(interval);
    }
    const handleStopButton = () => {
        clearInterval(intervalId);
    }

    // overlay
    const handleOverlayClick = () =>{
        setShowOverlay(false)
        handlePlayButton()
    }

    // firebase ref
    const backspaced = folderName?.slice(0,-1)
    const basePath = `${folderName}/${backspaced}${number}`
    useEffect(()=>{
        try{
            setIsLoading(true)
            const imgRef = ref(storage, `${basePath}.jpg`)    
            getDownloadURL(imgRef).then((url)=>{
                setImgUrl(url)
            })
            const problemRef = doc(db, `${basePath}`)
    
            getDoc(problemRef).then((problemSnapshot)=>{
                if (problemSnapshot.exists()){
                    const answer = problemSnapshot.data().answer
                    console.log(answer)
                    setRealAnswer(answer)
                }
            })
        } catch (e) {
            
        } finally {
            setIsLoading(false)
        }
    },[])

    // leaderboard 업뎃도 하자
    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = auth.currentUser
        // 정답이 아님 입구컷? 아님 걍 틀린 그대로 db에 보낼까?
        // 정답률 구하게.. 정답이 아닌것도 다 포함
        if (parseInt(answer) !== realAnswer) {
            setWrong(true)
            setTimeout( ()=> {
                setWrong(false)
            }, 2000)
            
        }
        if (!user || isLoading || parseInt(answer) !== realAnswer) return null;
        handleStopButton()
        try {
            setIsLoading(true)
            // create/update document 
            const leaderboardRef = doc(db, `${basePath}/leaderboard/${user.uid}`)
            await setDoc(leaderboardRef, {
                username: user.displayName,
                time: timeInSeconds,
            })
        } catch (e) {
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            { showOverlay && <Overlay onOverlayClick={handleOverlayClick}/>}

            <form onSubmit={onSubmit}>
                <div className="problem-name mt-2">
                    <p>{`${backspaced}${number}`}</p>
                </div>
                <div className="form-image mt-6">
                    <img className="rounded" src={imgUrl} alt="math prob image"/>
                </div>
                <div className="form-input-wrapper">
                    <input 
                        className="form-input"
                        type="answer" 
                        value={answer} 
                        onChange={onChange} 
                        placeholder="정답"
                    />
                    <input 
                        className="inline-flex items-center rounded-md bg-blue-50 px-6 py-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 hover:bg-blue-100"
                        type="submit"
                        value={ isLoading ? "Loading..." : "Submit"}
                    />
                </div>
                {wrong? <p className="form-error">try again</p>: null}
            </form>
            <div>
                <Main timeInSeconds={timeInSeconds}/>
            </div>
            <Whiteboard/>
            <Leaderboard basePath={basePath}/>
        </div>
    );
}