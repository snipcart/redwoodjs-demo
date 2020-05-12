import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/api'
import importAll from '@redwoodjs/api/importAll.macro'

import { db } from 'src/lib/db'

const schemas = importAll('api', 'graphql')
const services = importAll('api', 'services')

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
