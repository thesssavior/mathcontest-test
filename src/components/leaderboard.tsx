import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection,query,orderBy, getDocs, onSnapshot } from "firebase/firestore";
import styled from "styled-components";
import { Unsubscribe } from "firebase/auth";

type Props = {
    basePath: string
}

// 왜 object 안에 넣으면 안됐지?
interface LeaderboardItem {
    username: string
    time: number
}

const Wrapper = styled.div``

export default function Leaderboard(props:Props) {
    const {basePath} = props
    const [isLoading, setIsLoading] = useState(false)
    const [leaderboard, setLeaderboard] = useState<Array<LeaderboardItem>>([]);

    useEffect(()=>{
        let unsubscribe:Unsubscribe|null=null 
        const leaderboardRef = collection(db, `${basePath}/leaderboard`)
        const getLeaderboard = async () => {
            const q = query(leaderboardRef, orderBy('time', 'asc'))
            const querySnapshot = await getDocs(q)
            // dataArr에 doc.data() 담기
            const dataArr: Array<LeaderboardItem> = []
            querySnapshot.docs.map((doc)=>{
                const data = doc.data() as LeaderboardItem
                dataArr.push(data)
            })
            // no errors until.
            setLeaderboard(dataArr) 
 
            // i get error trying concatenation, why not just dataArr and done 
            // setLeaderboard((prevLeaderboard) => [...(prevLeaderboard || []), ...dataArr]);
            // Type 'LeaderboardItem[] | undefined' must have a '[Symbol.iterator]()' method that returns an iterator
            // || []를 써서 undefined도 []로 취급
        }
        getLeaderboard()
        unsubscribe = onSnapshot(leaderboardRef, ()=>{
            getLeaderboard()
        })
        return ()=> {
            unsubscribe && unsubscribe();
            // if(unsubscribe)  {
            //     unsubscribe()
            // }
        }
    }
    ,[])

    return (
        <Wrapper>
            <h1>Leaderboard</h1>
            {leaderboard.map((item, index)=>{
                return (
                    <LeaderboardItem data={item} index={index+1} key={index}/>
                )
            })}
        </Wrapper>
    );
    // setLeaderboard()
}

function LeaderboardItem({data,index}:{data:LeaderboardItem, index:number}) {
    if (!data) return <h3>shit</h3>;
    return (
        <Wrapper>
            <h3>rank: {index} username: {data.username} time: {data.time}</h3>
        </Wrapper>
    )
}
