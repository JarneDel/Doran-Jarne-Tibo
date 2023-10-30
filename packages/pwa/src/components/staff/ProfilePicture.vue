<script lang="ts">
import { defineComponent, ref } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'

export default defineComponent({
  name: 'ProfilePicture',
  setup() {
    const { uploadProfilePicture, getProfilePictureUrl } = useFirebase()
    const uploadPicture = (e: Event) => {
      console.log('upload picture')
      const target = e.target as HTMLInputElement
      if (!target.files) return
      uploadProfilePicture(target.files[0])
    }
    const pfpUrl = ref<string | null>()
    getProfilePictureUrl().then(url => {
      pfpUrl.value = url
    })

    return { uploadPicture, pfpUrl }
  },
})
</script>

<template>
  <div v-if="!pfpUrl">LucideProfile</div>

  <input
    accept="image/jpeg, image/png"
    class="flex flex-col items-center justify-center"
    type="file"
    @change="uploadPicture"
  />
</template>

<style scoped></style>
