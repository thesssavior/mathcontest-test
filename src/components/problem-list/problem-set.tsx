import { callouts } from "../../constants";
import { Link } from "react-router-dom";

export default function ProblemSet() {

    return (
        <div className="mx-auto mt-10 max-w-xl lg:max-w-7xl sm:max-w-xs px-4 sm:px-6 lg:px-8">
        <div className="mx-auto lg:max-w-2xl py-8 sm:py-12 lg:py-16">
            <h2 className="text-2xl font-bold text-gray-900">어떤 문제들을 풀까?</h2>

            <div className="mt-6 space-y-4 grid grid-cols-3 gap-x-2 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {callouts.map((callout) => (
                <Link to={`/list/${callout.link}`}>
                    <div key={callout.name} className="group relative">
                <div className="relative h-56 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <img
                    src={callout.imageSrc}
                    alt={callout.imageAlt}
                    className="h-full w-full object-cover object-center"
                    />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                    <a href={callout.href}>
                    <span className="absolute inset-0" />
                    {callout.name}
                    </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">{callout.description}</p>
                </div>
                </Link>
            ))}
            </div>
        </div>
    </div>

    )
}