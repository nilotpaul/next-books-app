// import edjsParser from 'editorjs-html';

// export function blocksToHtml(blocks: any) {
//   const parser = edjsParser();
//   const html = parser.parse({ blocks: blocks });

//   return html;
// }

export function getcontentByChapter(blocks: any) {
  const chapterList = blocks[0];

  let chapters = [];
  let currentChapter: any = null;

  if (chapterList.type !== 'list') {
    return null;
  }

  const titles = chapterList.data.items;

  if (titles.length === 0) {
    return null;
  }

  const newBlocks = blocks.filter((item: any) => item.type !== 'list');

  newBlocks.map((item: any) => {
    if (item.type === 'header' && titles.includes(item.data.text)) {
      if (currentChapter) {
        chapters.push({ title: currentChapter.title, content: currentChapter.content });
      }

      currentChapter = { title: item.data.text, content: [item] };
    } else if (titles.includes(item.data.text) && item.type === 'image') {
      currentChapter = { title: item.data.text, content: [item] };
    } else if (!titles.includes(item.data.text) && item.type === 'image') {
      currentChapter = {
        title: item.data.text || currentChapter.title || '',
        content: currentChapter?.content.concat(item) || [item],
      };
    } else {
      currentChapter && currentChapter.content.push(item);
    }
  });

  if (currentChapter) {
    chapters.push({ title: currentChapter.title, content: currentChapter.content });
  }

  return {
    chapters,
    chapterList,
  };
}
