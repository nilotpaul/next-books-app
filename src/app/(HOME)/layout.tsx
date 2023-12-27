import Auth from '@/components/navbar/Auth';
import Header from '@/components/navbar/Header';
import Profile from '@/components/navbar/Profile';
import Search from '@/components/search/Search';
import Container from '@/components/ui/Container';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header>
        <Search />
        <Auth
          width='full'
          color='warning'
          className='flex w-full flex-col items-center md:hidden'
        />
        <Auth width='default' className='hidden md:block' />
        <Profile />
      </Header>
      <Container className='mt-3'>{children}</Container>
    </div>
  );
}
