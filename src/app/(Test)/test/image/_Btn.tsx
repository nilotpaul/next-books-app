'use client';

import { uploadImageTest } from '@/actions';
import { uploadImageValidation } from '@/validations/uploadImageValidation';
import { Button, Input } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRef } from 'react';

const Btn = () => {
  const inuputRef = useRef<HTMLInputElement | null>(null);

  const { mutate } = useMutation({
    mutationFn: async (file: File) => {
      const { file: image } = uploadImageValidation.parse({ file }) as { file: File };

      const formData = new FormData();
      formData.set('file', image);

      await axios.post('/api/upload/image', formData);
    },
  });

  return (
    <>
      <Input ref={inuputRef} type='file' accept='image/*' />
      <Button
        onClick={() => {
          if (!inuputRef.current?.files) return;
          mutate(inuputRef.current.files[0]);
        }}
      >
        Submit
      </Button>
    </>
  );
};

export default Btn;
