import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const runtime = 'experimental-edge';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhooks(.*)',
    '/books',
    '/authors',
    '/discover',
    '/forum/:path*',
    '/docs',
  ],
  afterAuth: async (auth, req) => {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && req.nextUrl.pathname === '/api/upload/image') {
      return new Response('Only reserved for developer', { status: 401 });
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
