import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection,query,orderBy, getDocs, onSnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import "../../styles/leaderboard.css"

type Props = {
    basePath: string
}

// 왜 object 안에 넣으면 안됐지?
interface LeaderboardItem {
    username: string
    time: number
}

export default function Leaderboard(props:Props) {
    const {basePath} = props
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
         }
        getLeaderboard()
        unsubscribe = onSnapshot(leaderboardRef, ()=>{
            getLeaderboard()
        })
        return ()=> {
            unsubscribe && unsubscribe();
        }
    }
    ,[])

    return (
        <div className="leaderboard">
            <h1 className="heading">Leaderboard</h1>
            {leaderboard.map((item, index)=>{
                return (
                    <LeaderboardItem data={item} index={index+1} key={index}/>
                )
            })}
        </div>
    );
    // setLeaderboard()
}

function LeaderboardItem({data,index}:{data:LeaderboardItem, index:number}) {
    if (!data) return <h3>shit</h3>;
    return (
        <div>
            <ul role="list" className="divide-y divide-gray-100">
                <li key={index} className="flex justify-center py-2">
                <div className="flex min-w-0 gap-x-2">
                    {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
                    <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold mr-16 leading-6 text-gray-900">{index} {data.username}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">email</p>
                    </div>
                </div>
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">걸린 시간 : {data.time}</p>

                </div>
                </li>
            </ul>
        </div>  
    )
}
