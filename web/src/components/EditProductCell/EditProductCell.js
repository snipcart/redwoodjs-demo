import { useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import ProductForm from 'src/components/ProductForm'

export const QUERY = gql`
  query FIND_PRODUCT_BY_ID($id: Int!) {
    product: product(id: $id) {
      id
      name
      price
      description
      image
    }
  }
`
const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProductMutation($id: Int!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Success = ({ product }) => {
  const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      navigate(routes.products())
    },
  })

  const onSave = (input, id) => {
    updateProduct({ variables: { id, input } })
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <header className="bg-gray-300 text-gray-700 py-3 px-4">
        <h2 className="text-sm font-semibold">Edit Product {product.id}</h2>
      </header>
      <div className="bg-gray-100 p-4">
        <ProductForm product={product} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
