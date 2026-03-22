'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_USERNAME = 'Rabbitinahat';
const ADMIN_PASSWORD = 'Magicman123!';

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    (await cookies()).set('admin_session', 'active', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid sequence.' };
}

export async function logout() {
  (await cookies()).delete('admin_session');
  redirect('/control/login');
}

export async function isAdmin() {
  const session = (await cookies()).get('admin_session');
  return session?.value === 'active';
}
