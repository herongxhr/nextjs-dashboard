import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default NextAuth(authConfig).auth;


export async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  // 确保 secret 存在
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }

  // 设置 salt，假设可以从环境变量中获取，或者提供一个默认值
  const salt = process.env.NEXTAUTH_SALT || 'default_salt';

  const token = await getToken({ req, secret, salt });
  const { pathname } = req.nextUrl;

  // 如果访问的是/dashboard及其相关页面
  if (pathname.startsWith('/dashboard')) {
    // 如果用户未登录，重定向到登录页面
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // 对于其他页面，直接继续
  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


