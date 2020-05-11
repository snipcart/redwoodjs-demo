import ProductsLayout from 'src/layouts/ProductsLayout'
import ProductCell from 'src/components/ProductCell'

const ProductPage = ({ id }) => {
  return (
    <ProductsLayout>
      <ProductCell id={id} />
    </ProductsLayout>
  )
}

export default ProductPage
