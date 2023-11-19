<script lang="ts">
//interfaces
interface ILoanableMaterial {
  GetAllLoanableMaterials: material[];
}

interface ISport {
  GetAllSports: [
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

import { material } from '@/interface/materialInterface';
import { defineComponent, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { ALL_LOANABLE_MATERIALS } from '@/graphql/loanableMaterials.query.ts';
import { ALL_SPORTS } from '@/graphql/sport.query.ts';
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ChevronRight,
  Edit2,
  Search,
} from 'lucide-vue-next';
import StyledButton from '@/components/generic/StyledButton.vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import useLastRoute from '@/composables/useLastRoute.ts';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';
import DoubleClickSelect from '@/components/generic/DoubleClickSelect.vue';

export default defineComponent({
  name: 'Overview',
  components: {
    DoubleClickSelect,
    DoubleClickEdit,
    Modal,
    StyledButton,
    Edit2,
    Search,
    ArrowDownNarrowWide,
    ArrowUpNarrowWide,
    ArrowUpDown,
    ChevronRight,
  },

  setup: function () {
    const search = ref<string>('');
    const searchServiceId = ref<string>('');
    const sortDirection = ref<string>('ASC');
    const sortFieldName = ref<string>('name');
    const isModalShown = ref<boolean>(true);

    const { push } = useRouter();

    // graphql
    const { error, loading, result } = useQuery<ILoanableMaterial>(
      ALL_LOANABLE_MATERIALS,
      {},
      {
        nextFetchPolicy: 'cache-and-network',
        fetchPolicy: 'cache-and-network',
      }
    );

    const {
      error: errorSports,
      loading: loadingSports,
      result: resultSports,
    } = useQuery<ISport>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' });

    // const { mutate: mutateUpdateItem } = useMutation(UPDATE_LOABALE_MATERIAL);

    const fetchWithFilters = () => {
      console.log('fetching with filters');
    };

    const { lastRoute } = useLastRoute();
    watch(
      lastRoute,
      (value) => {
        console.log(lastRoute);
        if (value.startsWith('/admin/sport-equipment/')) {
          console.log('refetching');
          fetchWithFilters();
        }
      },
      { immediate: true }
    );

    const ChangeSportsFilter = (event: Event) => {
      console.log(event);
    };

    return {
      error,
      loading,
      result,
      errorSports,
      loadingSports,
      resultSports,
      search,
      searchServiceId,
      sortDirection,
      sortFieldName,
      isModalShown,
      ChangeSportsFilter,
      push,
    };
  },
});
</script>

<template>
  <RouterView />
  <div class="mx-a max-w-7xl">
    <div class="flex items-center justify-between">
      <div class="py4 flex flex-row gap-4">
        <label class="grid grid-cols-1 grid-rows-1">
          <input
            :placeholder="$t('search')"
            class="p1 bg-primary-surface b-2 col-start-1 row-start-1 border-neutral-200 px-4"
            type="text"
          />
          <Search class="m2 col-start-1 row-start-1 mx-3 justify-self-end" />
        </label>
        <select
          id="service"
          class="bg-primary-surface b-2 border-neutral-200 px-4"
          name="service"
          @change="ChangeSportsFilter($event)"
        >
          <option value="">{{ $t('inventory.sort.service.all') }}</option>
          <option
            v-for="sport of resultSports?.GetAllSports"
            v-if="result"
            :key="sport.id"
            :value="sport.id"
          >
            {{ sport.name }}
          </option>
        </select>
      </div>
      <div>
        <StyledButton type="button" @click="push('/admin/sport-equipment/new')">
          {{ $t('inventory.new') }}
        </StyledButton>
      </div>
    </div>

    <table class="w-full border-collapse border-spacing-0">
      <thead class="border-2 border-neutral-200 bg-neutral-200/60 text-left">
        <tr class="text-neutral-8">
          <th class="cursor-pointer">
            <button class="gap2 flex flex-row items-center">
              <span>{{ $t('inventory.name') }}</span>
              <arrow-up-down v-if="sortFieldName !== 'name'" :size="16" />
              <arrow-down-narrow-wide
                v-else-if="sortDirection === 'DESC'"
                :size="16"
              />
              <arrow-up-narrow-wide v-else :size="16" />
            </button>
          </th>
          <th>{{ $t('inventory.description') }}</th>
          <th
            :title="$t('inventory.title.amount.tooltip')"
            class="cursor-pointer"
          >
            <button class="flex flex-row items-center gap-2">
              <span>{{ $t('inventory.amount') }} &nbsp;</span>
              <arrow-up-down
                v-if="sortFieldName !== 'amountInStock'"
                :size="16"
                class="inline"
              />
              <arrow-down-narrow-wide
                v-else-if="sortDirection === 'DESC'"
                :size="16"
                class="inline"
              />
              <arrow-up-narrow-wide v-else :size="16" class="inline" />
            </button>
          </th>
          <th class="cursor-pointer">
            {{ $t('sportEquipment.sports') }}
          </th>
          <!--          <th>Actions</th>-->
          <th></th>
        </tr>
      </thead>
      <tbody v-if="result">
        <tr
          v-for="loanableMaterial of result.GetAllLoanableMaterials"
          :key="loanableMaterial.id"
          class="hover:bg-primary-light/20 transition-colors duration-200"
        >
          <td>
            <DoubleClickEdit :value="loanableMaterial.name" />
          </td>
          <td :title="loanableMaterial.description" class="truncate">
            <DoubleClickEdit :value="loanableMaterial.description" />
          </td>
          <td
            :class="{
              'text-primary':
                loanableMaterial.totalAmount >= loanableMaterial.wantedAmount,
              'text-warning':
                loanableMaterial.totalAmount < loanableMaterial.wantedAmount,
            }"
            :title="$t('inventory.title.amount.tooltip')"
          >
            <DoubleClickEdit
              :value="loanableMaterial.totalAmount"
              type="number"
            />
            /
            <DoubleClickEdit
              :value="loanableMaterial.wantedAmount"
              type="number"
            />
          </td>
          <td>
            <ul class="flex flex-wrap">
              <li v-for="(sport, index) in loanableMaterial.sports">
                {{ sport.name }}
                <span
                  v-if="index !== loanableMaterial.sports.length - 1"
                  class="mr-1"
                >
                  ,
                </span>
              </li>
            </ul>
          </td>
          <td class="gap4 flex flex-row justify-end">
            <router-link
              :to="`/admin/sport-equipment/id/${loanableMaterial.id}`"
            >
              <ChevronRight />
            </router-link>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="_ of 5" class="loader">
          <td v-for="_ of 5" class="loader">loading</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="loading">Loading...</div>
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  font-weight: 400;
  font-size: 0.875rem;
  padding-block: 12px;
  padding-inline: 16px;
}

td {
  padding-block: 8px;
  padding-inline: 16px;
  border-top: 2px solid #e6edfa;
}

table {
  border: 2px solid #e6edfa;
}

.loader {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    background-color: white;
  }
  50% {
    background-color: #edf2fa;
  }
  100% {
    background-color: #fff;
  }
}

.text-primary {
  @apply text-primary;
}

.text-warning {
  @apply text-danger;
}
</style>
