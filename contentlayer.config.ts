import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Docs = defineDocumentType(() => ({
  name: 'Docs',
  contentType: 'mdx',
  filePathPattern: `**/*.mdx`,
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    createdAt: {
      type: 'date',
      required: true,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFilePath.replace('.mdx', ''),
    },
  },
}));

export default makeSource({
  contentDirPath: './docs',
  documentTypes: [Docs],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
