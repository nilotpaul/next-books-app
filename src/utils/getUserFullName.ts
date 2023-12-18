export function getUserName(firstName: string, lastName: string) {
  const fullName = firstName + ' ' + lastName;
  const fallback = fullName.split(' ')[0].slice(0, 1) + fullName.split(' ')[1].slice(0, 1);

  return {
    fullName,
    fallback,
  };
}
