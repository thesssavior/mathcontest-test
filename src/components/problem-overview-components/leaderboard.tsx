import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection,query,orderBy, getDocs, onSnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import "../../styles/leaderboard.css"
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

type Props = {
    basePath: string
}
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
        <div className="page-leaderboard">
        <section className="leaderboard-progress">
            <div className="contain text-center flex flex-col justify-center items-center">
                <img alt="Android Basics Leaderboard" className="mb-2 max-h-40 max-w-40" src="https://d125fmws0bore1.cloudfront.net/assets/svgs/icon_trophy_leaderboard-3442a4b2312e6cdd02aa9870e636dc082890277a6267c4ed986a750fef7cbb35.svg"/>
                <h2 id="title">Leaderboard</h2>
                <p className="lead" id="subtitle">come on man</p>
            </div>
        </section>
        <section className="ranking">
            <div className="contain">
                <div className="ranking-table">
                    <div className="ranking-table-header-row">
                        <div className="ranking-table-header-data h6">Rank</div>
                        <div className="ranking-table-header-data h6">Name</div>
                        <div className="ranking-table-header-data h6">Time taken</div>
                    </div>
    {leaderboard.map((item, index)=>{
    if (index<3) {
        return (
            <div id={`top3-row-${index+1}`}>
            <div id={`top3-data-${index+1}`}>
                <div id={`top3-medal-${index+1}`}></div>
            </div>
            <div className="ranking-table-data">
                {item.username}
            </div>
            <div className="ranking-table-data">
                {item.time} seconds
            </div>
            </div>
        )
    }})}

    <Popover className="relative">
    <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        <span id="others">Others</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
    </Popover.Button>

    <Transition
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 -translate-y-80"
        enterTo="opacity-100 -translate-y-96"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 -translate-y-96"
        leaveTo="opacity-0 -translate-y-80"
    >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
            <div className="p-4">
            <section className="ranking">
                <div className="contain">
                    <div className="ranking-table">
                        <div className="ranking-table-body">
                        </div>
                    </div>
                </div>
            </section>
            {leaderboard.map((item, index) => {
                if (index >= 3) {
                    return (
                    <div className="ranking-table-row">
                        <div className="ranking-table-data">
                            {index+1}
                        </div>
                        <div className="ranking-table-data">
                            {item.username}
                        </div>
                        <div className="ranking-table-data">
                            {item.time}
                        </div>
                    </div>  
                    )  
                }    
            })}
            </div>
                <div className="bg-gray-50 grid grid-cols-1">  
                <Popover.Button className="text-gray-400" aria-hidden="true">
                <a
                className="flex items-center justify-center p-3 font-semibold hover:bg-gray-100"
                >
                close
                </a>
                </Popover.Button>
                </div>
            </div>
            </Popover.Panel>
        </Transition>
        </Popover>
        
                    </div>
                </div>
            </section>
        </div>
        </div>
    );
}

