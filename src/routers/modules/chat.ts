/** 当路由表太长时，可以将其拆分为小模块**/

import Layout from '@/layout/index.vue'

const chartsRouter = [
  {
    path: '/chat',
    component: Layout,
    redirect: '/chat/index',
    name: 'chat',
    meta: {
      title: '聊天框',
      icon: 'chat-square',
    },
    children: [
      {
        path: '/chat/index',
        component: () => import('@/views/chat/index.vue'),
        name: 'chatBox',
        meta: { title: '聊天框', icon: 'chat-square' },
      },
    ],
  },
]

export default chartsRouter
