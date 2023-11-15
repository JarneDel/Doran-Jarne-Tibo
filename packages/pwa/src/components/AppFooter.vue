<script lang="ts">
import { defineComponent } from 'vue';
import {
  Phone,
  Mail,
  FacebookIcon,
  TwitchIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
} from 'lucide-vue-next';

export default defineComponent({
  components: {
    Phone,
    Mail,
    FacebookIcon,
    TwitchIcon,
    InstagramIcon,
    YoutubeIcon,
    LinkedinIcon,
  },
});
</script>

<template>
  <div
    class="flex flex-col items-center text-center p-4 pb-8 gap-10 md:flex-row md:justify-around md:items-start md:text-start md:py-6 bg-primary-medium bg text-white"
  >
    <div class="flex flex-col gap-3">
      <h3 class="text-3xl font-bold">Sportcomplex</h3>
      <div class="flex flex-col">
        <p>Stad Waregem</p>
        <p>Gemeenteplein 2</p>
        <p>8793 Waregem</p>
      </div>
      <div>
        <a
          class="flex justify-center md:justify-start gap-2"
          href="tel:+056621211"
        >
          <Phone />
          <u>056 62 12 11</u></a
        >
        <a
          href="mailto:info@waregem.be"
          class="flex justify-center md:justify-start gap-2"
        >
          <Mail />
          <u>info@waregem.be</u>
        </a>
      </div>
      <p>BE0207.433.708</p>
    </div>
    <div class="flex flex-col gap-3">
      <h3 class="text-xl font-bold">POPULAIRE PAGINA'S</h3>
      <div class="flex flex-col">
        <p>Stad Waregem</p>
        <p>Gemeenteplein 2</p>
        <p>8793 Waregem</p>
      </div>
    </div>
    <div class="flex flex-col gap-3 text-center">
      <h3 class="text-xl font-bold">SOCIALS</h3>
      <div class="flex gap-2">
        <a href="http://www.facebook.com" target="_blank">
          <FacebookIcon />
        </a>
        <a href="http://www.twitch.com" target="_blank">
          <TwitchIcon />
        </a>
        <a href="http://www.instagram.com" target="_blank">
          <InstagramIcon />
        </a>
        <a href="http://www.youtube.com" target="_blank">
          <YoutubeIcon />
        </a>
        <a href="http://www.linkedin.com" target="_blank">
          <LinkedinIcon />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
