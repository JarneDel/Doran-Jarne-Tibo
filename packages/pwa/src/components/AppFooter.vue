<script lang="ts">
import { defineComponent } from "vue";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-vue-next";

export default defineComponent({
  components: {
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div
    class="flex flex-col justify-around p-6 items-center md:items-start gap-8 md:flex-row min-h-[300px] bg-primary-light text-primary-text font-medium"
  >
    <div class="flex flex-col gap-2">
      <h2 class="font-bold text-3xl">Sportcomplex</h2>
      <div>
        <h3>StadWaregem</h3>
        <h3>Gemeenteplein 2</h3>
        <h3>8793 Waregem</h3>
      </div>
      <div>
        <a href="tel:056 62 12 11" class="flex gap-1">
          <Phone />
          <p class="underline">056 62 12 11</p>
        </a>
        <a href="mailto:info@waregem.be" class="flex gap-1">
          <Mail />
          <p class="underline">info@waregem.be</p>
        </a>
      </div>
      <div>
        <h3 class="">BE0207.433.708</h3>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <h2 class="font-bold text-xl">POPULAIRE PAGINA'S</h2>
      <div>
        <h3>Bestuur</h3>
        <h3>Melding indienen</h3>
        <h3>Werken en hinder</h3>
        <h3>Fecyclageparken</h3>
        <h3>Bedrijvengids</h3>
        <h3>Wachtdiensten</h3>
        <h3>Contacteer de pers</h3>
      </div>
    </div>
    <div class="flex flex-col items-center gap-2">
      <h2 class="font-bold text-xl">SOCIAL MEDIA</h2>
      <div class="flex gap-4">
        <Facebook height="36" width="36" />
        <Twitter height="36" width="36" />
        <Instagram height="36" width="36" />
        <Youtube height="36" width="36" />
        <Linkedin height="36" width="36" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
