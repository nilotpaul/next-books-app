'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useUploadImage } from '@/hooks/useImageUpload';
import EditorJS from '@editorjs/editorjs';
import { Textarea } from '@nextui-org/input';
import { getFileDimensions } from '@/lib/getImageDimensions';

import { toast } from 'sonner';
import { Kbd } from '@nextui-org/kbd';
import { Skeleton } from '@nextui-org/skeleton';
import '@/styles/editor.css';

type EditorProps = {
  titleRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  editorRef: React.MutableRefObject<EditorJS | undefined>;
  data?: any;
  defaultValues?: {
    title?: string;
    content?: string;
  };
  placeholder: {
    titleBar: string;
    editor: string;
  };
  label: {
    titleBar: string;
    editor: string;
  };
};

const Editor = ({ defaultValues, placeholder, label, titleRef, editorRef, data }: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

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
        data: { blocks: data || [] },
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
                  const dimensions = await getFileDimensions(file);

                  if (!dimensions.width || !dimensions.height) {
                    toast.error('Something went wrong');
                    return;
                  }
                  const data = await uploadImage(file, () => {
                    toast.success('Image uploaded successfully');
                  });

                  return {
                    success: 1,
                    file: {
                      url: data?.publicUrl || '',
                      height: dimensions.height,
                      width: dimensions.width,
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
  }, []);

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

  return (
    <div className='prose prose-stone mx-auto flex flex-col justify-between space-y-2 dark:prose-invert'>
      <Textarea
        ref={titleRef}
        label={label.titleBar}
        placeholder={placeholder.titleBar}
        defaultValue={defaultValues?.title}
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
        minRows={1.5}
      />

      <div className='h-full'>
        <span className='pb-1.5 text-lg font-semibold text-primary'>{label.editor}</span>
        {isMounted ? (
          <div id='editorjs' className='min-h-[480px]' />
        ) : (
          <div className='mt-3 min-h-[450px] space-y-3'>
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className='h-2.5 w-full rounded-md' />
              ))}
          </div>
        )}

        <div className='text-sm text-foreground-500'>
          Use <Kbd keys={['tab']}>Tab</Kbd> to open editor tools
        </div>
      </div>
    </div>
  );
};

export default Editor;
