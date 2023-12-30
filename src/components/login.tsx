import { signInAnonymously, updateProfile } from "firebase/auth"
import React, { useState } from "react"
import styled from "styled-components"
import { auth } from "../firebase"
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
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-4 lg:px-4">
      <div className="sm:mx-auto sm:w-6/12 sm:max-w-xs mt-8">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Play as:
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-xs">
        <form className="space-y-2" action="#" method="POST" onSubmit={onSubmit}>
            <div className="mt-1 w-full flex justify-center">
              <input
                id="localUsername"
                name="localUsername"
                type="localUsername"
                autoComplete="localUsername"
                required
                placeholder="이름"
                value={localUsername}
                onChange={onChange}
                className="block w-4/6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {error !== ''? <Error>{error}</Error>:null}
            </div>
          <div>
            <input
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              value={isLoading? "Loading...":"확인"}
            />
          </div>
        </form>

        {/* <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Start a 14 day free trial
          </a>
        </p> */}
      </div>
    </div>
  )
}