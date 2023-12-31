import { useEffect } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './routes/home'
import styled, { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import { auth } from './firebase'
import List from './routes/list'
import Problem from './routes/problem'
import ProblemOverview from './routes/problem-overview'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const router = createBrowserRouter([
  {
    path: "",
    element: <Home/>,
  },
  {
    path: "list/:folderName",
    element: <List/>
  },
  {
    path: "problem/:folderName/:number",
    element: <ProblemOverview/>
  },
  {
    path: "problem/:folderName/:number/solve",
    element: <Problem/>
  }
])

const GlobalStyle = createGlobalStyle`
  ${reset}; 
  * {
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`

function App() {
  const init = async () => {
    await auth.authStateReady()
  }

  useEffect(()=>{
    init()
  },[])

  return (
    <Wrapper>
      <GlobalStyle/>
      <RouterProvider router={router}/>
    </Wrapper>
  )
}

export default App
