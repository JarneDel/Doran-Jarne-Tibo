import { ref } from "vue";
import { User } from "../interface/userInterface";
import useGraphql from './useGraphql'
import { provideApolloClient, useQuery } from '@vue/apollo-composable'
import { USER_BY_UID } from '@/graphql/usser.query'
import firebase from './useFirebase'

const customUser = ref<User | null | undefined>()

const { apolloClient } = useGraphql()

provideApolloClient(apolloClient)

const restoreCustomUser = async () => {
  return new Promise<void>(resolve => {
    const {firebaseUser} = firebase()
    console.log(firebaseUser.value?.email)
    const { onResult } = useQuery(USER_BY_UID,{}, {
      fetchPolicy: 'no-cache',
    })
    onResult(result => {
      if (result.data) {
        customUser.value = result.data
        resolve()
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