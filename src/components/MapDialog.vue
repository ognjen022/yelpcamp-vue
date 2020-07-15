<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="blue" text v-bind="attrs" v-on="on">
          Show on Map
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Location of {{ title }}
        </v-card-title>

        <iframe
          className="maps-iframe"
          title="store-location"
          :src="`https://www.google.com/maps?q=${this.address}&output=embed`"
          width="500"
          height="500"
          frameBorder="0"
          style="border: 0"
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        ></iframe>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "MapDialog",
  props: ["title", "location"],
  data() {
    return {
      dialog: false,
      address: null
    };
  },
  created() {
    this.address = this.location.replace(" ", "+");
  }
};
</script>

<style scoped>
.text-center {
  display: initial;
}
</style>