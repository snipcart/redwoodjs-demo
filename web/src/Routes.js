// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, PrivateRoute } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route unauthorized path="/" page={HomePage} name="home" />
      <PrivateRoute path="/products/new" page={NewProductPage} name="newProduct" />
      <PrivateRoute path="/products/{id:Int}/edit" page={EditProductPage} name="editProduct" />
      <PrivateRoute path="/products/{id:Int}" page={ProductPage} name="product" />
      <PrivateRoute path="/products" page={ProductsPage} name="products" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
