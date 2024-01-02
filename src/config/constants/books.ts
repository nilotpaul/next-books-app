export const BOOK_STATUS = ['draft', 'published'] as const;
export const BOOK_AVAILABALITY = ['Free', 'Paid'] as const;
export const BOOK_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Russian',
  'Japanese',
  'Arabic',
  'Hindi',
  'Portuguese',
  'Bengali',
  'Urdu',
  'Indonesian',
  'Italian',
  'Dutch',
  'Turkish',
  'Korean',
  'Vietnamese',
  'Polish',
  'Thai',
] as const;

export const bookTableColumns = ['title', 'last updated', 'status', 'options'];
