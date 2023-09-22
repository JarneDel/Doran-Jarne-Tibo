<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInternalLink from '@/components/generic/StyledLink.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'

export default defineComponent({
  components: { StyledInputText, StyledInternalLink, StyledButton },
})
</script>

<template>
  <StyledButton>TEST</StyledButton>
  <div>
    text rond <StyledInternalLink to="/">TEST</StyledInternalLink> test achter
  </div>
  <styled-input-text label="test" type="text" />
  <input type="date" />
</template>

<style scoped></style>
