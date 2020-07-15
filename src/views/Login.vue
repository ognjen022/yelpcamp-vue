<template>
  <v-app class="login-form" id="inspire">
    <v-container>
      <v-layout wrap>
        <v-flex sm12 md6 offset-md3>
          <v-card elevation="4" light tag="section">
            <v-card-title>
              <v-layout align-center justify-space-between>
                <h3 class="headline">
                  Log In to <i class="fas fa-campground"></i>YelpCamp
                </h3>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p style="text-align:center">
                Sign in with your email and password:
              </p>
              <v-alert v-if="error" dense outlined type="error">
                {{ error }}
              </v-alert>
              <v-form @submit.prevent="submitLogin">
                <div style="display:flex;">
                  <v-icon left>mdi-email</v-icon>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    required
                  ></v-text-field>
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
                <div class="login-btn">
                  <v-btn
                    color="info"
                    type="submit"
                    :large="$vuetify.breakpoint.smAndUp"
                  >
                    Login

                    <v-icon right>mdi-arrow-collapse-right</v-icon>
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-0': $vuetify.breakpoint.smAndUp }">
              <v-spacer></v-spacer>
            </v-card-actions>
            <div style="margin-left: 175px;">
              Don't have an account?
              <router-link to="/register">
                <v-btn color="info" text>
                  Register
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
  name: "Login",
  data: () => ({
    valid: true,
    email: "",
    error: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length > 6) || "Password must be at least 6 characters"
    ]
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
    async submitLogin() {
      const loginData = {
        password: this.password,
        email: this.email
      };
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/login`,
          loginData
        );
        const payload = {
          token: res.data.token,
          user: res.data.user[0]
        };
        this.$store.dispatch("login", payload);
        this.$router.push("/");
      } catch (err) {
        this.error = err.response.data.error;
        console.log(err.response.data.error);
        setTimeout(() => {
          this.error = "";
        }, 8000);
      }
    }
  }
};
</script>

<style scoped>
.login-form {
  margin-top: 30px;
}
.headline {
  margin: auto;
}
.login-btn {
  display: flex;
  justify-content: center;
}
a {
  text-decoration: none;
}
</style>
