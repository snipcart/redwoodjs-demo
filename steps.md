## Technical tutorial: Build an Angular Static Website with Scully
**Prerequisites**
 - Basic knowledge of [React]([https://reactjs.org/](https://reactjs.org/)).
 - A [free Snipcart account](https://app.snipcart.com/register)—If you want to follow the e-commerce side of this demo.
 - Node [v12 and higher ]([https://nodejs.org/en/](https://nodejs.org/en/))
 - [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

### 1. Create a new Redwoodjs application
Create a new redwoodjs project
`yarn create redwood-app redwoodjs-cms`
This will scaffold a new redwood project

### 2. Create the product table
#### 2.1 Add schema to prisma
Open `schema.prisma` and change the UserExample model to the following
```
model Product {
	 id          Int     @default(autoincrement()) @id
	 name        String
	 price       Float
	 description String?
	 image       String?
}
```
#### 2.2 Create your first migration
Run the following command
`yarn rw db save`
The redwood-cli will ask you if you want to create the database. Select yes.
This will create an sqlite database for development purposes.
It will now ask fo the migration name, in this case `createProductsTable`
#### 2.3 Run your migration on your local database
You can now up migrations by running
`yarn rw db up`
This will create the products table in your database.

## 3. Create scaffold for products CRUD
`yarn rw g scaffold product`
This command scaffolded
- GraphQl queries and mutations
- Service for prisma to create, read, update and delete from your database
- The pages necessary for your CRUD operations

## 4. Update scaffold
One downside to redwoodjs is the form it creates doesn't support floats by default so we have to update it.
In `ProductForm.js` replace the on submit to the following:
```javascript
const onSubmit = (data) => {
   data.price = parseFloat(data.price)
   props.onSave(data, props?.product?.id)
 }
 ```
 Also, make sure the `type` of the price TextField is set to `number`
 ```javascript
<TextField
	name="price"
	type="number"
	defaultValue={props.product?.price}
	className={CSS.input}
	errorClassName={CSS.inputError}
	validation={{ required: true }}
	/>
```
This is needed because by default price will be a string and it will cause a problem when trying to add a new product.

## 5. Create a new product
To add a product, you first have to run your project locally
`yarn rw dev` will create a server
Now, navigate to `localhost:8910`. From there, you can run your CRUD operations.
Create a new product.

Voilà your simple crud CMS should now be working without much effort.

## 6. Deploying the cms
- Create a [Netlify account](https://app.netlify.com/signup) (this will be used to deploy our project)
- Create a [Heroku account](https://signup.heroku.com/login) (this will be used to host our database)
- Follow the deployment steps in the [redwoodjs doc](https://redwoodjs.com/tutorial/deployment)


## 7. Securing the cms
Now we want to secure the cms and the api to make sure only allowed users have access to your CRUD operations.
### 7.1 Adding Netlify Identity
- Add [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)
- Update the registration option to Invite only.
- Add the netlify-identity-widget package to our web project.
  `yarn workspace web add netlify-identity-widget`
- Add the redwoodjs/auth package to our web project
  `yarn workspace web add @redwoodjs/auth`

### 7.1 Integrating Netlify identity and RedwoodJS auth
Create a new Homepage using the following command:
`yarn rw g page Home /`
This will create a new page called home on the `/` route
Modify its content to:
```javascript
import { useEffect } from "react";
import { navigate, routes } from '@redwoodjs/router'
import {useAuth} from '@redwoodjs/auth'

const HomePage = () => {
  const { loading, authenticated, login } = useAuth()

  useEffect(() => {
    if(!loading && authenticated){
      navigate(routes.products())
    }
  }, [loading, authenticated])

  if (loading) {
    return <div></div>
  }

  return (
    <div>
      <h1>HomePage</h1>
      <p>Find me in ./web/src/pages/HomePage/HomePage.js</p>
      <button onClick={login}>Login</button>
    </div>
  )
}

export default HomePage
```
Modify `ProductsLayout.js` to:
```javascript
import { Link, routes, navigate } from '@redwoodjs/router'
import {useAuth} from '@redwoodjs/auth'

const ProductsLayout = (props) => {
  const {authenticated, loading, logout} = useAuth()

  if(!loading && !authenticated){
    navigate(routes.home())
  }

  return (
    <div className="rw-scaffold">
      <button onClick={logout}>Logout</button>
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
```
As of writing, I couldn't get the RedwoodProvider to work correctly with `@redwood/auth`. I found a workaround. I basically copied the uncompiled source code of `RedwoodProvider` to a new component I added in `web/src` I named the file `app.js`. It contains the following code:
```javascript
import { useState, useEffect } from 'react'

import { GraphQLProvider, createGraphQLClient } from '@redwoodjs/web/dist/graphql/index'

const useAuthStub = () => ({ loading: false, authenticated: false })

/**
 * Redwood's Provider ties together our authentication and Apollo's GraphQL Provider
 * when you pass the `useAuth` hook from `@redwoodjs/auth`
 * The authentication token is added to the headers of the GraphQL client.
 */
const RedwoodProvider = ({
  useAuth = window.__REDWOOD__USE_AUTH || useAuthStub,
  children,
}) => {
  const { loading, authenticated, getToken, type } = useAuth()
  const [authToken, setAuthToken] = useState()

  useEffect(() => {
    if (authenticated) {
      getToken().then((token) => setAuthToken(token))
    }
  }, [authenticated, getToken])

  // This really sucks because rendering is completely blocked whilst we're
  // restoring authentication.
  if (loading) {
    return <div>Loading</div>
  }
  // If we have an authToken then modify the headers of the GraphQL client.
  const client = authToken
    ? createGraphQLClient({
        headers: {
          // Used by `api` to determine the auth type.
          'X-Redwood-Auth-Type': type,
          Authorization: `Bearer ${authToken}`,
        },
      })
    : undefined

  return <GraphQLProvider client={client}>{children}</GraphQLProvider>
}

export default RedwoodProvider
```
This allow to pass the netlify token to our graphql endpoint.

## 8. Securing the graphql endpoint
To allow only authenticated users to query our graphql endpoint, I modified the handler (in `api/src/functions/graphql`) to the following code:
```javascript
export const handler = (event, context, callback) => {
  if(process.env.NODE_ENV === 'production' && context?.clientContext?.user == null){
    return callback(null, {
      statusCode: 401,
      body: "Unauthorized"
    })
  }
  return (createGraphQLHandler({
    schema: makeMergedSchema({
      schemas,
      services: makeServices({ services }),
    }),
    db,
  }))(event,context,callback)
}
```
In Netlify add `NODE_ENV` to `production` to the environment variables.

Unfortunately, when working locally `context.clientContext.user` is always set to `undefined` even with a Bearer. To work around this issue, we validate that the NODE_ENV is production and only check for authentication in production.

This also means we need to move all the devDependencies of our `package.json` files to production dependencies. This is needed because otherwise, Netlify won't have the necessary packages to build our app.
`api/package.json` should now look like this:
```json
{
  "name": "api",
  ...
  "dependencies": {
    "@redwoodjs/api": "^0.6.0",
    "jsonwebtoken": "^8.5.1"
  }
}
```
`web/package.json` should now look like this:
```json
{
  "name": "web",
  ...
  "dependencies": {
    "@redwoodjs/auth": "^0.6.1-canary.26",
    "@redwoodjs/router": "^0.6.0",
    "@redwoodjs/web": "^0.6.0",
    "netlify-identity-widget": "^1.6.0",
    "prop-types": "^15.7.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  }
}
```
`package.json` should now look like this:
```json
{
  ...
  "workspaces": {
    "packages": [
      "api",
      "web"
    ]
  },
  "dependencies": {
    "@redwoodjs/core": "^0.6.0",
    "netlify-plugin-prisma-provider": "^0.3.0"
  },
  ...
}
```

## 9. Integrating your new cms with snipcart (optional)
You will first need to create a new file in `api/src/functions`, let's call it `products.js`.
Inside this file add the following code:
```javascript
import importAll from '@redwoodjs/api/importAll.macro'
const productsService = importAll('api', 'services').products

export const handler = async () => {
  const products = await productsService.products()
  return {
    body: products
  }
}
```
Netlify will create an AWS Lambda with this code that will return all the products. It will allow Snipcart to fetch from this endpoint and add the products to its database.

## Closing thoughts
Since RedwoodJs is still in the early development phase, it lacked documentation. Also, it doesn't support typescript yet.  Because of the lack of documentation, the demo took me a bit over a day to build.

Where RedwoodJS shines is on the scaffolding part. Adding a table to the database and creating the pages for simple CRUD operations took mere minutes to do.

Overall I think RedwoodJS has excellent potential, but I don't think it's there yet. It is a great tool to scaffold a project rapidly without needing to build the API.