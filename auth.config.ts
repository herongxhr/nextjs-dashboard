import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (nextUrl.pathname === '/') {
        // 根路径重定向到 /web
        return Response.redirect(new URL('/web', nextUrl));
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        // 未登录用户重定向到登录页面
        return Response.redirect(new URL('/login', nextUrl));
      }

      if (isLoggedIn && !isOnDashboard) {
        // 已登录用户重定向到 /dashboard
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // 对于其他页面，任何用户都可以直接访问
      return true;
    },
  },
  providers: [], // 暂时保留空数组
} satisfies NextAuthConfig;
