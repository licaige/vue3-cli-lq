import router from '@/routers/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//拿到用户信息
import { useUserStore } from '@/store/modules/user'
//生成动态路由信息
import { usePermissionStore } from '@/store/modules/permission'
//浏览器进度条
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 设置白名单
// 记录路由
let hasRoles = true

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 设置标题
  if (typeof to.meta.title === 'string') {
    document.title = to.meta.title || 'vue-admin-perfect'
  }
  //拿到用户信息对应的Store
  const UserStore = useUserStore()
  // console.log('UserStore', UserStore)
  // 确定用户是否已登录过，存在Token
  const hasToken = UserStore.token
  //存在Token的情况下
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      console.log('如果已登录，请重定向到主页')
      next({ path: '/' })
    } else {
      try {
        //拿到动态路由对应的Store
        const PermissionStore = usePermissionStore()
        // console.log('拿到动态路由对应的Store', PermissionStore)
        console.log('拿到动态路由对应的Store', PermissionStore.routes)
        // 路由添加进去了没有及时更新 需要重新进去一次拦截
        if (!PermissionStore.routes.length) {
          // 获取权限列表进行接口访问 因为这里页面要切换权限
          const accessRoutes = await PermissionStore.generateRoutes(UserStore.roles)
          console.log('获取权限列表进行接口访问 因为这里页面要切换权限', accessRoutes)
          hasRoles = false
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          accessRoutes.forEach((item) => router.addRoute(item)) // 动态添加访问路由表
          next({ ...to, replace: true }) // // 这里相当于push到一个页面 不在进入路由拦截
        } else {
          console.log('如果不传参数就会重新执行路由拦截，重新进到这里')
          next() // // 如果不传参数就会重新执行路由拦截，重新进到这里
        }
      } catch (error) {
        console.log('信息错误的时候回转')
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    //整体上不存在Token的情况下
    if (whiteList.indexOf(to.path) !== -1) {
      //在白名单内
      console.log('在白名单内')
      next()
    } else {
      //不在白名单内，给个登录之后回跳的机会
      console.log('不在白名单内，给个登录之后回跳的机会')
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
