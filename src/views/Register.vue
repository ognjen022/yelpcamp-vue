<template>
  <v-app class="register-form" id="inspire">
    <v-container>
      <v-layout wrap>
        <v-flex sm12 md6 offset-md3>
          <v-card elevation="4" light tag="section">
            <v-card-title>
              <v-layout align-center justify-space-between>
                <h3 class="headline">
                  Register on <i class="fas fa-campground"></i>YelpCamp
                </h3>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p style="text-align:center">
                Fill in all the fields below to join:
              </p>
              <v-form @submit.prevent="submitRegister">
                <div style="display:flex;">
                  <v-icon left>mdi-account-circle</v-icon>
                  <v-text-field
                    v-model="name"
                    :rules="nameRules"
                    label="Name"
                    required
                  ></v-text-field>
                </div>

                <div style="display:flex;">
                  <v-icon left>mdi-email</v-icon>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
                </div>

                <div style="margin-left: 40%;">
                  <label for="fileInput" type="button" class="">
                    <svg
                      v-if="image === ''"
                      xmlns="http://www.w3.org/2000/svg"
                      class="inline-flex flex-shrink-0 w-6 h-6 -mt-1 mr-1"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                        stroke="none"
                      ></rect>
                      <path
                        d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"
                      />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                    <div v-else>
                      <img class="image-preview" :src="image" alt="" />
                    </div>
                    <p class="text-align: center;">Browse Photo</p>
                  </label>

                  <div style="margin-right: 240px; text-align: center;">
                    Click to add profile picture (optional)
                  </div>

                  <input
                    name="photo"
                    id="fileInput"
                    accept="image/*"
                    class="hidden"
                    style="display: none;"
                    type="file"
                    @change="inputImage"
                  />
                </div>

                <div style="display:flex;">
                  <v-icon left>mdi-lock</v-icon>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    required
                    type="password"
                  ></v-text-field>
                </div>

                <div style="display:flex;">
                  <v-icon left>mdi-lock-outline</v-icon>
                  <v-text-field
                    v-model="confirmPassword"
                    :rules="[
                      password === confirmPassword || 'Passwords do not match'
                    ]"
                    label="Confirm Password"
                    required
                    type="password"
                  ></v-text-field>
                </div>

                <div class="register-btn">
                  <v-btn
                    color="info"
                    type="submit"
                    :large="$vuetify.breakpoint.smAndUp"
                  >
                    Register

                    <v-icon right>mdi-account-plus</v-icon>
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-0': $vuetify.breakpoint.smAndUp }">
              <v-spacer></v-spacer>
            </v-card-actions>
            <div style="margin-left: 175px;">
              Already have an account?
              <router-link to="/login">
                <v-btn color="info" text>
                  Log In
                </v-btn>
              </router-link>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "Register",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [v => !!v || "Name is required"],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length > 6) || "Password must be at least 6 characters"
    ],
    confirmPassword: "",
    confirmPasswordRules: [v => !!v || "Please confirm your password"],
    image: ""
  }),
  methods: {
    inputImage() {
      const file = document.getElementById("fileInput").files[0];
      const reader = new FileReader();
      reader.onload = e => (this.image = e.target.result);
      reader.readAsDataURL(file);
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async submitRegister() {
      try {
        const registerData = {
          name: this.name,
          password: this.password,
          password_confirmation: this.confirmPassword,
          email: this.email,
          image: this.image
        };
        console.log(registerData);
        const res = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/register`,
          registerData
        );
        this.$store.dispatch("register", res.data);
        this.$router.push("/");
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.confirmPassword || "Password must match";
    }
  }
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

.image-preview {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
