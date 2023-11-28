<script lang="ts">
// Imports
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import {
  CREATE_SPORT,
  createSportInput,
  ICreateSport,
} from '@/graphql/sport.query';
import { computed, defineComponent, ref } from 'vue';
import StyledInputText from '@/components/generic/StyledInputText.vue';
import UseFirebase from '../../../composables/useFirebase';
import StyledButton from '@/components/generic/StyledButton.vue';

// Export default
export default defineComponent({
  name: 'CreateSport',
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
    const { mutate } = useMutation<ICreateSport>(CREATE_SPORT);

    // Variables
    const name = ref('');
    const description = ref('');

    const descriptionLength = computed(() => {
      return description.value.length + '/250';
    });

    const handleSubmit = async (e: Event) => {
      //prevent default submit behaviour
      e.preventDefault();

      const params: createSportInput = {
        name: name.value,
        description: description.value,
      };

      //Create a new room in the database
      const res = await mutate({
        createSportInput: params,
      });
      console.info(res);

      //Redirect to the admin sports page
      push('/admin/sports/');
    };

    return {
      idToken,
      name,
      description,
      handleSubmit,
      descriptionLength,
    };
  },
});
</script>

<template>
  <div class="flex min-h-full flex-col items-center justify-center">
    <div class="rounded-2 w-full max-w-md bg-white p-8 shadow-md">
      <form @submit.prevent="handleSubmit" class="flex max-w-md flex-col gap-4">
        <h2 class="text-primary-text text-2xl font-medium">
          {{ $t('sports.create') }}
        </h2>
        <div>
          <StyledInputText
            v-model="name"
            :label="$t('sports.name')"
            name="name"
            :maxlength="20"
            :placeholder="$t('sports.namePlaceholder')"
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
              :placeholder="$t('sports.descriptionPlaceholder')"
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
