<template>
  <div>Editing profile for user {{}}</div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProfile",
  data() {
    return {
      user: null,
      loading: true
    };
  },
  methods: {},
  async created() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const res = await axios.get(`http://127.0.0.1:8000/api/me`, config);
      this.user = res.data;
    } catch (error) {
      console.log(error.response.data);
    }
  }
};
</script>

<style>
</style>