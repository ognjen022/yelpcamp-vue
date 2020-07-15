<template>
  <v-footer padless>
    <v-card
      flat
      tile
      color="light-green accent-4"
      class="white--text text-center footer"
    >
      <v-divider></v-divider>

      <v-card-text class="white--text">
        <strong>YelpCamp &copy; <i class="fas fa-campground"></i> 2020</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data: () => ({}),
};
</script>

<style scoped>
.footer {
  width: 100vw;
  margin-top: auto;
}
</style>
