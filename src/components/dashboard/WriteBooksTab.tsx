import { useContext } from 'react';
import { MyDashboardContext } from '../context/DashboardContext';

import BookTable from './BookTable';

const WriteBooksTab = () => {
  const books = useContext(MyDashboardContext)?.authorBooks || [];
  const sortedBooks = books.sort((a, b) => a.status.length - b.status.length);

  return <BookTable type='Draft Books Table' books={sortedBooks} />;
};

export default WriteBooksTab;
