interface LoggedInProps {
    username:string
    onLogOut: () => void
}

export const LoggedIn : React.FC<LoggedInProps> = ({username, onLogOut}) => {
    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-4 lg:px-4">
                <div className="sm:mx-auto sm:w-6/12 sm:max-w-xs mt-8 text-center">
                <h2 className="mt-10 mb-3 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Logged in as {username}
                </h2>
                <button className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                onClick={onLogOut}>Log out</button>
                </div>
        </div>
    )
}