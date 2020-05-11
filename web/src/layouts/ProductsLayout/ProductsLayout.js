import { Link, routes, navigate } from '@redwoodjs/router'
import { useEffect, useState } from 'react'

const ProductsLayout = (props) => {

  const [checkedCurrentUser, setCheckedCurrentUser] = useState(false)

  useEffect(() => {
    const netlifyIdentity = window.netlifyIdentity;
    console.log(netlifyIdentity.currentUser())
    if(netlifyIdentity.currentUser() == null){
      navigate(routes.home())
    }
    setCheckedCurrentUser(true)
  })

  if(!checkedCurrentUser){
    return (<div></div>)
  }

  return (
    <div className="rw-scaffold">
      <div className="bg-white font-sans">
        <header className="flex justify-between py-4 px-8">
          <h1 className="text-xl font-semibold">
            <Link
              to={routes.products()}
              className="text-gray-700 hover:text-gray-900 hover:underline"
            >
              Products
            </Link>
          </h1>
          <Link
            to={routes.newProduct()}
            className="flex bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wide rounded"
          >
            <div className="text-xl leading-none">+</div>
            <div className="ml-1 leading-loose">New Product</div>
          </Link>
        </header>
        <main className="mx-4 pb-4">{props.children}</main>
      </div>
    </div>
  )
}

export default ProductsLayout
