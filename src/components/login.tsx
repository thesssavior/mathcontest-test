import { signInAnonymously, updateProfile } from "firebase/auth"
import React, { useState } from "react"
import styled from "styled-components"
import { auth } from "../firebase"
import { FirebaseError } from "firebase/app"

const Input = styled.input``

const Wrapper = styled.div``

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Title = styled.h1``

const Error = styled.span`
    font-weight: 600;
    color: tomato;
`

export default function Login() {
    const [username, setUsername] = useState('')
    const [isLoading, setIsloading] = useState(false)
    const [error, setError] = useState('')

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (username === '' || isLoading) return null
        try {
            setIsloading(true)
            const credentials = await signInAnonymously(auth)
            await updateProfile(credentials.user, {
                displayName: username
            })
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        } finally {
            setIsloading(false)
        }
    }

    return (
        <Wrapper>
            <Title>Play as:</Title>
            <Form onSubmit={onSubmit}>
                <Input value={username} onChange={onChange} placeholder="name"/>
                {error !== ''? <Error>{error}</Error>:null}
                <Input type="submit" value={isLoading? "Loading...":"확인"}/>
            </Form>
        </Wrapper>
    )
}