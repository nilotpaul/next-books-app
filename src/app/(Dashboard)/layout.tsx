import DashNavbar from '@/components/dashboard/DashNavbar';
import Profile from '@/components/navbar/Profile';
import Container from '@/components/ui/Container';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <DashNavbar>
        <Profile />
      </DashNavbar>

      <Container className='mt-3'>{children}</Container>
    </>
  );
};

export default DashboardLayout;
