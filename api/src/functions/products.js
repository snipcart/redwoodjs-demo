import importAll from '@redwoodjs/api/importAll.macro'
const productsService = importAll('api', 'services').products

export const handler = async () => {
  const products = await productsService.products()
  return {
    body: products
  }
}