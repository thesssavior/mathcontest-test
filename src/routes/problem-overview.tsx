import { Link, useParams } from "react-router-dom";
import Leaderboard from "../components/problem-page/leaderboard";
import Discuss from "../components/problem-page/discuss";

export default function ProblemOverview() {
    const { folderName, number } = useParams<{folderName:string; number:string}>()
    const backspaced = folderName?.slice(0,-1)
    const basePath = `${folderName}/${backspaced}${number}`

    return (
        <div className="problem-overview w-full h-full overflow-visible">
            <h1 className="Title">{`${folderName}`}</h1>
            <Leaderboard basePath={basePath}/>
            <div className="flex flex-col justify-center items-center my-4">
            <Link 
                className="flex w-1/4 justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" 
                to={`/problem/${folderName}/${number}/solve`}>
                풀기
            </Link>
            </div>
            <Discuss/>
        </div>
    )
}