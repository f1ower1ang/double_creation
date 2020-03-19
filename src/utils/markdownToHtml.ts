import Editor from 'tui-editor'

export default class MdToHtml {
  private markdown: string = ''
  private editor: Editor

  constructor(element: any = '', md: string = '') {
    this.editor = new Editor({
      minHeight: '22px',
      el: document.querySelector(element),
      exts: ['table', 'uml']
    })
    if (md) {
      this.editor.setValue(md)
    }
  }

  setValue(md: string) {
    this.markdown = md
    this.editor.setValue(md)
  }

  getHtml() {
    return this.editor.getHtml()
  }
}
