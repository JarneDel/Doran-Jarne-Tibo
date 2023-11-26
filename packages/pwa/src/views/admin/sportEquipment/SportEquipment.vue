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
      createdAt: Date;
      updatedAt: Date;
    }
  ];
}

interface Sport {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateItem {
  id?: string;
  name?: string;
  totalAmount?: number;
  wantedAmount?: number;
  price?: number;
  sports?: Sport[];
  isComplete?: boolean;
  description?: string;
}

import { material } from '@/interface/materialInterface';
import { defineComponent, ref, watch } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import {
  ALL_LOANABLE_MATERIALS,
  UPDATE_LOABALE_MATERIAL,
} from '@/graphql/loanableMaterials.query.ts';
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
    const sportFilter = ref<string>('all');
    const isModalShown = ref<boolean>(true);

    const { push } = useRouter();

    // graphql
    const { error, loading, result, onResult, refetch } = useQuery<
      ILoanableMaterial
    >(
      ALL_LOANABLE_MATERIALS,
      {},
      {
        nextFetchPolicy: 'cache-and-network',
        fetchPolicy: 'cache-and-network',
      }
    );

    const currentItem = ref<IUpdateItem>({});

    const {
      error: errorSports,
      loading: loadingSports,
      result: resultSports,
      refetch: refetchSports,
    } = useQuery<ISport>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' });

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_LOABALE_MATERIAL);

    const sortedSportEquipment = ref<material[]>();

    onResult((result) => {
      sortedSportEquipment.value = result.data.GetAllLoanableMaterials;
      sortSportEquipment();
    });

    const updateItem = (id: string, newValue: any) => {
      const item = sortedSportEquipment.value?.find((item) => item.id === id);
      if (!item) return;
      // Update the item in the local array
      currentItem.value.name = item.name;
      currentItem.value.totalAmount = item.totalAmount;
      currentItem.value.wantedAmount = item.wantedAmount;
      currentItem.value.price = item.price;
      currentItem.value.sports?.map((sport) => {
        return sport.id;
      });
      currentItem.value.isComplete = item.isComplete;
      currentItem.value.description = item.description;

      // Update the item with the new values
      if (newValue.name) currentItem.value.name = newValue.name;
      if (newValue.totalAmount)
        currentItem.value.totalAmount = newValue.totalAmount;
      if (newValue.wantedAmount)
        currentItem.value.wantedAmount = newValue.wantedAmount;
      if (newValue.price) currentItem.value.price = newValue.price;
      if (newValue.sports) currentItem.value.sports = newValue.sports;
      if (newValue.isComplete)
        currentItem.value.isComplete = newValue.isComplete;
      if (newValue.description)
        currentItem.value.description = newValue.description;

      // Update the item in the database
      mutateUpdateItem({
        updateLoanableMaterialInput: {
          _id: id,
          name: currentItem.value.name,
          totalAmount: currentItem.value.totalAmount,
          wantedAmount: currentItem.value.wantedAmount,
          price: currentItem.value.price,
          SportId: currentItem.value.sports?.map((sport) => {
            return sport.id;
          }),
          isComplete: currentItem.value.isComplete,
          description: currentItem.value.description,
        },
      }).then((e) => {
        fetchWithFilters();
      });
    };

    const sortSportEquipment = () => {
      if (!sortedSportEquipment.value) return;

      let newArray = [...sortedSportEquipment.value];

      if (sportFilter.value !== 'all') {
        // Go through all loanable materials and remove those that don't have the selected sport
        newArray = newArray.filter((loanableMaterial) => {
          return loanableMaterial.sports.some(
            (sport) => sport.id === sportFilter.value
          );
        });
      } else {
        if (result.value?.GetAllLoanableMaterials)
          sortedSportEquipment.value = result.value.GetAllLoanableMaterials;
        newArray = [...sortedSportEquipment.value];
      }

      if (search.value !== '') {
        newArray = newArray.filter((loanableMaterial) => {
          return (
            loanableMaterial.name
              .toLowerCase()
              .includes(search.value.toLowerCase()) ||
            loanableMaterial.description
              .toLowerCase()
              .includes(search.value.toLowerCase())
          );
        });
      }

      if (sortFieldName.value === 'name') {
        if (sortDirection.value === 'ASC') {
          newArray.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          newArray.sort((a, b) => b.name.localeCompare(a.name));
        }
      } else if (sortFieldName.value === 'amount') {
        if (sortDirection.value === 'ASC') {
          newArray.sort((a, b) => a.totalAmount - b.totalAmount);
        } else {
          newArray.sort((a, b) => b.totalAmount - a.totalAmount);
        }
      }

      sortedSportEquipment.value = newArray;
    };

    const sortField = (field: string) => {
      if (sortFieldName.value === field) {
        sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortFieldName.value = field;
        sortDirection.value = 'ASC';
      }
      sortSportEquipment();
    };

    const fetchWithFilters = () => {
      refetch();
      refetchSports();
    };

    const { lastRoute } = useLastRoute();
    watch(
      lastRoute,
      (value) => {
        if (value.startsWith('/admin/sport-equipment/')) {
          fetchWithFilters();
        }
      },
      { immediate: true }
    );

    const ChangeSportsFilter = (e: Event) => {
      fetchWithFilters();
      const target = e.target as HTMLSelectElement;
      sportFilter.value = target.value;
      sortSportEquipment();
    };

    const ChangeSearchFilter = (e: Event) => {
      fetchWithFilters();
      const target = e.target as HTMLInputElement;
      search.value = target.value;
      sortSportEquipment();
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
      sortField,
      ChangeSportsFilter,
      push,
      updateItem,
      currentItem,
      sortedSportEquipment,
      ChangeSearchFilter,
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
            v-model="search"
            @input.change="ChangeSearchFilter"
          />
          <Search class="m2 col-start-1 row-start-1 mx-3 justify-self-end" />
        </label>
        <select
          id="service"
          class="bg-primary-surface b-2 border-neutral-200 px-4"
          name="service"
          @input.capture="ChangeSportsFilter"
        >
          <option value="all">{{ $t('inventory.sort.service.all') }}</option>
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
        <StyledButton
          type="button"
          @click="push('/admin/sport-equipment/create')"
        >
          {{ $t('inventory.new') }}
        </StyledButton>
      </div>
    </div>

    <table class="w-full border-collapse border-spacing-0">
      <thead class="border-2 border-neutral-200 bg-neutral-200/60 text-left">
        <tr class="text-neutral-8">
          <th class="cursor-pointer" @click="sortField('name')">
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
            @click="sortField('amount')"
          >
            <button class="flex flex-row items-center gap-2">
              <span>{{ $t('inventory.amount') }} &nbsp;</span>
              <arrow-up-down
                v-if="sortFieldName !== 'amount'"
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
        <div></div>
        <tr
          v-for="loanableMaterial of sortedSportEquipment"
          :key="loanableMaterial.id"
          class="hover:bg-primary-light/20 transition-colors duration-200"
        >
          <td>
            <DoubleClickEdit
              :value="loanableMaterial.name"
              @submit="
                (newValue) =>
                  updateItem(loanableMaterial.id, { name: newValue })
              "
            />
          </td>
          <td :title="loanableMaterial.description" class="truncate">
            <DoubleClickEdit
              :value="loanableMaterial.description"
              @submit="
                (newValue) =>
                  updateItem(loanableMaterial.id, { description: newValue })
              "
            />
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
              @submit="
                (newValue) =>
                  updateItem(loanableMaterial.id, { totalAmount: newValue })
              "
            />
            /
            <DoubleClickEdit
              :value="loanableMaterial.wantedAmount"
              type="number"
              @submit="
                (newValue) =>
                  updateItem(loanableMaterial.id, { wantedAmount: newValue })
              "
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
