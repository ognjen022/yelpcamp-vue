<template>
  <div>
    <div class="wrapper" v-if="!loading">
     
      <div class="card radius shadowDepth1">
        <div class="card__image border-tlr-radius">
          <img :src="campground.image" alt="image" class="border-tlr-radius" />
        </div>

        <div class="card__content card__padding">
          <div
            class="card_delete"
            v-if="
              this.$store.state.User.user &&
                campground.creator_id === this.$store.state.User.user.id
            "
          >
            <span
              @click.stop="dialog = true"
              id="delete"
              class="delete-toggle delete-icon"
              href="#"
            >
              <v-icon color="red" left>mdi-delete</v-icon>
            </span>
          </div>

          <div class="card__meta">
            <p>{{ date }}</p>
          </div>

          <div class="card__meta">
            <p></p>
          </div>

          <article class="card__article">
            <h2>
              {{ campground.title }}
              <MapDialog
                :title="campground.title"
                :location="campground.address"
              />
            </h2>

            <v-card-text>
              <v-row align="center" class="mx-0 my-4">
                <v-rating
                  :value="rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>

                <div class="grey--text ml-4">
                  {{ campground.ratings.length === 0 ? 0 : rating.toFixed(1) }}
                  ({{ campground.ratings.length }})
                </div>

                <div class="campground-price">
                  {{ campground.price }}$/night
                </div>
              </v-row>
            </v-card-text>

            <p>
              {{ campground.description }}
            </p>
          </article>
        </div>

        <div class="card__action">
          <div class="card__author">
            <img class="user_image" :src="campground.user.image" />
            <div class="card__author-content">
              <div style="display: flex;">
                Posted by
                <a style="cursor: pointer; display: inline;">
                  <UserDialog
                    :image="campground.user.image"
                    :user="campground.user"
                  />
                </a>
              </div>
            </div>
          </div>
          <v-btn
            @click="() => (this.showComments = !this.showComments)"
            class="ma-2 comments-btn"
            tile
            outlined
            color="primary"
          >
            <v-icon left>mdi-message-text</v-icon>
            {{ this.showComments ? "Hide" : "View" }} Comments
          </v-btn>
        </div>

        <v-card
          v-if="!alreadyRated && user"
          class="mx-auto"
          color="white"
          dark
          style="max-width: 400px; border:none; color:black;"
        >
          <v-card-actions class="pa-4">
            Rate this campground
            <v-spacer></v-spacer>
            <span class="text--lighten-2 caption mr-2">
              ({{ currentRating }})
            </span>
            <v-rating
              v-model="currentRating"
              background-color="white"
              color="yellow accent-4"
              dense
              half-increments
              hover
              size="18"
            ></v-rating>
            <v-btn icon color="blue" @click="rateCampground">
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <v-row justify="center">
        <v-dialog v-model="dialog" max-width="320">
          <v-card>
            <v-card-title style="text-align: center;" class="headline">
              Delete this campground?
            </v-card-title>

            <v-card-text style="text-align: center;">
              This action cannot be undone.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <div style="margin-right: 35%;">
                <v-btn
                  @click.stop="dialog = false"
                  style="margin-right: 10px;"
                  icon
                  color="red"
                >
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>

                <v-btn
                  @click="deleteCampground(campground.id)"
                  icon
                  color="green"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- Comments -->
      <div class="comment" v-if="showComments">
        <div
          class="my-4 comment-content"
          v-for="comment in campground.comments"
          :key="comment.id"
        >
          <div class="card__author comment-author">
            <img class="user_image" :src="comment.user.image" alt="user" />
            <span
              class="comment-date"
              v-if="comment.created_at !== comment.updated_at"
              >(edited)</span
            >
            <div class="card__author-content">
              <div style="display: flex;">
                <a style="cursor: pointer;">
                  <UserDialog
                    :image="comment.user.image"
                    :user="comment.user"
                  />
                </a>
              </div>
            </div>

            <span class="comment-date">{{
              commentDate(comment.created_at)
            }}</span>
            <div class="my-4 ml-10" v-if="isEditing !== comment.id">
              {{ comment.content }}
            </div>
            <div v-else>
              <form @submit.prevent="editComment(comment.id)">
                <v-text-field
                  v-model="currentEditingComment"
                  class="mt-3"
                  hide-details="auto"
                ></v-text-field>
              </form>
            </div>

            <div class="buttons-group">
              <div style="display:flex;">
                <v-btn
                  @click="unlikeComment(comment.id)"
                  v-if="!!didILikeThis(comment.id)"
                  :disabled="!isLoggedin"
                  :style="
                    user && user.id === comment.user.id
                      ? 'margin-left: 25px; background: #bde6ff; border: 1px solid lightblue; padding: 10px;'
                      : 'margin-bottom: 15px; margin-left: 25px; background: #bde6ff; border: 1px solid lightblue; padding: 10px;'
                  "
                  icon
                  color="blue"
                >
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>
                <v-btn
                  @click="likeComment(comment.id)"
                  :disabled="!isLoggedin"
                  v-else
                  style="margin-bottom: 15px; margin-left: 25px; border: 1px solid white; padding: 10px;"
                  icon
                  color="blue"
                >
                  <v-icon>mdi-thumb-up</v-icon>
                </v-btn>

                <span style="margin-left: 8px;" class="comment-date">{{
                  comment.likes.length
                }}</span>
              </div>

              <div v-if="user && user.id === comment.user.id">
                <v-btn
                  class="ma-2"
                  @click="startEditing(comment.id, comment.content)"
                  tile
                  outlined
                  color="warning"
                >
                  <v-icon left>mdi-pencil</v-icon> Edit
                </v-btn>
                <v-btn
                  class="ma-2"
                  @click="deleteComment(comment.id)"
                  tile
                  outlined
                  color="red"
                >
                  <v-icon left>mdi-delete</v-icon> Delete
                </v-btn>
              </div>
            </div>
          </div>
        </div>
        <form
          style="padding-bottom: 60px;"
          v-if="user"
          @submit.prevent="submitComment"
        >
          <v-text-field
            v-model="comment_input"
            class="mt-3"
            label="Add a comment"
            hide-details="auto"
          ></v-text-field>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapGetters } from "vuex";
