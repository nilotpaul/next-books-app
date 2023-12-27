'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUploadImage } from '@/hooks/useImageUpload';
import EditorJS from '@editorjs/editorjs';
import { Textarea } from '@nextui-org/input';

import '@/styles/editor.css';
import { toast } from 'sonner';

type EditorProps = {
  placeholder: {
    titleBar: string;
    editor: string;
  };
  label: {
    titleBar: string;
    editor: string;
  };
};

const Editor = ({ placeholder, label }: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef<EditorJS | undefined>(undefined);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);

  const { uploadImage } = useUploadImage();

  const initEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Embed = (await import('@editorjs/embed')).default;
    const Table = (await import('@editorjs/table')).default;
    const List = (await import('@editorjs/list')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const ImageTool = (await import('@editorjs/image')).default;
    const Paragraph = (await import('@editorjs/paragraph')).default;
    const Quote = (await import('@editorjs/quote')).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        onReady: () => {
          editorRef.current = editor;
        },
        placeholder: placeholder.editor,
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: {
            // @ts-ignore
            class: Header,
            config: {
              placeholder: 'Heading',
            },
          },
          paragraph: {
            class: Paragraph,
            config: {
              placeholder: 'Start Writing...',
            },
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: '/api/editor/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                // upload images here
                uploadByFile: async (file: File) => {
                  const data = await uploadImage(file, () => {
                    toast.success('Image uploaded successfully');
                  });

                  return {
                    success: 1,
                    file: {
                      url: data?.publicUrl || '',
                    },
                  };
                },
              },
            },
          },
          quote: {
            class: Quote,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Caption',
            },
          },
          list: List,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, [editorRef.current]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initEditor();

      setTimeout(() => {
        titleRef.current?.focus();
      }, 300);
    };

    if (isMounted) {
      init();

      return () => {
        editorRef.current?.destroy();
        editorRef.current = undefined;
      };
    }
  }, [isMounted, initEditor]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <form className='prose prose-stone mx-auto space-y-2 dark:prose-invert'>
        <Textarea
          ref={titleRef}
          label={label.titleBar}
          placeholder={placeholder.titleBar}
          labelPlacement='outside'
          size='sm'
          variant='bordered'
          fullWidth
          color='primary'
          radius='lg'
          classNames={{
            input: 'text-4xl font-bold',
            label: 'text-lg font-semibold',
            inputWrapper: 'outline-none border-none px-0',
          }}
          minRows={2}
        />

        <div>
          <span className='pb-1.5 text-lg font-semibold text-primary'>{label.editor}</span>
          <div id='editorjs' />
        </div>
      </form>
    </>
  );
};

export default Editor;
