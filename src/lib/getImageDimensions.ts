export async function getFileDimensions(
  file: File
): Promise<{ height: number | null; width: number | null }> {
  if (!file) {
    console.error('Something went wrong');
    return {
      height: null,
      width: null,
    };
  }

  const img = new Image();

  return await new Promise((resolve, reject) => {
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      resolve({ width, height });
    };

    img.onerror = () => {
      reject('Error loading image');
    };

    img.src = URL.createObjectURL(file);
  });
}
