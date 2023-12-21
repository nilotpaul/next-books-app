import { userSession } from '@/services/auth.services';
import { redirect } from 'next/navigation';

const Home = async () => {
  const { id: userId } = await userSession();

  if (userId) {
    return redirect('/dashboard');
  }

  return <div>Home</div>;
};

export default Home;
