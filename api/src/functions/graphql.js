import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/api'
import importAll from '@redwoodjs/api/importAll.macro'

import jwt from 'jsonwebtoken'

import { db } from 'src/lib/db'

const schemas = importAll('api', 'graphql')
const services = importAll('api', 'services')

export const handler = (event, context, callback) => {
  console.log('USER', context?.clientContext?.user)
  console.log("client context", context?.clientContext)
  if(process.env.NODE_ENV === 'production' && context?.clientContext?.user == null){
    console.log('401')
    return {
      statusCode: 401,
      body: "Unauthorized"
    }
  }
  return (createGraphQLHandler({
    schema: makeMergedSchema({
      schemas,
      services: makeServices({ services }),
    }),
    db,
  }))(event,context,callback)
}
