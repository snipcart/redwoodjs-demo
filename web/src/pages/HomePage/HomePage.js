import { useEffect } from "react";
import { navigate, routes } from '@redwoodjs/router'

const HomePage = () => {
  const netlifyIdentity = window.netlifyIdentity;

  useEffect(() => {
    netlifyIdentity.on('login', (_user) => {
      navigate(routes.products())
    });
    if(netlifyIdentity.currentUser() != null){
      navigate(routes.products())
    }
  })

  const openLoginModal = () => {


    if(netlifyIdentity)
      netlifyIdentity.open();
    else
      console.log('netlifyIdentity not defined')
  }

  return (
    <div>
      <h1>HomePage</h1>
      <p>Find me in ./web/src/pages/HomePage/HomePage.js</p>
      <button onClick={openLoginModal}>Login</button>
    </div>
  )
}

export default HomePage
