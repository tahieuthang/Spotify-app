import { createRouter, createWebHistory } from 'vue-router'
import { useCounterStore } from '@/stores/authStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/login.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/auth/register.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/pages/profile/index.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/library/:idMyPlaylist',
      name: 'library',
      component: () => import('@/pages/library/[idMyPlaylist].vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/play-list/:idPlayList',
      name: 'play-list',
      component: () => import('@/pages/play-list/[idPlayList].vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/search/index.vue'),
      meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/components/dashboard/Content.vue'),
      meta: {
        requiresAuth: false,
      }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const stores = useCounterStore()
 
  const isLogged = stores.isLogged
  // next-line: check if route ("to" object) needs authenticated
  if (to.matched.some((record) => record.meta.requiresAuth) && !isLogged) {
    next({ name: "login" });
  } else if (isLogged) {
    switch (to.name) {
      case "login":
        next({ name: "dashboard" }); // Chuyển hướng đến trang mặc định
        break;
      case "register":
        next({ name: "dashboard" });
        break;
      case "resetPassword":
        next({ name: "dashboard" });
        break;
      default:
        next(); // Tiếp tục điều hướng
        break;
    }
  } else {
    next();
  }
});

export default router
