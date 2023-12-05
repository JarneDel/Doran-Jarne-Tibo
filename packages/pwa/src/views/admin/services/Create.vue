<script lang="ts">
// Imports
import { useMutation, useQuery } from '@vue/apollo-composable'
import { useRouter } from 'vue-router'
import {
  CREATE_SERVICE,
  createServiceInput,
  ICreateService,
} from '@/graphql/service.query'
import { ALL_ROOMS, IRoom } from '@/graphql/room.query'
import { ALL_STAFF } from '@/graphql/staff.query'
import { computed, defineComponent, ref } from 'vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import UseFirebase from '../../../composables/useFirebase'
import StyledButton from '@/components/generic/StyledButton.vue'

// Export default
export default defineComponent({
  name: 'CreateService',
  components: {
    StyledInputText,
    StyledButton,
  },

  setup: function () {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    const { push } = useRouter()

    // All ROOMS
    const {
      loading: loadingRooms,
      result: resultRooms,
      error: errorRooms,
      onResult: onResultRooms,
    } = useQuery<IRoom>(ALL_ROOMS)

    // All STAFF
    const {
      loading: loadingStaff,
      result: resultStaff,
      error: errorStaff,
      onResult: onResultStaff,
    } = useQuery(ALL_STAFF)

    // CREATE ROOM
    const { mutate } = useMutation<ICreateService>(CREATE_SERVICE)

    // Variables
    const name = ref('')
    const description = ref('')
    const roomList = ref()
    const roomIds = ref<Array<string>>()
    const staffList = ref()
    const staffUIDs = ref<Array<string>>()

    const descriptionLength = computed(() => {
      return description.value.length + '/250'
    })

    onResultRooms(result => {
      roomList.value = result.data.GetAllRooms.map((room: any) => {
        return {
          ...room,
          selected: false,
        }
      })
    })

    onResultStaff(result => {
      staffList.value = result.data.staff.map((staff: any) => {
        return {
          ...staff,
          selected: false,
        }
      })
    })

    const staffCount = computed(() => {
      return staffList.value?.filter((s: any) => s.selected).length
    })

    const roomCount = computed(() => {
      return roomList.value?.filter((s: any) => s.selected).length
    })

    const handleSubmit = async (e: Event) => {
      //prevent default submit behaviour
      e.preventDefault()

      roomIds.value = roomList.value
        ?.filter((s: any) => s.selected)
        .map((s: any) => s.id)

      staffUIDs.value = staffList.value
        ?.filter((s: any) => s.selected)
        .map((s: any) => s.UID)

      const params: createServiceInput = {
        name: name.value,
        description: description.value,
        roomId: roomIds.value || [],
        staffUID: staffUIDs.value || [],
      }

      console.log(params)

      //Create a new room in the database
      const res = await mutate({
        createServiceInput: params,
      })
      console.info(res)

      //Redirect to the admin sports page
      push('/admin/services/')
    }

    return {
      idToken,
      name,
      description,
      roomIds,
      staffUIDs,
      handleSubmit,
      descriptionLength,
      resultRooms,
      loadingRooms,
      errorRooms,
      onResultRooms,
      resultStaff,
      loadingStaff,
      errorStaff,
      onResultStaff,
      staffList,
      roomList,
      staffCount,
      roomCount,
    }
  },
})
</script>

<template>
  <div
    class="flex min-h-full flex-col items-center justify-center p-2 sm:p-4 md:p-8"
  >
    <div class="rounded-2 w-full max-w-md bg-white p-8 shadow-md">
      <form @submit.prevent="handleSubmit" class="flex max-w-md flex-col gap-4">
        <h2 class="text-primary-text text-2xl font-medium">
          {{ $t('service.create') }}
        </h2>
        <div class="flex flex-col gap-2">
          <StyledInputText
            v-model="name"
            :label="$t('service.name')"
            name="name"
            :maxlength="20"
            :placeholder="$t('service.namePlaceholder')"
            type="text"
          />
          <div>
            <span class="text-primary-text font-medium">{{
              $t('inventory.description')
            }}</span>
            <div class="flex items-end">
              <textarea
                v-model="description"
                maxlength="250"
                class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full resize-none rounded bg-white px-4 py-1.5 outline-none transition-colors"
                :placeholder="$t('service.descriptionPlaceholder')"
              ></textarea>
              <div
                class="relative -left-12 w-0 opacity-60"
                :class="{
                  '-left-14': description.length >= 10,
                  '-left-16': description.length >= 100,
                }"
              >
                {{ descriptionLength }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row lg:gap-4">
            <div class="w-full max-w-[50%]">
              <div class="flex justify-between">
                <span class="text-primary-text font-medium">{{
                  $t('service.rooms')
                }}</span>
                <span>{{ roomCount }}</span>
              </div>
              <ul
                class="hover:border-primary focus-within:border-primary-dark border-primary-light h-40 w-full overflow-y-scroll rounded-md border-2 p-1"
              >
                <li
                  class="flex select-none items-center gap-1"
                  v-if="roomList"
                  v-for="room in roomList"
                >
                  <input
                    class="cursor-pointer"
                    type="checkbox"
                    :name="room.id"
                    :id="room.id"
                    @change="
                      () => {
                        room.selected = !room.selected
                        if (room.selected) {
                          staffList.find(
                            (s: any) => s.id === room.id,
                          ).selected = true
                        } else {
                          staffList.find(
                            (s: any) => s.id === room.id,
                          ).selected = false
                        }
                      }
                    "
                  />
                  <label class="cursor-pointer" :for="room.id"
                    >{{ room.name }}
                  </label>
                </li>
              </ul>
            </div>
            <div class="w-full max-w-[50%]">
              <div class="flex justify-between">
                <span class="text-primary-text font-medium">{{
                  $t('service.staff')
                }}</span>
                <span>{{ staffCount }}</span>
              </div>
              <ul
                class="hover:border-primary focus-within:border-primary-dark border-primary-light h-40 w-full overflow-y-scroll rounded-md border-2 p-1"
              >
                <li
                  class="flex select-none items-center gap-1"
                  v-if="staffList"
                  v-for="staff in staffList"
                >
                  <input
                    class="cursor-pointer"
                    type="checkbox"
                    :name="staff.id"
                    :id="staff.id"
                    @change="
                      () => {
                        staff.selected = !staff.selected
                        if (staff.selected) {
                          staffList.find(
                            (s: any) => s.id === staff.id,
                          ).selected = true
                        } else {
                          staffList.find(
                            (s: any) => s.id === staff.id,
                          ).selected = false
                        }
                      }
                    "
                  />
                  <label class="cursor-pointer" :for="staff.id"
                    >{{ staff.firstName }}
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex justify-end py-3">
          <StyledButton :px="2" :py="1" type="submit"
            >{{ $t('item.new.submit') }}
          </StyledButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
