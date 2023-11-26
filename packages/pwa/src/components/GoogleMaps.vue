<template>
  <div class="map-wrap">
    <a href="https://www.maptiler.com" class="watermark"
      ><img
        src="https://api.maptiler.com/resources/logo.svg"
        alt="MapTiler logo"
    /></a>
    <div class="map" ref="mapContainer"></div>
  </div>
</template>

<script lang="ts">
import { Map, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { shallowRef, onMounted, onUnmounted, markRaw, Ref } from 'vue';

export default {
  name: 'Map',
  setup() {
    const mapContainer: Ref<null | HTMLDivElement> = shallowRef(null);
    const map: Ref<null | Map> = shallowRef(null);
    const marker: Ref<null | Marker> = shallowRef(null);

    onMounted(() => {
      const apiKey: string = 'jaPuhNRUB7hEYzRUbckS';

      const initialState = {
        lng: 3.42991226849708,
        lat: 50.88505424353742,
        zoom: 14,
      };
      map.value = markRaw(
        new Map({
          container: mapContainer.value!,
          style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
          center: [initialState.lng, initialState.lat],
          zoom: initialState.zoom,
        })
      );

      marker.value = new Marker({ color: 'red' })
        .setLngLat([initialState.lng, initialState.lat])
        .setPopup(
          new Popup({ offset: 25 }) // add popups
            .setHTML(
              '<h3 class="text-primary-text font-bold text-xl">SportComplex</h3><a class="underline" href="https://www.google.com/maps/dir/50.9096009,3.411897/Sporthal+De+Treffer,+Meersstraat+5,+8790+Waregem/@50.8944852,3.4077865,14z/data=!4m10!4m9!1m1!4e1!1m5!1m1!1s0x47c315fc75c322f5:0xb318f33c483810a3!2m2!1d3.4299844!2d50.8848538!3e0?entry=ttu">Meersstraat 5, 8790</a>'
            )
        )
        .addTo(map.value!);
    });

    onUnmounted(() => {
      map.value?.remove();
    });

    return {
      map,
      mapContainer,
    };
  },
};
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  position: absolute;
  width: 100%;
  height: 120%;
}

.watermark {
  position: absolute;
  background-color: aquamarine;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}
</style>
