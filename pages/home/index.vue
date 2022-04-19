<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item" v-if="user">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'your_feed' }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed',
                      tag,
                    },
                  }"
                  exact
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'global-feed' }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global-feed',
                      tag,
                    },
                  }"
                  exact
                  >Global Feed</nuxt-link
                >
              </li>
              <li class="nav-item" v-if="tag">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'tag' }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    },
                  }"
                  exact
                >
                  # {{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="item in articles"
            :key="item.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: item.author.username,
                  },
                }"
              >
                <img :src="item.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: item.author.username,
                    },
                  }"
                >
                  {{ item.author.username }}
                </nuxt-link>
                <span class="date">{{
                  item.updatedAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: item.favorited }"
                :disabled="item.favoriteDisabled"
                @click="onFavorite(item)"
              >
                <i class="ion-heart"></i>{{ item.favoritesCount }}
              </button>
            </div>
            <a href="" class="preview-link"> </a>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: item.slug,
                },
              }"
            >
              <h1>{{ item.title }}</h1>
              <p>{{ item.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="item in item.tagList"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag,
                      tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag',
                  },
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
                >{{ item }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import {
  getArticles,
  getYourFeedArticles,
  deleteFavorite,
  addFavorite,
} from "@/api/article";
import { getTags } from "@/api/tag";
export default {
  name: "HomeIndex",
  async asyncData({ query, store }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 1;
    const { user } = store.state;
    const { tab } = query;
    const articlesLoad =
      user && tab === "your_feed" ? getYourFeedArticles : getArticles;
    const [articlesRes, tagRes] = await Promise.all([
      await articlesLoad({
        limit,
        offset: (page - 1) * limit,
        tag: query.tag
      }),
      await getTags(),
    ]);
    const { articles, articlesCount } = articlesRes.data;
    const { tags } = tagRes.data;
    console.log(query.tag);
    articles.forEach((article) => (article.favoriteDisabled = false));
    return {
      articles,
      articlesCount,
      page,
      limit,
      tags,
      tag: query.tag,
      tab: query.tab || "global-feed",
    };
  },
  watchQuery: ["page", "tag", "tab"],
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
      if (!this.user) {
        this.$router.push({
          name: "login",
        });
        return;
      }
      article.favoriteDisabled = true; // 禁用点击
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false; // 允许点击
    },
  },
};
</script>
