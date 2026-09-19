import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except api, _next, static files, images, and admin
    '/((?!api|_next/static|_next/image|favicon.ico|admin|.*\\..*).*)' 
  ]
};
