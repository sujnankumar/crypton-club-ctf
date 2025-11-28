import type { DefaultSession } from 'next-auth';
import type { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'player';
      username: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'admin' | 'player';
    username: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'player';
    username: string;
  }
}
