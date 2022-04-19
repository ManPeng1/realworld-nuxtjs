// 过滤未登陆的页面跳转登陆页
export default function ({ store, redirect }) {
    // If the user is not authenticated
    if (!store.state.user) {
        return redirect('/login')
    }
}
