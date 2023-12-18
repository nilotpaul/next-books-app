import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <>
      <SignIn afterSignInUrl='/' afterSignUpUrl='/' signUpUrl='/sign-up' />
    </>
  );
};

export default SignInPage;
