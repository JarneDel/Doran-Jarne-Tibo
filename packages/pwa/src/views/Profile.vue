<script lang="ts">
import { defineComponent } from 'vue'
import useUser from '@/composables/useUser'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation } from '@vue/apollo-composable'
import { UPDATE_GROUP } from '@/graphql/usser.query'
export default defineComponent({
  setup() {
    const { customUser } = useUser()
    const { mutate } = useMutation(UPDATE_GROUP)

    const saveUser = () => {
      console.log(typeof(customUser.value?.userByUid.id))
      mutate({
        _id: customUser.value?.userByUid.id,
        name: customUser.value?.userByUid.name,
        locale: customUser.value?.userByUid.locale,
        btwNumber: customUser.value?.userByUid.btwNumber,
      })
    }
    return { customUser, saveUser }
  },
  components: { StyledButton, StyledInputText },
})
</script>
<template>
  <div class="h-full">
    <div class="mx-auto h-full w-1/2 flex items-center justify-center">
      <div v-if="customUser?.userByUid.__typename == 'Group'" class=" bg-white p-4 rounded-lg w-full shadow-sm max-w-sm">
        <h1 class="font-600 text-xl">{{$t('nav.profile')}}</h1>
        <styled-input-text
          v-model="customUser.userByUid.name"
          :label="$t('profile.name')"
        />
        <styled-input-text
          v-model="customUser.userByUid.btwNumber"
          :label="$t('profile.btw')"
        />

        <label class="my-3 block">
          <span class="c-primary-text font-medium">{{
            $t('profile.taal')
          }}</span>
          <br />
          <select
            v-model="customUser.userByUid.locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
          >
            <option value="nl">Nederland</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="ch">中文</option>
          </select>
        </label>
        <StyledButton @click="saveUser"> {{ $t('button.safe') }} </StyledButton>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
