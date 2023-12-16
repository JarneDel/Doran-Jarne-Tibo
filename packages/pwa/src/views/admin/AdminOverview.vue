<script lang="ts">
import { computed, defineComponent } from 'vue'
import useUser from '@/composables/useUser.ts'
import useNavigation from '@/composables/useNavigation.ts'
import Card from '@/components/layout/Card.vue'
import CardContainer from '@/components/layout/CardContainer.vue'

export default defineComponent({
  name: 'AdminOverview',
  components: { CardContainer, Card },
  setup() {
    const { customUser } = useUser()
    const role = computed(() => customUser.value?.role)

    const { pages } = useNavigation()

    return {
      customUser,
      pages: computed(() =>
        pages.value.filter(page => page.roles.includes(role.value ?? '')),
      ),
    }
  },
})
</script>

<template>
  <div class="mx-a mt-20 max-w-7xl">
    <h1 class="mb-8 text-3xl font-bold">Admin Overview</h1>
    <CardContainer>
      <li v-for="page of pages">
        <RouterLink :to="page.route">
          <Card hoverable>
            <h2 class="flex flex-row gap-4">
              <component :is="page.icon" />
              {{ page.name }}
              <span v-if="page.count" class="badge">{{ page.count }}</span>
            </h2>
          </Card>
        </RouterLink>
      </li>
    </CardContainer>
  </div>
</template>

<style scoped>
li {
  list-style: none;
}
.badge {
  background-color: #f00;
  border-radius: 50%;
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}
</style>
