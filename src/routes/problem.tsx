import { useParams } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { styled } from "styled-components";
import React, { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import Main from "../components/stopwatch/Main/Main";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import Leaderboard from "../components/leaderboard";
import '../../styles/problem.css'

const Wrapper = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
`
const Error = styled.span`
    color: tomato;
    font-weight: 600;
`

const Form = styled.form``

const Input = styled.input``

export default function Problem() {
    // Params from router 
    const { folderName, number } = useParams<{folderName:string; number:string}>()

    // component states
    const [wrong, setWrong] = useState(false) 
    const [isLoading, setIsLoading] = useState(false) 
    const [start, setStart] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
    const [answer, setAnswer] = useState('') 
    const [error, setError] = useState('') 
    const [realAnswer, setRealAnswer] = useState<number>()
    const [timeInSeconds, setTimeInSeconds] = useState(0);

    const onChange =async (e:React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value)
    }
    const backspaced = folderName?.slice(0,-1)
    const basePath = `${folderName}/${backspaced}${number}`

    const [intervalId, setIntervalId] = useState<number>(0);

    const handlePlayButton = () => {
        setStart(true)
        const interval:any = setInterval(() => {
            setTimeInSeconds((previousState:number) => previousState + 1);
        }, 1000);

        setIntervalId(interval);
    }

    const handleStopButton = () => {
        clearInterval(intervalId);
    }

    // firebase ref
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
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        } finally {
            setIsLoading(false)
        }
    },[])

    // leaderboard 업뎃도 하자
    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const user = auth.currentUser
        // 정답이 아님 입구컷? 아님 걍 틀린 그대로 db에 보낼까?
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
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Wrapper>
            {start? null : 
            <button id="start" onClick={handlePlayButton}>
                start
            </button>
            }

            <Form onSubmit={onSubmit}>
                <Wrapper>
                    <img src={imgUrl} alt="math prob image"/>
                </Wrapper>
                <Wrapper>
                    <Input type="answer" value={answer} onChange={onChange} placeholder="정답"/>
                    <Input type="submit" value={ isLoading ? "Loading..." : "Submit"}/>
                </Wrapper>
                {wrong? <Error>try again</Error>: null}
            </Form>
            <Wrapper>
                <Main timeInSeconds={timeInSeconds} setTimeInSeconds={setTimeInSeconds}/>
            </Wrapper>
            <Leaderboard basePath={basePath}/>
        </Wrapper>
    );
}