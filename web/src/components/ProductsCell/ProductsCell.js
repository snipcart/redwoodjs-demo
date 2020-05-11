import { Link, routes } from '@redwoodjs/router'

import Products from 'src/components/Products'

export const QUERY = gql`
  query PRODUCTS {
    products {
      id
      name
      price
      description
      image
    }
  }
`

export const beforeQuery = (props) => {
  return { variables: props, fetchPolicy: 'cache-and-network' }
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="text-center">
      {'No products yet. '}
      <Link
        to={routes.newProduct()}
        className="text-blue-500 underline hover:text-blue-700"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({ products }) => {
  return <Products products={products} />
}
