<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInternalLink from '@/components/generic/StyledLink.vue'

export default defineComponent({
  components: { StyledInternalLink, StyledButton },
})
</script>

<template>
  <StyledButton>TEST</StyledButton>
  <div>
    text rond <StyledInternalLink to="/">TEST</StyledInternalLink> test achter
  </div>
</template>

<style scoped></style>
