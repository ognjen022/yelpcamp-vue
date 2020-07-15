<template>
  <div class="text-center">
    <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <div
          style="margin-left: 5px; display: inline;"
          color="indigo"
          text
          right
          v-bind="attrs"
          v-on="on"
        >
          {{ user.name }}
        </div>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img :src="image" alt="John" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle
                >Member since
                {{ date }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <!-- <v-list-item-action>
              <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-list-item-action> -->
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'UserDialog',
  props: ['user', 'image'],
  data: () => ({
    date: null,
  }),
  created() {
    this.date = moment(this.user.created_at).format('MMMM Do YYYY');
  },
};
</script>

<style></style>
