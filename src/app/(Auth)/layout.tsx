import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (userId) {
    redirect('/');
  }
  return <div className='flex h-screen w-screen items-center justify-center'>{children}</div>;
}
