import { AuthorByStars } from '@/types/author.types';

import ReusableCard, { GridContainer } from '../ReusableCard';

type AuthorCardWrapperProps = {
  getAuthorData: () => Promise<AuthorByStars[]>;
};

const AuthorCardWrapper = async ({ getAuthorData }: AuthorCardWrapperProps) => {
  const authors = await getAuthorData();

  return (
    <GridContainer>
      {Array(10)
        .fill(authors[0])
        .map((author) => (
          <ReusableCard
            data={{
              id: author.id,
              title: author.authorName,
              thumbnail: author.authorImage || '',
              href: '',
              chip: `Stars: ${author.stars || 0}`,
            }}
          />
        ))}
    </GridContainer>
  );
};

export default AuthorCardWrapper;
