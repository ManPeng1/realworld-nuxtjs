<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.updatedAt | date("MMMM hh") }}</span>
    </div>
    <template v-if="user.username !== article.author.username">
      <button
        class="btn btn-sm"
        :disabled="followDisabled"
        :class="{
          'btn-outline-secondary': !article.author.following,
          'btn-secondary': article.author.following,
        }"
        @click="onFollow"
      >
        <i class="ion-plus-round"></i>
        &nbsp; Follow Eric Simons
      </button>
      &nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        :disabled="favoriteDisabled"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else>
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <button
        class="btn btn-outline-danger btn-sm"
        :disabled="isDeleting"
        @click="deleteArticle"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  deleteFavorite,
  addFavorite,
  deleteArticle,
} from "@/api/article";
import { addFollow, delFollow } from "@/api/user";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      favoriteDisabled: false,
      followDisabled: false,
      isDeleting: false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async onFavorite() {
      if (!this.user) {
        this.$router.push({
          name: "login",
        });
        return;
      }
      this.favoriteDisabled = true; // 禁用点击
      if (this.article.favorited) {
        // 取消点赞
        await deleteFavorite(this.article.slug);
        this.article.favorited = false;
        this.article.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFavorite(this.article.slug);
        this.article.favorited = true;
        this.article.favoritesCount += 1;
      }
      this.favoriteDisabled = false; // 允许点击
    },
    async onFollow() {
      if (!this.user) {
        this.$router.push({
          name: "login",
        });
        return;
      }
      this.followDisabled = true; // 禁用点击
      if (this.article.author.following) {
        // 取消关注
        await delFollow(this.article.author.username);
        this.article.author.following = false;
      } else {
        // 添加点赞
        await addFollow(this.article.author.username);
        this.article.author.following = true;
      }
      this.favoriteDisabled = false; // 允许点击
    },
    async deleteArticle() {
      if (!this.user) {
        this.$router.push({
          name: "login",
        });
        return;
      }
      this.isDeleting = true;
      if (this.isDeleting) {
        await deleteArticle(this.article.slug)
        this.$router.push('/')
      }
    },
  },
};
</script>
