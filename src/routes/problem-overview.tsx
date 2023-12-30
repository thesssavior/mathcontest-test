import { Link, useParams } from "react-router-dom";
import Leaderboard from "../components/problem-page/leaderboard";
import Discuss from "../components/problem-page/discuss";

export default function ProblemOverview() {
    const { folderName, number } = useParams<{folderName:string; number:string}>()
    const backspaced = folderName?.slice(0,-1)
    const basePath = `${folderName}/${backspaced}${number}`

    return (
        <div>
            <h1 className="Title">{`${folderName}`}</h1>
            <Link to={`/problem/${folderName}/${number}/solve`}>
                풀기
            </Link>
            <Discuss/>
            <Leaderboard basePath={basePath}/>
        </div>
    )
}