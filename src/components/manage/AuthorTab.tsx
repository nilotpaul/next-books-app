import { Author } from '@/types/author.types';
import AuthorRegisterModal from '../modals/AuthorRegisterModal';
import { cn } from '@/utils/utils';
import PendingAuthorRegisterModal from '../modals/PendingAuthorRegisterModal';

import { Card, CardBody } from '@nextui-org/card';

type AuthorTabtProps = {
  isAuthor: boolean;
  author: Author | null;
};

const AuthorTab = ({ isAuthor, author }: AuthorTabtProps) => {
  return (
    <>
      {!isAuthor && !author?.secretKey && <AuthorRegisterModal />}
      {!isAuthor && author?.secretKey && <PendingAuthorRegisterModal />}
      <div
        className={cn('h-full w-full', {
          'bg-foreground-50 opacity-40 blur-md filter': !isAuthor,
        })}
      >
        content
      </div>
    </>
  );
};

export default AuthorTab;
