import { cn } from '@/utils/utils';
import { Button, type ButtonProps } from '@nextui-org/button';
import Link from '../ui/Link';
import { userSession } from '@/services/auth.services';

type AuthProps = {
  classNames?: {
    main?: string;
    button?: string;
  };
  variants?: {
    signup?: ButtonProps['variant'];
    login?: ButtonProps['variant'];
  };
  size?: ButtonProps['size'];
  color?: ButtonProps['color'];
  width: 'full' | 'default';
};

const Auth = async ({ classNames, size = 'sm', variants, color = 'default', width }: AuthProps) => {
  const user = await userSession();

  const isWidthFull = width === 'full';

  return (
    <>
      {!user?.id && (
        <div className={cn(classNames?.main)}>
          <Button
            as={Link}
            href='/sign-up'
            size={size}
            color={color}
            variant={variants?.signup || 'light'}
            className={cn(
              'text-sm font-medium',
              {
                'w-full': isWidthFull,
              },
              classNames?.button
            )}
          >
            Sign Up
          </Button>
          <Button
            as={Link}
            href='/sign-in'
            size={size}
            color={color}
            variant={variants?.login || 'flat'}
            className={cn(
              'text-sm font-medium',
              {
                'w-full': isWidthFull,
              },
              classNames?.button
            )}
          >
            Log in
          </Button>
        </div>
      )}
    </>
  );
};

export default Auth;
