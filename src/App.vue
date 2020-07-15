<template>
  <v-app class="v-application--wrap">
    <Navbar />
    <router-view></router-view>
    <!-- <Footer /> -->
  </v-app>
</template>

<script>
import Navbar from './components/Navbar';
// import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Navbar,
    // Footer,
  },
  data: () => ({}),
};
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=Roboto:700,400';

.v-application--wrap {
  min-height: 100%;
}
html,
body {
  height: 100%;
  min-height: 100%;
  width: 100%;
  margin: 0;
}
* {
  font-family: Roboto;
}
</style>
