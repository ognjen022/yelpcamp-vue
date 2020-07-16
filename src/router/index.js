import Vue from 'vue';
import VueRouter from 'vue-router';
import Campgrounds from '../views/Campgrounds.vue';
import Campground from '../views/Campground.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import NewCampground from '../views/NewCampground.vue';
import EditProfile from '../views/EditProfile.vue';
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Campgrounds',
    component: Campgrounds,
  },
  {
    path: '/campgrounds/new',
    name: 'NewCampground',
    component: NewCampground,
    beforeEnter: (to, from, next) => {
      if (to.name !== 'Login' && !store.state.User.user)
        next({ name: 'Login' });
      else next();
    },
  },
  {
    path: '/editprofile',
    name: 'EditProfile',
    component: EditProfile,
    beforeEnter: (to, from, next) => {
      if (to.name !== 'Login' && !store.state.User.user) {
        next({ name: 'Login' });
      } else {
        next();
      }
    },
  },
  {
    path: '/campgrounds/:id',
    name: 'Campground',
    component: Campground,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
