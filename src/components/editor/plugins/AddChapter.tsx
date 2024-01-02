export class ChapterBlock {
  constructor({
    data,
    api,
    config,
    readOnly,
    block,
  }: {
    data: any;
    config: any;
    api: any;
    readOnly: boolean;
  }) {
    console.log({ api });

    this.api = api;
    this.data = data;
    this.title = 'Untitled Chapter';
    // this.nodes = {
    //   holder: null,
    // };
  }

  static get toolbox() {
    return {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open-text"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M6 8h2"/><path d="M6 12h2"/><path d="M16 8h2"/><path d="M16 12h2"/></svg>',
      title: 'Chapter',
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const mainDiv = document.createElement('div');

    const input = document.createElement('input');
    input.className = 'chapter_input';
    input.placeholder = 'Enter chapter title';

    input.addEventListener('input', async (e) => {
      const savedData = await this.api.saver.save();
      this.data = savedData;
    });

    mainDiv.appendChild(input);

    return mainDiv;
  }

  addChapter() {}

  save(blockContent) {
    return {
      mydata: blockContent,
      data: this.data,
    };
  }
}
