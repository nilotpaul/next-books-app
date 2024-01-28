export const revalidate = 0;
export const dynamic = 'force-dynamic';

const ForumPostCreateLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className='p-4'>{children}</div>;
};

export default ForumPostCreateLayout;
