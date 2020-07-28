<template>
  <div
    v-if="!loading"
    id="settings"
    style="margin: 20px auto;"
    ontouchstart="true"
  >
    <input class="nav" checked="true" type="radio" name="nav" />
    <span class="nav">
      Edit Your Profile
    </span>
    <main class="content" style="height: 350px;">
      <section id="profile">
        <form @submit.prevent="submitForm">
          <ul>
            <li class="large padding avatar">
              <img
                style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;"
                :src="image"
              />
              <div>
                <fieldset class="material-checkbox">
                  <div>
                    <input
                      type="checkbox"
                      @change="changeUseAvatar"
                      v-model="useAvatar"
                      checked="true"
                    />
                    <div class="check">
                      <span>
                        <svg viewBox="0 0 24 24">
                          <g>
                            <line
                              x1="4.5"
                              x2="9.24"
                              y1="12.5"
                              y2="17.24"
                            ></line>
                            <line
                              x1="9.24"
                              x2="19.76"
                              y1="17.24"
                              y2="6.73"
                            ></line>
                          </g>
                          <g>
                            <line
                              x1="4.5"
                              x2="9.24"
                              y1="12.5"
                              y2="17.24"
                            ></line>
                            <line
                              x1="9.24"
                              x2="19.76"
                              y1="17.24"
                              y2="6.73"
                            ></line>
                          </g>
                        </svg>
                      </span>
                      <label>Use Avatar</label>
                    </div>
                  </div>
                </fieldset>
                <fieldset class="material-button">
                  <div style="display: flex; align-items: center;">
                    <v-file-input
                      style="width: 10%;"
                      name="photo"
                      id="fileInput"
                      accept="image/*"
                      hide-input
                      prepend-icon="mdi-camera"
                      color="green"
                      :disabled="!useAvatar"
                      @change="inputImage"
                    ></v-file-input>
                    <span style="margin-top: 12px;"
                      >Change Profile Picture</span
                    >
                  </div>
                </fieldset>
              </div>
            </li>
            <li>
              <fieldset class="material">
                <div>
                  <input type="text" v-model="name" />
                  <label>Name</label>
                  <hr />
                </div>
              </fieldset>
            </li>
            <li>
              <fieldset class="material">
                <div>
                  <input type="password" v-model="password" />
                  <label>Old Password</label>
                  <hr />
                </div>
              </fieldset>
            </li>
            <li>
              <fieldset class="material">
                <div>
                  <input type="text" v-model="email" />
                  <label>Email</label>
                  <hr />
                </div>
              </fieldset>
            </li>
            <li>
              <fieldset class="material">
                <div>
                  <input type="password" v-model="newPassword" />
                  <label>New Password</label>
                  <hr />
                </div>
              </fieldset>
            </li>
            <li class="large padding" style="height: 30px">
              <fieldset class="material-button center">
                <div>
                  <input
                    class="save"
                    style="border-radius: 20px; margin-top: 10px;"
                    type="submit"
                    value="Save"
                  />
                </div>
              </fieldset>
              <p
                style="color: red; text-align: center; margin-top: 10px; margin-bottom: 10px;"
              >
                {{ error }}
              </p>
            </li>
          </ul>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditProfile",
  data() {
    return {
      user: null,
      loading: true,
      name: "",
      email: "",
      password: "",
      useAvatar: true,
      newPassword: "",
      error: "",
      image: ""
    };
  },
  methods: {
    inputImage() {
      const file = document.getElementById("fileInput").files[0];
      const reader = new FileReader();
      reader.onload = e => (this.image = e.target.result);
      reader.readAsDataURL(file);
    },
    changeUseAvatar() {
      this.image = this.useAvatar
        ? this.user.image
        : "https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif";
    },
    async submitForm() {
      if (
        this.useAvatar === true &&
        this.image ===
          "https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif"
      ) {
        this.error = "Please choose an avatar";
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${this.$store.state.User.token}`
          }
        };
        const profile = {
          name: this.name,
          email: this.email,
          image: this.image,
          password: this.password,
          newPassword: this.newPassword
        };
        const res = await axios.put(
          `${process.env.VUE_APP_API_URL}/api/users/${this.$store.state.User.user.id}`,
          profile,
          config
        );
        this.$store.state.User.user = res.data;
        this.$router.push("/");
      } catch (err) {
        this.error = "Old password is incorrect";
        console.log(err.response.data);
      }
    }
  },
  async created() {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const res = await axios.get(
        `${process.env.VUE_APP_API_URL}/api/me`,
        config
      );
      this.user = res.data.user;
      this.email = res.data.user.email;
      this.name = res.data.user.name;
      this.image = res.data.user.image;
      if (
        this.image ===
        "https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif"
      ) {
        this.useAvatar = false;
      }
      this.loading = false;
    } catch (error) {
      console.log(error.response.data);
    }
  }
};
</script>

<style scoped>
.edit-profile {
  margin: 15px auto;
  background: rgb(245, 242, 242);
  padding: 30px 60px;
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
*,
*:before,
*:after {
  box-sizing: border-box;
}
* {
  border: none !important;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transform-style: preserve-3d;
}
*:focus {
  outline: none !important;
}
body,
html {
  height: 100%;
}
body {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  padding: 12px;
  background: #64dd11;
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='$mauve', endColorstr='$blush',GradientType=1);
  font-family: "brandon-grotesque", "Brandon Grotesque", "Source Sans Pro",
    "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue",
    Arial, sans-serif;
  font-size: 16px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  perspective: 1000px;
}
li {
  text-decoration: none !important;
}
input,
textarea,
button {
  appearance: none;
  box-shadow: none;

  font-family: "brandon-grotesque", "Brandon Grotesque", "Source Sans Pro",
    "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue",
    Arial, sans-serif;
  resize: none;
}
input {
  border: 0;
  outline: 0;
}
input:focus {
  outline: none !important;
}

a,
button,
input[type="submit"] {
  cursor: pointer;
}
::selection {
  background: rgba(205, 144, 139, 0.2);
}
#settings {
  opacity: 0;
  transform-origin: center top;
  will-change: opacity, transform;
  animation: rotateIn 500ms cubic-bezier(0.215, 0.61, 0.355, 1) 500ms forwards;
  position: relative;
  display: flex;
  flex-flow: row wrap;
  background: white;
  box-shadow: 0 0 20px rgba(21, 21, 29, 0.2);
  overflow: hidden;
  color: #3f4159;
  border-radius: 2px;
  width: 100%;
  max-width: 600px;
  height: 100%;
}
@media only screen and (min-width: 500px) {
  #settings {
    max-height: 420px;
  }
}
span.nav {
  transition: all 150ms ease-out;
  display: block;
  position: relative;
  width: 100%;
  padding: 18px 0;
  text-align: center;
}
span.nav:nth-of-type(1) {
  z-index: 5;
}
span.nav:nth-of-type(2) {
  z-index: 4;
}
span.nav:nth-of-type(3) {
  z-index: 3;
}
span.nav:nth-of-type(4) {
  z-index: 2;
}
span.nav:nth-of-type(5) {
  z-index: 1;
}
span.nav:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: -1px;
  width: 2px;
  height: 100%;
  background: #f3e3e2;
}
span.nav:last-of-type:after {
  display: none;
}
input.nav {
  cursor: pointer;
  appearance: none;
  opacity: 0;
  position: absolute;
  z-index: 6;
  top: 0;
  width: 25%;
  height: 53px;
}
input.nav:hover + span,
input.nav:focus + span {
  background: #f3e3e2;
}
input.nav:active + span,
input.nav:checked + span {
  background: #64dd11;
  color: white;
}
input.nav:active + span {
  transition: all 150ms ease-in;
}
input.nav ~ main section {
  transition: all 450ms ease-out;
  transform: translateY(50%) translateZ(0);
  opacity: 0;
  z-index: -1;
}
input.nav:nth-of-type(1) {
  left: 0%;
}
input.nav:nth-of-type(1):checked ~ main section:nth-of-type(1) {
  transform: translateY(0) translateZ(0);
  opacity: 1;
  z-index: 10;
}
input.nav:nth-of-type(2) {
  left: 25%;
}
input.nav:nth-of-type(2):checked ~ main section:nth-of-type(2) {
  transform: translateY(0) translateZ(0);
  opacity: 1;
  z-index: 10;
}
input.nav:nth-of-type(3) {
  left: 50%;
}
input.nav:nth-of-type(3):checked ~ main section:nth-of-type(3) {
  transform: translateY(0) translateZ(0);
  opacity: 1;
  z-index: 10;
}
input.nav:nth-of-type(4) {
  left: 75%;
}
input.nav:nth-of-type(4):checked ~ main section:nth-of-type(4) {
  transform: translateY(0) translateZ(0);
  opacity: 1;
  z-index: 10;
}
input.nav:nth-of-type(5) {
  left: 100%;
}
input.nav:nth-of-type(5):checked ~ main section:nth-of-type(5) {
  transform: translateY(0) translateZ(0);
  opacity: 1;
  z-index: 10;
}
main {
  align-self: flex-end;
  position: relative;
  border-top: 2px solid #f3e3e2;
  width: 100%;
  height: calc(100% - 52px);
}
section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  will-change: transform, opacity;
}
section ul {
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  padding: 12px;
}
section ul li {
  opacity: 0;
  transform: translateY(100%) translateZ(0);
  will-change: transform, opacity;
  animation: slideInUp 300ms cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  padding: 6px 12px;
  width: 50%;
}
section ul li:nth-child(1) {
  animation-delay: 700ms;
}
section ul li:nth-child(2) {
  animation-delay: 800ms;
}
section ul li:nth-child(3) {
  animation-delay: 900ms;
}
section ul li:nth-child(4) {
  animation-delay: 1000ms;
}
section ul li:nth-child(5) {
  animation-delay: 1100ms;
}
section ul li:nth-child(6) {
  animation-delay: 1200ms;
}
section ul li:nth-child(7) {
  animation-delay: 1300ms;
}
section ul li.large {
  width: 100%;
}
section ul li.padding {
  padding: 12px;
}
section.upcoming {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  text-align: center;
}
section.upcoming h1 {
  font-size: 32px;
  color: #ccc;
}
.avatar {
  display: flex;
}
.avatar > span {
  display: block;
  width: 72px;
  height: 72px;
  background-position: center center;
  background-size: cover;
  border-radius: 2px;
}
.avatar > div {
  padding-left: 24px;
}
.avatar > div .material-button {
  margin-top: 13px;
}
.material {
  width: 100%;
}
.material div {
  position: relative;
  width: 100%;
  padding-top: 18px;
}
.material label {
  transition: all 150ms ease-out;
  will-change: transform;
  transform: translateZ(0);
  display: block;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 4px;
  font-weight: 500;
  color: #64dd11;
  line-height: 1.5;
}
.material hr {
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  border: 0;
  border-radius: 4px;
  margin: 0;
  background: #ebebeb;
}
.material hr:after {
  transition: all 150ms ease-out;
  transform: scaleX(0) translateZ(0);
  transform-origin: left top;
  will-change: transform;
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  background: #64dd11;
}
.material input {
  display: block;
  appearance: none;
  position: relative;
  z-index: 1;
  padding: 0 0 4px;
  margin: 0;
  width: 100%;
  background: none;
  color: #3f4159;
  font-size: 16px;
  line-height: 1.5;
}
.material input:focus + label,
.material input:valid + label {
  transform: translateY(-24px) translateZ(0);
  font-size: 12px;
}
.material input:focus ~ hr:after {
  transform: scaleX(1) translateZ(0);
}
.material-checkbox div {
  position: relative;
}
.material-checkbox .check {
  z-index: 0;
  display: flex;
  align-items: center;
  align-content: center;
}
.material-checkbox span {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  background: #ebebeb;
}
.material-checkbox svg {
  display: block;
  width: 100%;
  height: 100%;
}
.material-checkbox line {
  fill: none;
  stroke: rgba(255, 255, 255, 0.5);
  stroke-width: 2px;
  stroke-linecap: round;
}
.material-checkbox g:last-child line {
  stroke: white;
  opacity: 0;
}
.material-checkbox g:last-child line:first-child {
  transition: stroke-dashoffset 100ms ease-out;
  stroke-dasharray: 6.708;
  stroke-dashoffset: 6.708;
}
.material-checkbox g:last-child line:last-child {
  transition: stroke-dashoffset 200ms ease-out 100ms;
  stroke-dasharray: 14.873;
  stroke-dashoffset: 14.873;
}
.material-checkbox label {
  margin-left: 6px;
}
.material-checkbox input {
  cursor: pointer;
  opacity: 0;
  appearance: none;
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.material-checkbox input:checked + div span {
  background: #64dd11;
}
.material-checkbox input:checked + div g:last-child line {
  opacity: 1;
}
.material-checkbox input:checked + div g:last-child line:first-child {
  stroke-dashoffset: 0;
}
.material-checkbox input:checked + div g:last-child line:last-child {
  stroke-dashoffset: 0;
}
.material-button {
  width: 100%;
}
.material-button div {
  width: 100%;
}
.material-button button,
.material-button input[type="submit"] {
  margin: 0;
  border: 0;
  border-radius: 2px;
  padding: 6px 12px;
  background: #ebebeb;
  color: #3f4159;
  font-size: 16px;
  transition: all 150ms ease-out;
}
.material-button button:hover,
.material-button input[type="submit"]:hover,
.material-button button:focus,
.material-button input[type="submit"]:focus {
  background: #64dd11;
  color: white;
}
.material-button button:active,
.material-button input[type="submit"]:active {
  transition: all 150ms ease-in;
  background: #3f4159;
}

button:disabled,
button[disabled] {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}

button:disabled,
button[disabled]:hover {
  cursor: default;
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}

.material-button button.save,
.material-button input[type="submit"].save {
  width: 100px;
  max-width: 256px;
  padding: 10px 12px;
  background: #64dd11;
  color: white;
  font-size: 18px;
}
.material-button button.save:hover,
.material-button input[type="submit"].save:hover,
.material-button button.save:focus,
.material-button input[type="submit"].save:focus {
  background: #53c218;
}
.material-button button.save:active,
.material-button input[type="submit"].save:active {
  background: #3f4159;
}

.material-button button.connect,
.material-button input[type="submit"].connect {
  display: block;
  width: 100%;
  border-radius: 1000px;
  color: white;
}
.material-button button.gh,
.material-button input[type="submit"].gh {
  background: #4183c4;
}
.material-button button.gh:hover,
.material-button input[type="submit"].gh:hover,
.material-button button.gh:focus,
.material-button input[type="submit"].gh:focus {
  background: #7ba9d6;
}
.material-button button.gh.connected,
.material-button input[type="submit"].gh.connected {
  background: #ebebeb;
  color: #343434;
}
.material-button button.gh.connected:hover,
.material-button input[type="submit"].gh.connected:hover,
.material-button button.gh.connected:focus,
.material-button input[type="submit"].gh.connected:focus {
  background: #4183c4;
  color: white;
}
.material-button button.gh:active,
.material-button input[type="submit"].gh:active {
  background: #2c5d8d !important;
}
.material-button button.tw,
.material-button input[type="submit"].tw {
  background: #2daae1;
}
.material-button button.tw:hover,
.material-button input[type="submit"].tw:hover,
.material-button button.tw:focus,
.material-button input[type="submit"].tw:focus {
  background: #70c5eb;
}
.material-button button.tw.connected,
.material-button input[type="submit"].tw.connected {
  background: #ebebeb;
  color: #343434;
}
.material-button button.tw.connected:hover,
.material-button input[type="submit"].tw.connected:hover,
.material-button button.tw.connected:focus,
.material-button input[type="submit"].tw.connected:focus {
  background: #2daae1;
  color: white;
}
.material-button button.tw:active,
.material-button input[type="submit"].tw:active {
  background: #187da9 !important;
}
.material-button button.fb,
.material-button input[type="submit"].fb {
  background: #3b5997;
}
.material-button button.fb:hover,
.material-button input[type="submit"].fb:hover,
.material-button button.fb:focus,
.material-button input[type="submit"].fb:focus {
  background: #5e7ec0;
}
.material-button button.fb.connected,
.material-button input[type="submit"].fb.connected {
  background: #ebebeb;
  color: #343434;
}
.material-button button.fb.connected:hover,
.material-button input[type="submit"].fb.connected:hover,
.material-button button.fb.connected:focus,
.material-button input[type="submit"].fb.connected:focus {
  background: #3b5997;
  color: white;
}
.material-button button.fb:active,
.material-button input[type="submit"].fb:active {
  background: #263960 !important;
}
.material-button button.li,
.material-button input[type="submit"].li {
  background: #069;
}
.material-button button.li:hover,
.material-button input[type="submit"].li:hover,
.material-button button.li:focus,
.material-button input[type="submit"].li:focus {
  background: #0099e6;
}
.material-button button.li.connected,
.material-button input[type="submit"].li.connected {
  background: #ebebeb;
  color: #343434;
}
.material-button button.li.connected:hover,
.material-button input[type="submit"].li.connected:hover,
.material-button button.li.connected:focus,
.material-button input[type="submit"].li.connected:focus {
  background: #069;
  color: white;
}
.material-button button.li:active,
.material-button input[type="submit"].li:active {
  background: #00334d !important;
}
.material-button.center div {
  display: flex;
  justify-content: center;
}
@keyframes rotateIn {
  0% {
    opacity: 0;
    transform: rotateX(30deg) rotateY(30deg) translateY(300px) translateZ(200px);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(100%) translateZ(0);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}
</style>