import { useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { EditorOutput } from '@/types/editor.types';

export function useEditor() {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<EditorJS | undefined>(undefined);

  const requestSubmit = async (): Promise<EditorOutput> => {
    const title = titleRef.current?.value || '';
    const data = await editorRef.current?.save();

    return {
      title,
      data,
    };
  };

  return {
    titleRef,
    editorRef,
    requestSubmit,
  };
}
