<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  required
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="tag"
                  @keyup="changeTag"
                />
                <div class="tag-list">
                  <span
                    v-for="(item, index) in article.tagList"
                    :key="item"
                    class="tag-default tag-pill ng-binding ng-scope"
                  >
                    <i class="ion-close-round" @click="removeTag(index)"></i>
                    {{ item }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createArticle, updateArticle, getArticle } from "@/api/article";
import { data } from "../../../../../fed-e-task-03-02/code/03-02-codes/vue/test/weex/cases/event/click.vue";
export default {
  middleware: ["authenticated"],
  name: "EditorIndex",
  async asyncData({ params }) {
    const { slug } = params;
    let article = {
      title: "",
      description: "",
      body: "",
      tagList: [],
    };
    if (slug) {
      const { data } = await getArticle(slug);
      article = data.article;
    }

    return {
      article,
    };
  },
  data() {
    return {
      tag: "",
    };
  },
  methods: {
    changeTag(e) {
      console.log(e.which);
      const key = e.which;
      if (key === 13 && this.tag && !this.article.tagList.includes(this.tag)) {
        this.article.tagList.push(this.tag);
        this.tag = "";
      }
    },
    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
    async onSubmit(e) {
      if (this.article.title.length === 0) {
        alert("title不能为空");
        return;
      } else if (this.article.description.length === 0) {
        alert("description不能为空");
        return;
      } else if (this.article.body.length === 0) {
        alert("body不能为空");
        return;
      }
      const slug = this.$route.params.slug;
      if (slug) {
        // 更新
        const { data } = await updateArticle(slug, { article: this.article });
        this.$router.push({
          name: "article",
          params: {
            slug: data.article.slug,
          },
        });
      } else {
        // 新建
        const { data } = await createArticle({ article: this.article });
        this.$router.push({
          name: "article",
          params: {
            slug: data.article.slug,
          },
        });
      }
    },
  },
};
</script>
