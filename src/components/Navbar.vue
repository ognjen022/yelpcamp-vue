<template>
  <v-app>
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        color="light-green accent-4"
        class="navbar"
        elevate-on-scroll
      >
        <router-link style="color: white; margin-left: 30px;" to="/">
          <v-toolbar-title>
            <i class="fas fa-campground"></i>YelpCamp
          </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <div v-if="!user">
          <router-link to="/register">
            <v-btn class="ma-2" color="white" text small
              >Register
              <v-icon dark right>mdi-account-plus</v-icon>
            </v-btn>
          </router-link>

          <router-link to="/login">
            <v-btn class="ma-2" color="white" text small
              >Login
              <v-icon dark right>mdi-account-lock</v-icon>
            </v-btn>
          </router-link>
        </div>

        <div v-else class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="white" text small v-bind="attrs" v-on="on">
                <img class="user-avatar" :src="user.image" />
                {{ user.name.split(" ")[0] }}
                <v-icon dark right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <router-link to="/campgrounds/new">
                  <v-btn class="ma-2" color="green" text small>
                    Share a Campground<i class="fas fa-campground"></i>
                  </v-btn>
                </router-link>
              </v-list-item>
              <v-list-item>
                <router-link :to="`/editprofile`">
                  <v-btn class="ma-2" color="green" text small>
                    Edit Profile<v-icon dark right>mdi-account</v-icon>
                  </v-btn>
                </router-link>
              </v-list-item>
              <v-list-item>
                <v-btn class="ma-2" @click="logout" color="green" text small>
                  Logout<v-icon dark right>mdi-logout-variant</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-sheet max-height="600">
        <v-container style="height: 64px;"> </v-container>
      </v-sheet>
    </v-card>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Navbar",
  data() {
    return {};
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    }
  },
  computed: {
    ...mapGetters({
      user: "user"
    })
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}
@media (max-width: 500px) {
  .navbar {
    height: 64px;
  }
}

.user-avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
