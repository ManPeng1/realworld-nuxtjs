<template>
  <div>
    <form
        v-if="user"
        class="card comment-form" 
        @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="msg"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="item in comments" :key="item.id">
      <div class="card-block">
        <p class="card-text">
          {{ item.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: item.author.username,
            },
          }"
        >
          <img :src="item.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: item.author.username,
            },
          }"
        >
          {{ item.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ item.createdAt | date("MMMM hh") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getComments,addComment } from "@/api/article";
export default {
  name: "ArticleComment",
  data() {
    return {
      comments: [],
      msg: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  async mounted() {
    const { data } = await getComments(this.$route.params.slug);
    this.comments = data.comments;
  },
  methods: {
    async onSubmit() {
      console.log(this.msg);
      const params = {
        comment: {
          body: this.msg,
        },
      };
      const { data } = await addComment(this.$route.params.slug, params);
      console.log(data);
      this.comments.push(data.comment)
    },
  },
};
</script>
