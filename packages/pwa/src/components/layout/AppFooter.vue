<script lang="ts">
import { defineComponent } from 'vue'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  Mail,
  Phone,
  TwitchIcon,
  YoutubeIcon,
} from 'lucide-vue-next'

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
})
</script>

<template>
  <footer
    class="bg-primary-medium bg flex flex-col items-center gap-10 p-4 pb-8 text-center text-white md:flex-row md:items-start md:justify-around md:py-6 md:text-start"
  >
    <div class="flex flex-col gap-3">
      <h3 class="text-3xl font-bold">Sportcomplex</h3>
      <div class="flex flex-col">
        <p>Stad Waregem</p>
        <p>Meersstraat 5</p>
        <p>8790 Waregem</p>
      </div>
      <div>
        <a
          class="flex justify-center gap-2 md:justify-start"
          href="tel:+056621211"
        >
          <Phone />
          <u>056 62 12 11</u></a
        >
        <a
          href="mailto:info@waregem.be"
          class="flex justify-center gap-2 md:justify-start"
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
  </footer>
</template>

<style scoped></style>
