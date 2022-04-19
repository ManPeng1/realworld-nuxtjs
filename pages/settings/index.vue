<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="user.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click.prevent="handleSubmit"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const Cookie = process.client ? require('js-cookie'): undefined
import { updateUser } from "@/api/user";
import { mapState } from "vuex";
export default {
  middleware: ["authenticated"],
  name: "SettingsIndex",
  data() {
    return {
      user: {
        bio: "",
        email: "",
        image: "",
        password: "",
        username: "",
      },
      errors: {}, // 错误信息
    };
  },
  computed: {
    ...mapState({ storeUser: "user" }),
  },
  mounted() {
    this.user.bio = this.storeUser.bio;
    this.user.email = this.storeUser.email;
    this.user.image = this.storeUser.image;
    this.user.password = this.storeUser.password;
    this.user.username = this.storeUser.username;
  },
  methods: {
    async handleSubmit() {
      try {
        const { data } = await updateUser({
          user: this.user,
        });

        console.log("data", data);

        // 更新用户的登录状态
        this.$store.commit("setUser", data.user);

        // 为了防止刷新页面数据丢失，数据需要持久化
        Cookie.set("user", JSON.stringify(data.user));

        this.$router.push({
          name: 'profile',
          params: {
            username: data.user.username
          }
        });
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
    logout() {
      // 删除用户的登录状态
      this.$store.commit("setUser", null);

      // 删除数据持久化
      Cookie.set("user", null);

      this.$router.push("/");
    },
  },
};
</script>
