const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getItem = () => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);

        return item ? JSON.parse(item) : undefined;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { setItem, getItem, removeItem };
};

export default useLocalStorage;
