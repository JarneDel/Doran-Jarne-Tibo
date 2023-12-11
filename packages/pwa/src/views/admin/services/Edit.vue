<script lang="ts">
export interface IUpdateItem {
  id?: string
  name?: string
  description?: string
  staff?: [
    {
      id?: string
      UID?: string
      locale?: string
      role?: string
      profilePictureUrl?: string
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    },
  ]
  rooms?: [
    {
      id?: string
      name?: string
      sports?: {
        id?: string
        name?: string
        description?: string
      }
      pricePerHour?: number
      type?: string
      canBeUsed?: boolean
    },
  ]
}

import { computed, defineComponent, ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  GET_SERVICE,
  IGetService,
  UPDATE_SERVICE,
} from '@/graphql/service.query.ts'
import { ALL_ROOMS, IRoom } from '@/graphql/room.query.ts'
import { ALL_STAFF } from '@/graphql/staff.query'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import useA11y from '@/composables/useA11y.ts'

export default defineComponent({
  name: 'Edit',
  components: { StyledButton, StyledInputText, Modal },
  setup() {
    const { push, currentRoute } = useRouter()
    const id = currentRoute.value.params.id as string
    const { setPageTitle } = useA11y()
    const { result: resultService, onResult: onResultService } =
      useQuery<IGetService>(GET_SERVICE, {
        id,
      })

    // Variables
    const staffList = ref()
    const staffListOld = ref()
    const roomList = ref()
    const roomListOld = ref()

    const staffCount = computed(() => {
      return staffList.value?.filter((s: any) => s.selected).length
    })

    const roomCount = computed(() => {
      return roomList.value?.filter((s: any) => s.selected).length
    })

    // ALL_ROOMS
    const {
      error: errorRooms,
      loading: loadingRooms,
      result: resultRooms,
      onResult: onResultRooms,
    } = useQuery<IRoom>(ALL_ROOMS, {}, { fetchPolicy: 'cache-and-network' })

    // All STAFF
    const {
      loading: loadingStaff,
      result: resultStaff,
      error: errorStaff,
      onResult: onResultStaff,
    } = useQuery(ALL_STAFF)

    const currentItem = ref<IUpdateItem>({})
    const oldResult = ref<IUpdateItem>()

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_SERVICE)

    const compare = (val?: IUpdateItem, oldValue?: IUpdateItem): boolean => {
      if (!val || !oldValue) return false
      if (!roomList.value || !roomListOld.value) return false

      const equalRooms = roomList.value.every((room: any) => {
        return (
          roomListOld.value.find((r: any) => r.id === room.id)?.selected ===
          room.selected
        )
      })

      const equalStaff = staffList.value.every((staff: any) => {
        return (
          staffListOld.value.find((s: any) => s.UID === staff.UID)?.selected ===
          staff.selected
        )
      })

      return (
        val.name !== oldValue.name ||
        val.description !== oldValue.description ||
        !equalRooms ||
        !equalStaff
      )
    }

    // Recreate the room list with a selected property
    onResultRooms(result => {
      roomList.value = result.data.GetAllRooms.map((room: any) => {
        return {
          ...room,
          selected: resultService.value?.service.rooms?.find(
            r => r.id === room.id,
          )
            ? true
            : false,
        }
      })
      roomListOld.value = result.data.GetAllRooms.map((room: any) => {
        return {
          ...room,
          selected: resultService.value?.service.rooms?.find(
            r => r.id === room.id,
          )
            ? true
            : false,
        }
      })
    })

    // Recreate the staff list with a selected property
    onResultStaff(result => {
      staffList.value = result.data.staff.map((staff: any) => {
        return {
          ...staff,
          selected: resultService.value?.service.staff?.find(
            s => s.UID === staff.UID,
          )
            ? true
            : false,
        }
      })
      staffListOld.value = result.data.staff.map((staff: any) => {
        return {
          ...staff,
          selected: resultService.value?.service.staff?.find(
            s => s.UID === staff.UID,
          )
            ? true
            : false,
        }
      })
    })

    // Watch the current item for changes
    watch(
      currentItem,
      value => {
        if (!oldResult.value) return
        checkChanged()
      },
      { deep: true },
    )

    watch(
      roomList,
      value => {
        if (!oldResult.value) return
        checkChanged()
      },
      { deep: true },
    )

    watch(
      staffList,
      value => {
        if (!oldResult.value) return
        checkChanged()
      },
      { deep: true },
    )

    const checkChanged = () => {
      if (!oldResult.value) return
      hasChanged.value = compare(currentItem.value, oldResult.value)
    }

    const hasChanged = ref<boolean>(false)

    onResultService(param => {
      // Set page title
      setPageTitle('Edit ' + param.data.service.name)

      // Set current item
      currentItem.value = JSON.parse(JSON.stringify(param.data.service))

      // Set old result
      oldResult.value = JSON.parse(JSON.stringify(param.data.service))
    })

    const submit = () => {
      updateItem(id)
    }

    const updateItem = (id: string) => {
      // Update the item in the database
      mutateUpdateItem({
        updateServiceInput: {
          id: id,
          name: currentItem.value.name,
          description: currentItem.value.description,
          staffUID: staffList.value
            ?.filter((s: any) => s.selected)
            .map((s: any) => s.UID),
          roomId: roomList.value
            ?.filter((s: any) => s.selected)
            .map((s: any) => s.id),
        },
      }).then(e => {
        push(`/admin/services`)
      })
    }

    const descriptionLength = computed(() => {
      if (!currentItem.value.description) return '0/250'
      return currentItem.value.description.length + '/250'
    })

    const handleRoomChange = (room: any) => {
      room.selected = !room.selected
      if (room.selected) {
        roomList.value.find((r: any) => r.id === room.id).selected = true
      } else {
        roomList.value.find((r: any) => r.id === room.id).selected = false
      }
    }

    const handleStaffChange = (staff: any) => {
      staff.selected = !staff.selected
      if (staff.selected) {
        staffList.value.find((s: any) => s.id === staff.id).selected = true
      } else {
        staffList.value.find((s: any) => s.id === staff.id).selected = false
      }
    }

    return {
      push,
      submit,
      resultService,
      errorRooms,
      resultRooms,
      loadingRooms,
      errorStaff,
      resultStaff,
      loadingStaff,
      currentItem,
      hasChanged,
      descriptionLength,
      id,
      staffList,
      roomList,
      staffCount,
      roomCount,
      handleRoomChange,
      handleStaffChange,
    }
  },
})
</script>

