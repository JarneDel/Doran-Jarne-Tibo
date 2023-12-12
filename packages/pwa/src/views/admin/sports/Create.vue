<script lang="ts">
// Vue
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
// Components
import StyledInputText from '@/components/generic/StyledInputText.vue';
import StyledButton from '@/components/generic/StyledButton.vue';
import Error from '@/components/Error.vue';
// Composables
import UseFirebase from '@/composables/useFirebase';
// GraphQL
import {
  CREATE_SPORT,
  createSportInput,
  ICreateSport,
} from '@/graphql/sport.query';
// Apollo
import { useMutation } from '@vue/apollo-composable';

// Export default
export default defineComponent({
  name: 'CreateSport',
  components: {
    StyledInputText,
    StyledButton,
    Error,
  },

  setup: function () {
    // Router
    const { push } = useRouter();

    // Firebase
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();

    // CREATE ROOM
    const { mutate } = useMutation<ICreateSport>(CREATE_SPORT);

    // Variables
    const name = ref('');
    const description = ref('');
    const errorMessages = ref<string[]>([]);

    // Computed
    const descriptionLength = computed(() => {
      return description.value.length + '/250';
    });

    // Handle submit
    const handleSubmit = async (e: Event) => {
      //prevent default submit behaviour
      e.preventDefault();

      const params: createSportInput = {
        name: name.value,
        description: description.value,
      };

      //Create a new room in the database
      mutate({
        createSportInput: params,
      })
        .then((e) => {
          //Redirect to the admin sports page
          push('/admin/sports/');
        })
        .catch((e) => {
          // GraphQL error messages
          const originalError = e.graphQLErrors[0].extensions
            .originalError as any;
          if (!originalError || !originalError.message)
            return console.log('no message');

          console.log({ originalError });
          originalError.message.forEach((message: string) => {
            errorMessages.value.push(message);
          });
        });
    };

    return {
      idToken,
      name,
      description,
      handleSubmit,
      descriptionLength,
      errorMessages,
    };
  },
});
</script>

<template>
  <Error
    v-for="(error, index) of errorMessages"
    :key="index"
    :is-shown="errorMessages[index] !== ''"
    :msg="error"
    @update:is-shown="errorMessages[index] = ''"
  />
  <div
    class="p-2 sm:p-4 md:p-8 flex min-h-full flex-col items-center justify-center"
  >
    <div class="rounded-2 w-full max-w-md bg-white p-8 shadow-md">
      <form @submit.prevent="handleSubmit" class="flex max-w-md flex-col gap-4">
        <h2 class="text-primary-text text-2xl font-medium">
          {{ $t('sports.create') }}
        </h2>
        <div class="flex flex-col gap-2">
          <StyledInputText
            v-model="name"
            :label="$t('sports.name')"
            name="name"
            :maxlength="20"
            :placeholder="$t('sports.namePlaceholder')"
            type="text"
          />
          <div>
            <label class="text-primary-text font-medium" for="description">{{
              $t('inventory.description')
            }}</label>
            <div class="flex items-end">
              <textarea
              id="description"
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
