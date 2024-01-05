import DashSidebar from './DashSidebar';

type SidebarWrapperProps = {
  getAuthor: () => Promise<boolean>;
};

const SidebarWrapper = async ({ getAuthor }: SidebarWrapperProps) => {
  const isAuthor = await getAuthor();

  return <DashSidebar isAuthor={isAuthor} />;
};

export default SidebarWrapper;
