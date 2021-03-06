<template>
  <div>
    <v-text-field
      v-model="search"
      label="Search Campgrounds"
      style="width: 250px; margin: 10px auto;"
      color="green"
    >
      <v-icon slot="prepend" color="green">
        mdi-magnify
      </v-icon>
    </v-text-field>
    <div class="campgrounds-container" v-if="!loading">
      <v-card
        v-for="campground in filteredList"
        :key="campground.id"
        class="my-5 campground"
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
            {{ campground.description.substring(0, 85) + "..." }}
          </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>
        <v-card-actions>
          <router-link
            style="text-decoration: none; color: inherit; margin: 0 auto;"
            :to="'/campgrounds/' + campground.id"
          >
            <v-btn color="success" class="center" text>
              More Info
            </v-btn>
          </router-link>
        </v-card-actions>
      </v-card>
    </div>
    <div class="loader" v-else>
      <div class="pa-3">
        <v-progress-circular
          color="green"
          indeterminate
          :size="64"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Campgrounds",
  components: {},
  data() {
    return {
      search: "",
      loading: true,
      campgrounds: []
    };
  },
  async created() {
    try {
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/api/campgrounds`
      );
      this.campgrounds = res.data;
      this.loading = false;
    } catch (err) {
      console.log(err.response.data.message);
    }
  },
  methods: {
    calculateRating(campground) {
      let totalRating = 0;
      campground.ratings.forEach(rating => (totalRating += rating.value));
      totalRating = totalRating / campground.ratings.length;
      return totalRating;
    }
  },
  computed: {
    filteredList() {
      return this.campgrounds.filter(campground => {
        return campground.title
          .toLowerCase()
          .includes(this.search.toLowerCase());
      });
    }
  }
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
@media (max-width: 500px) {
  .campgrounds-container {
    display: initial;
  }
  .campground {
    margin: 0 auto;
  }
}
.campground {
  box-shadow: 13px 13px 13px -4px rgba(0, 0, 0, 0.75);
  margin: 60px;
}
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
