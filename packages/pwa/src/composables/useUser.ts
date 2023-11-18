import { ref } from 'vue'
import { User } from '../interface/userInterface'
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
      if (result.data) {
        customUser.value = result.data
        if (customUser.value?.userByUid.locale) resolve()
      }
    })
  })
}
const userLogout = () => {
  customUser.value = null
}
export default () => {
  return {
    customUser,
    restoreCustomUser,
    userLogout,
  }
}
