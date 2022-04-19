<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            {{ isLogin ? "Sign in" : "Sign up" }}
          </h1>
          <p class="text-xs-center">
            <nuxt-link to="/login" v-if="!isLogin">Have an account?</nuxt-link>
            <nuxt-link to="/register" v-else>Need an account?</nuxt-link>
          </p>

          <ul class="error-messages">
            <li>{{ errors }}</li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                v-model="username"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="email"
                placeholder="Email"
                v-model="email"
                required
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
                v-model="password"
                required
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// 仅在客户端加载js-cookie
const Cookie = process.client ? require('js-cookie'): undefined
import { login, register } from "@/api/user";
export default {
  middleware: ['notAuthenticated'],
  name: "LoginIndex",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errors: "",
    };
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: {
                email: this.email,
                password: this.password,
              },
            })
          : register({
              user: {
                username: this.username,
                email: this.email,
                password: this.password,
              },
            });
        console.log(data.user, '<=======');
        // 保存用户的登录状态
        this.$store.commit('setUser', JSON.stringify(data.user))

        // 为了防止刷新页面数据丢失，数据需要持久化
        Cookie.set('user', JSON.stringify(data.user))
        console.log(Cookie.get('user'), '<-----------')
        
        // 跳转首页
        this.$router.push('/')
      } catch (err) {
        console.log("请求失败", err);
        console.dir(err);
        this.errors = err.response.data.errors || serr.response.data;
      }
    },
  },
};
</script>
