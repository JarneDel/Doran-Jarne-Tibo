import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { caching, MemoryCache } from 'cache-manager'
@Injectable()
export class FirebaseGuard extends AuthGuard('firebase-auth') {
  private cache: MemoryCache

  constructor() {
    super()
    caching('memory', {
      ttl: 60 * 60 * 1000,
      max: 100,
    }).then(cache => {
      this.cache = cache
    })
  }

  /**
   * This method is called when the guard is triggered
   * Caches the user in memory for 2 minutes
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const req = ctx.getContext().req
    const idToken = req.headers.authorization?.split('Bearer ')[1]

    if (idToken) {
      const cachedUser = await this.cache.get(idToken)
      if (cachedUser) {
        req.user = cachedUser
        return true
      }
    }

    const result = await super.canActivate(context)

    if (result && idToken) {
      await this.cache.set(idToken, req.user)
    }

    return !!result
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
