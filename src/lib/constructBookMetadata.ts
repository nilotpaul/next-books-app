import { BookMetadata } from '@/types/book.types';

export function constructBookMetadata(metadata: BookMetadata, toc: any) {
  const table = [
    {
      id: toc.id,
      data: {
        name: 'toc',
        title: metadata.title,
        items: toc.data.items,
        style: toc.data.style,
      },
      type: toc.type,
    },
  ];

  return [
    {
      title: '',
      content: [
        {
          id: 'image',
          data: {
            file: {
              url: metadata.cover,
              title: metadata.title,
              author: metadata.author,
              height: 2400,
              width: 1600,
            },
          },
          type: 'image',
        },
      ],
    },
    {
      title: '',
      content: table,
    },
  ];
}
