<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<template>
  <div
    class="px-5 flex items-center p-2 h-20 justify-between text-primary-text bg-primary-light"
  >
    <div class="flex justify-center items-center gap-2">
      <img src="../assets/Logo.svg" alt="logo" class="w-10 h-10" />
      <router-link to="/" class="font-bold text-4xl">Sportcomplex</router-link>
    </div>
    <div class="flex gap-2 font-medium">
      <div class="relative h-full">
        <router-link to="/" class="px-3 py-2 text-center peer"
          >Home</router-link
        >
        <span
          class="absolute -bottom-2 left-0 h-1 w-full origin-left scale-y-50 scale-x-0 duration-200 peer-hover:scale-x-100 peer-hover:bg-primary-text"
        ></span>
      </div>
      <div class="relative">
        <router-link to="/zwembad" class="px-3 py-2 text-center peer"
          >Zwembad</router-link
        >
        <span
          class="absolute -bottom-2 left-0 h-1 w-full origin-left scale-y-50 scale-x-0 duration-200 peer-hover:scale-x-100 peer-hover:bg-primary-text"
        ></span>
      </div>
      <div class="relative">
        <router-link to="/reseveringen" class="px-3 py-2 text-center peer"
          >Reserveringen</router-link
        >
        <span
          class="absolute -bottom-2 left-0 h-1 w-full origin-left scale-y-50 scale-x-0 duration-200 peer-hover:scale-x-100 peer-hover:bg-primary-text"
        ></span>
      </div>
      <div class="relative">
        <router-link to="/info" class="px-3 py-2 text-center peer"
          >Info</router-link
        >
        <span
          class="absolute -bottom-2 left-0 h-1 w-full origin-left scale-y-50 scale-x-0 duration-200 peer-hover:scale-x-100 peer-hover:bg-primary-text"
        ></span>
      </div>
      <div class="relative">
        <router-link to="/login" class="px-3 py-2 text-center peer"
          >Login</router-link
        >
        <span
          class="absolute -bottom-2 left-0 h-1 w-full origin-left scale-y-50 scale-x-0 duration-200 peer-hover:scale-x-100 peer-hover:bg-primary-text"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
