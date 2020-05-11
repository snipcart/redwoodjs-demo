import { useMutation } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import ProductForm from 'src/components/ProductForm'

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProductMutation($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
    }
  }
`

const NewProduct = () => {
  const [createProduct, { loading, error }] = useMutation(CREATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      navigate(routes.products())
    },
  })

  const onSave = (input) => {
    createProduct({ variables: { input } })
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <header className="bg-gray-300 text-gray-700 py-3 px-4">
        <h2 className="text-sm font-semibold">New Product</h2>
      </header>
      <div className="bg-gray-100 p-4">
        <ProductForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewProduct
