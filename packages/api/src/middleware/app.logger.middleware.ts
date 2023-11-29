import { Injectable, NestMiddleware, Logger } from '@nestjs/common'

import { Request, Response, NextFunction } from 'express'
import { GraphQLRequest } from '@apollo/server'
import { parse } from 'graphql'

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const start = Date.now()
    const { method, path: url } = request

    response.on('close', () => {
      const { statusCode } = response
      const end = Date.now()
      const responseTime = end - start

      try {
        const { query }: GraphQLRequest = request.body
        const document = parse(query)

        const selectionNames =
          //@ts-ignore
          document.definitions[0].selectionSet.selections.map(
            (s: any) => s.name.value,
          )
        //@ts-ignore
        const operation = document.definitions[0].operation
        //@ts-ignore
        const queryName = document.definitions[0].name?.value

        this.logger.log(
          `${method} ${url} ${statusCode} ${responseTime}ms, ${operation} - ${selectionNames} ${
            queryName ? 'queryName:' + queryName : ''
          }`,
        )
      } catch (e) {
        this.logger.log(`${method} ${url} ${statusCode} ${responseTime}ms`)
      }
    })

    next()
  }
}
