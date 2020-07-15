<template>
  <v-app class="register-form" id="inspire">
    <v-container>
      <v-layout wrap>
        <v-flex sm12 md6 offset-md3>
          <v-card elevation="4" light tag="section">
            <v-card-title>
              <v-layout align-center justify-space-between>
                <h3 class="headline">
                  Share a new <i class="fas fa-campground"></i>
                </h3>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form @submit.prevent="submitCampground">
                <div style="display:flex;">
                  <v-icon left>mdi-tent</v-icon>
                  <v-text-field
                    v-model="title"
                    :rules="titleRules"
                    label="Title"
                    required
                  ></v-text-field>
                </div>

                <div style="display:flex;">
                  <v-icon left>mdi-image</v-icon>
                  <v-text-field
                    v-model="image"
                    :rules="imageRules"
                    label="Image"
                    required
                  ></v-text-field>
                </div>

                <div style="display:flex;">
                  <v-icon left>mdi-currency-usd</v-icon>
                  <v-text-field
                    v-model="price"
                    :rules="priceRules"
                    label="Price/night"
                    type="number"
                    required
                  ></v-text-field>
                </div>

                <div style="display:flex;">
                  <v-icon left>mdi-map-marker</v-icon>
                  <v-text-field
                    v-model="address"
                    :rules="addressRules"
                    label="Address"
                    required
                  ></v-text-field>
                </div>

                <div style="display:flex;">
                  <v-textarea
                    v-model="description"
                    :rules="descriptionRules"
                    outlined
                    name="input-7-4"
                    label="Description"
                  ></v-textarea>
                </div>

                <div class="register-btn">
                  <v-btn
                    color="success"
                    type="submit"
                    :large="$vuetify.breakpoint.smAndUp"
                  >
                    Submit

                    <i class="fas fa-campground"></i>
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-0': $vuetify.breakpoint.smAndUp }">
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NewCampground',
  data: () => ({
    valid: true,
    title: '',
    titleRules: [(v) => !!v || 'Title is required'],
    image: '',
    imageRules: [(v) => !!v || 'Please provide an image URL'],
    price: '',
    priceRules: [(v) => !!v || 'Price is required'],
    address: '',
    addressRules: [(v) => !!v || 'Address is required'],
    description: '',
    descriptionRules: [(v) => !!v || 'Please provide a description'],
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async submitCampground() {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$store.state.User.token}`,
          },
        };
        const campground = {
          title: this.title,
          image: this.image,
          price: this.price,
          address: this.address,
          description: this.description,
          creator_id: this.$store.state.User.user.id,
        };
        console.log(campground);
        const res = await axios.post(
          `http://127.0.0.1:8000/api/campgrounds`,
          campground,
          config
        );
        console.log(res);
        this.$router.push('/');
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
  },
};
</script>

<style scoped>
.headline {
  margin: auto;
}
.register-btn {
  display: flex;
  justify-content: center;
}
a {
  text-decoration: none;
}
</style>
