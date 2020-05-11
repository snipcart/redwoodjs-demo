import ProductsLayout from 'src/layouts/ProductsLayout'
import EditProductCell from 'src/components/EditProductCell'

const EditProductPage = ({ id }) => {
  return (
    <ProductsLayout>
      <EditProductCell id={id} />
    </ProductsLayout>
  )
}

export default EditProductPage
