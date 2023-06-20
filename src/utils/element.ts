import { ElLoading } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
let loading = null
//加载动画函数
export const openLoading = (
  options = {
    text: '加载中',
  },
) => {
  const text = options.text

  loading = ElLoading.service({
    lock: true,
    text: text,
  })
}
export const closeLoading = () => {
  loading && loading.close()
}
