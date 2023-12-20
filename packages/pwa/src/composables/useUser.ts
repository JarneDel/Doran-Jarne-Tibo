import { ref } from 'vue'
// import { User } from '../interface/userInterface'
import useGraphql from './useGraphql'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { USER_BY_UID } from '@/graphql/user.query.ts'

const customUser = ref<User | null>()

const { apolloClient } = useGraphql()

provideApolloClient(apolloClient)

const restoreCustomUser = async () => {
  return new Promise<void>(resolve => {
    const { onResult } = useQuery(
      USER_BY_UID,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )
    onResult(result => {
      // console.log('result', result)
      if (result.data) {
        customUser.value = result.data.userByUid as User
        resolve()
      }
    })
  })
}
const userLogout = () => {
  customUser.value = null
}


export interface User {
  __typename: string
  id: string
  UID: string
  locale: string
  role: string
  createdAt: string
  updatedAt: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  holidaysLeft?: number
  holidayDates?: string[]
  btwNumber?: string
  score?: number
  profilePictureUrl: string
}


export default () => {
  return {
    customUser,
    restoreCustomUser,
    userLogout,
  }
}
