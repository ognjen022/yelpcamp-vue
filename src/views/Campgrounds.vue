<template>
  <div class="campgrounds-container">
    <v-card
      v-for="campground in campgrounds"
      :key="campground.id"
      class="my-12 campground"
      max-width="250"
    >
      <v-img height="150" :src="campground.image"></v-img>

      <v-card-title>{{ campground.title }}</v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            :value="calculateRating(campground)"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>

          <div class="grey--text ml-4">
            {{
              campground.ratings.length === 0
                ? 0
                : calculateRating(campground).toFixed(1)
            }}
            ({{ campground.ratings.length }})
          </div>
        </v-row>

        <div class="my-5">
          {{ campground.description.substring(0, 85) + '...' }}
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <router-link
          style="text-decoration: none; color: inherit; margin: 0 auto;"
          :to="'/campgrounds/' + campground.id"
        >
          <v-btn color="deep-purple lighten-2" class="center" text>
            More Info
          </v-btn>
        </router-link>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Campgrounds',
  components: {},
  data() {
    return {
      campgrounds: [],
    };
  },
  async created() {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/campgrounds`);
      console.log(res);
      this.campgrounds = res.data;
    } catch (err) {
      console.log(err.response.data.message);
    }
  },
  methods: {
    calculateRating(campground) {
      let totalRating = 0;
      campground.ratings.forEach((rating) => (totalRating += rating.value));
      totalRating = totalRating / campground.ratings.length;
      return totalRating;
    },
  },
};
</script>

<style>
.campgrounds-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: wrap;
  margin: 0 auto;
  padding-bottom: 60px;
}
.campground {
  box-shadow: 13px 13px 13px -4px rgba(0, 0, 0, 0.75);
  margin: 60px;
}
</style>
