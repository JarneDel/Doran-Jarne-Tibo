<script lang="ts">
import { defineComponent, ref } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import { Upload, User } from 'lucide-vue-next'
import { useMutation } from '@vue/apollo-composable'
import { UPDATE_PROFILE_PICTURE_GROUP } from '@/graphql/group.query.ts'
import {
  UPDATE_PROFILE_PICTURE_STAFF,
  UpdateProfilePictureStaff,
} from '@/graphql/staff.query.ts'
import useUser from '@/composables/useUser.ts'

export default defineComponent({
  name: 'ProfilePicture',
  components: { User, Upload },
  props: {
    size: {
      type: Number,
      default: 96,
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sizePx() {
      return `${this.size}px`
    },
  },
  setup() {
    const { uploadProfilePicture, getProfilePictureUrl } = useFirebase()
    const { customUser } = useUser()
    const { mutate: mutateGroup } = useMutation(UPDATE_PROFILE_PICTURE_GROUP)
    const { mutate: mutateStaff } = useMutation<UpdateProfilePictureStaff>(
      UPDATE_PROFILE_PICTURE_STAFF,
    )

    const pfpUrl = ref<string | null>()
    const isHovering = ref<boolean>(false)
    const uploadPicture = (e: Event) => {
      console.log('upload picture')
      const target = e.target as HTMLInputElement

      if (!target.files) return

      uploadProfilePicture(target.files[0]).then(url => {
        pfpUrl.value = url

        if (!customUser.value) return

        const { role } = customUser.value.userByUid

        if (role === 'GROUP') {
          mutateGroup({
            profilePictureUrl: url,
          })
        } else if (['STAFF', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
          mutateStaff({
            profilePictureUrl: url,
          })
        }
      })
    }

    getProfilePictureUrl().then(url => {
      console.log(url)
      pfpUrl.value = url
    })

    // set random id for label and input
    const id = ref(Math.random().toString())
    return { uploadPicture, pfpUrl, id, isHovering }
  },
})
</script>

<template>
  <label :for="id" class="grid grid-cols-1 grid-rows-1">
    <User v-if="!pfpUrl" :size="size" class="col-start-1 row-start-1" />
    <img
      v-else
      :src="pfpUrl"
      alt="your profile"
      class="size col-start-1 row-start-1 rounded-full object-cover"
    />
    <div
      v-if="editable"
      class="hover:bg-neutral-6/60 size col-start-1 row-start-1 grid place-content-center rounded-full transition-colors"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <Transition appear name="fade">
        <Upload v-if="isHovering" :size="size / 2" class="c-white"></Upload>
      </Transition>
    </div>
  </label>
  <input
    v-if="editable"
    :id="id"
    accept="image/jpeg, image/png"
    class="hidden"
    type="file"
    @change="uploadPicture"
  />
</template>

<style scoped>
.size {
  width: v-bind(sizePx);
  height: v-bind(sizePx);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
