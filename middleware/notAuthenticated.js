// 过滤已登陆的页面跳转首页
export default function ({ store, redirect }) {
    // If the user is authenticated redirect to home page
    if (store.state.user) {
      return redirect('/')
    }
  }
  