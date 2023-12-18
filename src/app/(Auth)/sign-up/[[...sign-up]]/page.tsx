import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return <SignUp afterSignInUrl='/' afterSignUpUrl='/' signInUrl='/sign-in' />;
};

export default SignUpPage;