import MapDialog from "../components/MapDialog";
import UserDialog from "../components/UserDialog";

export default {
  name: "Campground",
  components: {
    MapDialog,
    UserDialog
  },
  data() {
    return {
      dialog: false,
      isEditing: null,
      currentEditingComment: "",
      comment_input: "",
      campground: null,
      currentRating: 5,
      date: null,
      rating: 0,
      showComments: true,
      loading: true,
      alreadyRated: false,
      isLoggedin: false,
      rules: [
        value => !!value || "Required.",
        value => (value && value.length >= 3) || "Min 3 characters"
      ]
    };
  },
  async created() {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/campgrounds/${this.$route.params.id}`
    );
    this.loading = false;
    this.campground = res.data[0];
    this.date = moment(this.campground.created_at).format("MMMM Do YYYY");
    this.calculateRating();
    this.alreadyRated = this.didIRateThis();
    this.isLoggedin = this.$store.state.User.user ? true : false;
  },
  methods: {
    async deleteCampground(campgroundId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/campgrounds/${campgroundId}`,
          config
        );
        this.$router.push("/");
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    didILikeThis(commentId) {
      if (this.$store.state.User.user) {
        const comment = this.campground.comments.find(
          comment => comment.id === commentId
        );
        if (comment.likes.length > 0) {
          const like = comment.likes.find(
            like => like.user_id === this.$store.state.User.user.id
          );
          if (like) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    async likeComment(commentId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const like = {
        comment_id: commentId,
        user_id: this.$store.state.User.user.id
      };
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/comments/${commentId}/like`,
          like,
          config
        );
        const comment = this.campground.comments.find(
          comment => comment.id === commentId
        );
        const index = this.campground.comments.indexOf(comment);
        comment.likes.push(res.data);
        this.campground.comments[index] = comment;
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    async unlikeComment(commentId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const user = {
        user_id: this.$store.state.User.user.id
      };
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/comments/${commentId}/unlike`,
          user,
          config
        );
        const comment = this.campground.comments.find(
          comment => comment.id === commentId
        );
        const index = this.campground.comments.indexOf(comment);
        comment.likes = comment.likes.filter(like => like.id !== res.data.id);
        this.campground.comments[index] = comment;
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    async rateCampground() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const rating = {
        campground_id: this.campground.id,
        user_id: this.$store.state.User.user.id,
        value: this.currentRating
      };
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/campgrounds/rate",
          rating,
          config
        );
        this.campground.ratings.push(res.data);
        this.calculateRating();
        this.alreadyRated = true;
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    didIRateThis() {
      if (this.$store.state.User.user) {
        const rating = this.campground.ratings.find(
          rating => rating.user_id === this.$store.state.User.user.id
        );
        if (!rating) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    async submitComment() {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const comment = {
        content: this.comment_input,
        campground_id: this.$route.params.id,
        creator_id: this.$store.state.User.user.id
      };
      try {
        const res = await axios.post(
          `http://127.0.0.1:8000/api/comments`,
          comment,
          config
        );
        console.log(res.data);
        const newComment = {
          ...res.data,
          user: this.$store.state.User.user,
          likes: []
        };
        this.campground.comments.push(newComment);
        this.comment_input = "";
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    async deleteComment(commentId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      await axios.delete(
        `http://127.0.0.1:8000/api/comments/${commentId}`,
        config
      );
      this.campground.comments = this.campground.comments.filter(
        comment => comment.id !== commentId
      );
    },
    startEditing(commentId, content) {
      this.isEditing = commentId;
      this.currentEditingComment = content;
    },
    async editComment(commentId) {
      const config = {
        headers: {
          Authorization: `Bearer ${this.$store.state.User.token}`
        }
      };
      const editedComment = {
        content: this.currentEditingComment
      };
      try {
        const res = await axios.put(
          `http://127.0.0.1:8000/api/comments/${commentId}`,
          editedComment,
          config
        );
        console.log(res.data);
        this.isEditing = null;
        const comment = this.campground.comments.find(
          comment => comment.id === commentId
        );
        const newComment = {
          ...res.data,
          user: this.$store.state.User.user,
          likes: comment.likes
        };
        const index = this.campground.comments.indexOf(comment);
        this.campground.comments[index] = newComment;
      } catch (err) {
        console.log(err.response.data.message);
      }
    },
    commentDate(date) {
      return moment(date)
        .startOf("second")
        .fromNow();
    },
    calculateRating() {
      let totalRating = 0;
      this.campground.ratings.forEach(rating => (totalRating += rating.value));
      totalRating = totalRating / this.campground.ratings.length;
      this.rating = totalRating;
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
*,
*:after,
*:before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: #3498db;
}
a:hover {
  color: #2980b9;
}

h2 {
  line-height: 1.2;
  margin-bottom: 1.6rem;
}

.comment-content {
  border: 1px solid lightgray;
  border-radius: 25px;
}

.user_image {
  height: 45px;
  width: 45px;
}

.buttons-group {
  display: flex;
  justify-content: space-between;
}

.like-dislike-btn {
  margin-left: 30px;
}

.comment {
  max-width: 700px;
  /* box-shadow: 3px 1px 3px rgba(0, 0, 0, 0.12); */
}

.comment-author {
  margin-top: 10px;
  margin-left: 15px;
}

.comment-date {
  margin-top: 10px;
  margin-right: 15px;
  font-size: 0.9rem;
  color: rgb(168, 166, 166);
  float: right;
}

.wrapper {
  max-width: 700px;
  margin: 50px auto;
  padding-left: 1em;
  padding-right: 1em;
}

/**
 * Helpers
 */
.border-tlr-radius {
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.text-center {
  text-align: center;
}

.comments-btn {
  float: right;
}

.radius {
  border-radius: 2px;
}

.padding-tb {
  padding-top: 1.6rem;
  padding-bottom: 1.6rem;
}

.shadowDepth0 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.shadowDepth1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

/**
 * Card Styles
 */

.card {
  background-color: #fff;
  margin-bottom: 1.6rem;
}

.card__padding {
  padding: 1.6rem;
}

.campground-price {
  font-size: 0.9rem;
  color: rgb(168, 166, 166);
  margin-left: 347px;
}

.card__image {
  min-height: 100px;
  background-color: #eee;
}
.card__image img {
  width: 100%;
  max-width: 100%;
  display: block;
}

.card__content {
  position: relative;
}

/* card meta */
.card__meta p {
  font-size: 0.9rem;
  color: rgb(168, 166, 166);
  margin-left: 0.8rem;
  float: right;
}

/* card article */
.card__article a {
  text-decoration: none;
  color: #444;
  transition: all 0.5s ease;
}
.card__article a:hover {
  color: #2980b9;
}

/* card action */
.card__action {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding-right: 1.6rem;
  padding-left: 1.6rem;
  padding-bottom: 1.6rem;
}

.card__author img,
.card__author-content {
  display: inline-block;
  vertical-align: middle;
}

.card__author img {
  border-radius: 50%;
  margin-right: 0.6em;
}

.card__share {
  float: right;
  position: relative;
  margin-top: -42px;
}

.card_delete {
  float: right;
  position: relative;
  margin-top: -42px;
}

.card__social {
  position: absolute;
  top: 0;
  right: 0;
  visibility: hidden;
  width: 160px;
  transform: translateZ(0);
  transform: translateX(0px);
  transition: transform 0.35s ease;
}
.card__social--active {
  visibility: visible;
  /*z-index: 3;*/
  transform: translateZ(0);
  transform: translateX(-48px);
  transition: transform 0.35s ease;
}

.share-toggle {
  z-index: 2;
}
.share-toggle:before {
  content: "\f1e0";
  font-family: "FontAwesome";
  color: #3498db;
}
.share-toggle.share-expanded:before {
  content: "\f00d";
}

.share-icon {
  display: inline-block;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 50%;
  background-color: #fff;
  transition: all 0.3s ease;
  outline: 0;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24);
}
.share-icon:hover,
.share-icon:focus {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.24);

  -webkit-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -ms-transform: scale(1.2);
  -o-transform: scale(1.2);
  transform: scale(1.2);
}

.delete-toggle {
  z-index: 2;
}
.delete-toggle:before {
  font-family: "FontAwesome";
  color: #3498db;
}

.delete-icon {
  display: inline-block;
  width: 48px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-radius: 50%;
  background-color: #fff;
  transition: all 0.3s ease;
  outline: 0;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.24);
}
.delete-icon:hover,
.delete-icon:focus {
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.24);
  -webkit-transform: scale(1.2);
  -moz-transform: scale(1.2);
  -ms-transform: scale(1.2);
  -o-transform: scale(1.2);
  transform: scale(1.2);
}
</style>
