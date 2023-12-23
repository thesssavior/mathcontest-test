import { styled } from "styled-components"

export const Logo = styled.h1``

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;    
    align-items: center;
    width: 100%;
    gap: 10px;
`

export const Title = styled.h1``

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
`

export const Input = styled.input`
    width: 100%;
    &[type="submit"] {
        cursor: pointer;
        &:hover{
            opacity: 0.8;
        }
    }
`

export const Switcher = styled.span``

export const Error = styled.span`
    font-weight: 600;
    color: tomato;
`