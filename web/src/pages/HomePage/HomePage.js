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
    <div className="login__wrapper d-flex align-items-center justify-content-center">
      <div className="login">
        <img src="/snipcart_logo.svg"/>
        <div><b>Username: </b> geeks+redwoodjs@snipcart.com</div>
        <div><b>Password: </b>123</div>
        <div className="btn" onClick={login}>Login</div>
      </div>
    </div>
  )
}

export default HomePage
