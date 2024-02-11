import { constructMetadata } from '@/lib/constructMetadata';
import { SignIn } from '@clerk/nextjs';

export const metadata = constructMetadata({
  title: 'Sign in',
  description: 'Welcome back. Sign in to your account.',
});

const SignInPage = () => {
  return (
    <>
      <SignIn />
    </>
  );
};

export default SignInPage;
