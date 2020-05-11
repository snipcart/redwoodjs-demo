import { useEffect } from "react";
import { navigate, routes } from '@redwoodjs/router'
import {useAuth} from '@redwoodjs/auth'

const HomePage = () => {
  const { loading, authenticated, login } = useAuth()

  useEffect(() => {
    if(!loading && authenticated){
      navigate(routes.products())
    }
  }, [loading, authenticated])

  if (loading) {
    return <div></div>
  }

  return (
    <div>
      <h1>HomePage</h1>
      <p>Find me in ./web/src/pages/HomePage/HomePage.js</p>
      <button onClick={login}>Login</button>
    </div>
  )
}

export default HomePage
