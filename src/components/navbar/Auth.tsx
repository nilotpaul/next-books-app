import { cn } from '@/utils/utils';
import { Button, type ButtonProps } from '@nextui-org/button';
import Link from '../ui/Link';
import { userSession } from '@/services/auth.services';

type AuthProps = {
  className?: string;
  variants?: {
    signup?: ButtonProps['variant'];
    login?: ButtonProps['variant'];
  };
  size?: ButtonProps['size'];
  color?: ButtonProps['color'];
  width: 'full' | 'default';
};

const Auth = async ({
  className,
  size = 'sm',
  variants = { login: 'flat', signup: 'light' },
  color = 'default',
  width,
}: AuthProps) => {
  const user = await userSession();

  const isWidthFull = width === 'full';

  return (
    <>
      {!user?.id && (
        <div className={cn(className)}>
          <Button
            as={Link}
            href='/sign-up'
            size={size}
            color={color}
            variant={variants.signup}
            className={cn('text-sm font-medium', {
              'w-full': isWidthFull,
            })}
          >
            Sign Up
          </Button>
          <Button
            as={Link}
            href='/sign-in'
            size={size}
            color={color}
            variant={variants.login}
            className={cn('text-sm font-medium', {
              'w-full': isWidthFull,
            })}
          >
            Log in
          </Button>
        </div>
      )}
    </>
  );
};

export default Auth;
