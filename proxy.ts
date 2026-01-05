import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-up', '/sign-in'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    const res = await checkServerSession();
    const setCookieHeader = res.headers['set-cookie'];

    if (setCookieHeader) {
      const response = NextResponse.next();

      const cookiesArray = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

      for (const cookieStr of cookiesArray) {
        const parsed = parse(cookieStr);

        if (parsed.accessToken) {
          response.cookies.set('accessToken', parsed.accessToken, {
            httpOnly: true,
            path: '/',
            maxAge: Number(parsed['Max-Age']),
            expires: parsed.Expires
              ? new Date(parsed.Expires)
              : undefined,
          });
        }

        if (parsed.refreshToken) {
          response.cookies.set('refreshToken', parsed.refreshToken, {
            httpOnly: true,
            path: '/',
            maxAge: Number(parsed['Max-Age']),
            expires: parsed.Expires
              ? new Date(parsed.Expires)
              : undefined,
          });
        }
      }

      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url), response);
      }

      if (isPrivateRoute) {
        return response;
      }
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-up', '/sign-in'],
};
