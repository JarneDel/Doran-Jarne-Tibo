<script lang="ts">
// Imports
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import {
  CREATE_SERVICE,
  createServiceInput,
  ICreateService,
} from '@/graphql/service.query';
import { computed, defineComponent, ref } from 'vue';
import StyledInputText from '@/components/generic/StyledInputText.vue';
import UseFirebase from '../../../composables/useFirebase';
import StyledButton from '@/components/generic/StyledButton.vue';

// Export default
export default defineComponent({
  name: 'CreateService',
  components: {
    StyledInputText,
    StyledButton,
  },

  setup: function () {
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();
    const { push } = useRouter();

    // CREATE ROOM
    const { mutate } = useMutation<ICreateService>(CREATE_SERVICE);

    // Variables
    const name = ref('');
    const description = ref('');
    const roomIds = ref<Array<string>>();
    const staffUIDs = ref();

    const descriptionLength = computed(() => {
      return description.value.length + '/250';
    });

    const handleSubmit = async (e: Event) => {
      //prevent default submit behaviour
      e.preventDefault();

      const params: createServiceInput = {
        name: name.value,
        description: description.value,
        roomId: roomIds.value || [],
        staffUID: staffUIDs.value || [],
      };

      console.log(params);

      //Create a new room in the database
      const res = await mutate({
        createServiceInput: params,
      });
      console.info(res);

      //Redirect to the admin sports page
      push('/admin/services/');
    };

    return {
      idToken,
      name,
      description,
      roomIds,
      staffUIDs,
      handleSubmit,
      descriptionLength,
    };
  },
});
</script>

<template>
  <div
    class="p-2 sm:p-4 md:p-8 flex min-h-full flex-col items-center justify-center"
  >
    <div class="rounded-2 w-full max-w-md bg-white p-8 shadow-md">
      <form @submit.prevent="handleSubmit" class="flex max-w-md flex-col gap-4">
        <h2 class="text-primary-text text-2xl font-medium">
          {{ $t('service.create') }}
        </h2>
        <div>
          <StyledInputText
            v-model="name"
            :label="$t('service.name')"
            name="name"
            :maxlength="20"
            :placeholder="$t('service.namePlaceholder')"
            type="text"
          />
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
              class="relative w-0 -left-12 opacity-60"
              :class="{
                '-left-14': description.length >= 10,
                '-left-16': description.length >= 100,
              }"
            >
              {{ descriptionLength }}
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
