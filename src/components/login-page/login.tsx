import { signInAnonymously, updateProfile } from "firebase/auth"
import React, { useState } from "react"
import styled from "styled-components"
import { auth } from "../../firebase"
import { FirebaseError } from "firebase/app"

const Error = styled.span`
    font-weight: 600;
    color: tomato;
`

interface LoginProps {
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}


export const Login: React.FC<LoginProps> = ({setUsername}) => {
  const [localUsername, setLocalUsername] = useState('')
  const [isLoading, setIsloading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      setLocalUsername(e.target.value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      
      if (localUsername === '' || localUsername === auth.currentUser?.displayName || isLoading) return null
      try {
          setIsloading(true)
          const credentials = await signInAnonymously(auth)
          await updateProfile(credentials.user, {
              displayName: localUsername
          })
          setUsername(localUsername)
      } catch (e) {
          if (e instanceof FirebaseError) {
              setError(e.message)
          }
      } finally {
          setIsloading(false)
      }
  }

  return (    
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-4 py-2 lg:px-4">
      <div className="sm:mx-auto sm:w-6/12 sm:max-w-xs mt-8">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          내 이름은:
        </h2>
      </div>
      <div className="sm:mx-auto max-w-md sm:w-full sm:max-w-xs">
        <form className="space-y-2 flex flex-row justify-center items-center" action="#" method="POST" onSubmit={onSubmit}>
            <div className="mt-1 w-3/4 flex justify-center">
              <input
                id="localUsername"
                name="localUsername"
                type="localUsername"
                autoComplete="localUsername"
                required
                placeholder="이름"
                value={localUsername}
                onChange={onChange}
                className="block h-8 w-5/6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset leading-6 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {error !== ''? <Error>{error}</Error>:null}
            </div>
            <div className="mt-1 w-1/4 flex justify-center">
              <input
                type="submit"
                className="block w-full bg-gray-200 h-8 rounded-md border-0 px-3 py-1 mb-1 text-sm font-medium leading-6 sm:leading-6 text-black shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                value={isLoading? "Loading...":"확인"}
              />
            </div>
        </form>
      </div>
    </div>
  )
}