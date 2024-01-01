import { useParams } from "react-router-dom";
import Leaderboard from "../components/problem-overview-components/leaderboard";
import {Intro} from "../components/problem-overview-components/intro";
import CommentSection from "../components/problem-overview-components/comment-section";

export default function ProblemOverview() {
    const { folderName, number } = useParams<{folderName:string; number:string}>()
    const backspaced = folderName?.slice(0,-1)
    const basePath = `${folderName}/${backspaced}${number}`

    return (
        <div className="problem-overview w-full h-full overflow-visible">
            <Intro folderName={folderName} number={number}/>
            <div className="leaderboard w-full bg-gray-100 pb-5">
            <Leaderboard basePath={basePath}/>
            </div>
            <div className="flex flex-col justify-center items-center my-4">

            </div>
            <div className="discuss w-full mt-3">
                <CommentSection/>
            </div>
        </div>
    )
}