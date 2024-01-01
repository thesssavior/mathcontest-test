import { callouts } from "../../constants";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import React from "react";

    interface ProblemSetProps {
        setClickWithoutUser: React.Dispatch<React.SetStateAction<boolean>>
    }

export const ProblemSet:React.FC<ProblemSetProps> = ({setClickWithoutUser}) => {

    return (
        <div className="mx-auto mt-10 max-w-xl lg:max-w-7xl sm:max-w-xs px-4 sm:px-6 lg:px-8">
        <div className="mx-auto lg:max-w-2xl py-8 sm:py-12 lg:py-16">
            <h2 className="text-2xl font-bold text-gray-900">어떤 문제들을 풀까?</h2>

            <div className="mt-10 space-y-0 grid grid-cols-3 gap-x-2 lg:gap-x-6">
            {callouts.map((callout) => (
                <Link onClick={()=>{
                    if (!auth.currentUser) {
                        setClickWithoutUser(true)
                        setTimeout(()=>setClickWithoutUser(false),2000)
                    }}} 
                to={auth.currentUser?`/list/${callout.link}`:'#'}
                // to={`/list/${callout.link}`}
                >
                    <div key={callout.name} className="group relative">
                <div className="relative h-56 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                    />
                </div>
                <p className="mt-6 text-base font-semibold text-gray-900">
                    <span className="absolute inset-0" />
                    {callout.name}
                </p>
                <p className=" text-sm text-gray-500">{callout.description}</p>
                </div>
                </Link>
            ))}
            </div>
        </div>
    </div>

    )
}