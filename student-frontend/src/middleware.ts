import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: NextRequest) {
  // const auth = cookies().get('access_token')?.value;
  const auth = true;
  const isIncludes = ['/login', '/register'];
  if (!Boolean(auth)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (Boolean(auth) && isIncludes.includes(request.url)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}
export const config = {
  matcher: ['/', '/k-nearest-neighbor', '/decision-tree', '/naive-bayes'],
};