<template>
  <!--  Todo: popup to discard changes-->
  <Modal min-width="min-w-md" @close="push(`/admin/services`)">
    <template v-slot:title>
      <h2
        v-if="resultService?.service"
        class="text-primary-text mr-2 w-full text-2xl font-bold"
      >
        {{ resultService.service.name }}
      </h2>
    </template>
    <template v-slot:default>
      <form v-if="resultService?.service" @submit.prevent="submit">
        <StyledInputText
          v-model="currentItem.name"
          :label="$t('inventory.name')"
          :maxlength="20"
        />
        <label
          :title="$t('inventory.description')"
          class="mt-2 block"
          for="description"
        >
          <span class="text-primary-text font-medium">{{
            $t('inventory.description')
          }}</span>
          <div class="flex items-end">
            <textarea
              v-model="currentItem.description"
              maxlength="250"
              class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark h-34 w-full resize-none rounded bg-white px-4 py-1.5 outline-none transition-colors"
            ></textarea>
            <div
              v-if="currentItem.description"
              class="relative -left-12 w-0 opacity-60"
              :class="{
                '-left-14': currentItem.description.length >= 10,
                '-left-16': currentItem.description.length >= 100,
              }"
            >
              {{ descriptionLength }}
            </div>
          </div>
        </label>
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
                  :checked="room.selected"
                  @change="handleRoomChange(room)"
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
                  :checked="staff.selected"
                  @change="handleStaffChange(staff)"
                />
                <label class="cursor-pointer" :for="staff.id"
                  >{{ staff.firstName }}
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div class="flex justify-end">
          <StyledButton
            :disabled="!hasChanged"
            button-type="secondary"
            class="mt4"
            type="submit"
          >
            {{ $t('item.edit.modify') }}
          </StyledButton>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped></style>
