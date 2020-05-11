export const schema = gql`
  type Product {
    id: Int!
    name: String!
    price: Float!
    description: String
    image: String
  }

  type Query {
    products: [Product!]!
    product(id: Int!): Product!
  }

  input CreateProductInput {
    name: String!
    price: Float!
    description: String
    image: String
  }

  input UpdateProductInput {
    name: String
    price: Float
    description: String
    image: String
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: Int!, input: UpdateProductInput!): Product!
    deleteProduct(id: Int!): Product!
  }
`
