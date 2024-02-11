import { constructMetadata } from '@/lib/constructMetadata';
import { SignUp } from '@clerk/nextjs';

export const metadata = constructMetadata({
  title: 'Sign up',
  description: 'New to BooksGod. Please Sign up to continue.',
});

const SignUpPage = () => {
  return <SignUp />;
};

export default SignUpPage;
