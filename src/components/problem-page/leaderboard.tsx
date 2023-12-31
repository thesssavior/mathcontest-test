import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection,query,orderBy, getDocs, onSnapshot } from "firebase/firestore";
import { Unsubscribe } from "firebase/auth";
import "../../styles/leaderboard.css"
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline'
import { callsToAction, solutions } from "../../constants";



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
            <div className="ranking-table-data">
                <div className="complete"></div>
            </div>
            </div>
        )
    } else {
        return (
            <Popover className="relative">
            <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                <span>Others</span>
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
            </Popover.Button>
        
            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
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
                    {leaderboard.map((item) => (
                        <div className="ranking-table-row">
                        <div className="ranking-table-data">
                            4
                        </div>
                        <div className="ranking-table-data">
                            Joseph R
                        </div>
                        <div className="ranking-table-data">
                            <div className="complete"></div>
                        </div>
                        </div>
                ))}
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                    {callsToAction.map((item) => (
                        <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                        >
                        <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                        {item.name}
                        </a>
                    ))}
                    </div>
                </div>
                </Popover.Panel>
            </Transition>
            </Popover>
        
            // <LeaderboardItem data={item} index={index+1} key={index}/>
        )
    }
    })}
                    </div>
                </div>
            </section>
        </div>
        </div>
    );
}

function LeaderboardItem({data,index}:{data:LeaderboardItem, index:number}) {
    if (!data) return <h3>shit</h3>;
    return (
        <div>
            <ul role="list" className="divide-y divide-gray-100 flex justify-center">
                <li key={index} className="flex w-2/5 justify-between py-2 ">
                <div className="flex gap-x-2">
                    {/* <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" /> */}
                    <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold mr-16 leading-6 text-gray-900">{index} {data.username}</p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">email</p>
                    </div>
                </div>
                <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">걸린 시간 : {data.time}</p>
                </div>
                </li>
            </ul>
        </div>  
    )
}
