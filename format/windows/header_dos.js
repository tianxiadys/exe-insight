import HeaderNT from './header_nt.js'

export default class {
  async constructor(file) {
    let blob = file.slice(0, 40)
    let buffer = await blob.arrayBuffer()
    this.file = file
    this.view = new DataView(buffer)
  }

  getType() {
    return this.view.getUint16(0, true)
  }

  getLfaNew() {
    return this.view.getUint32(0x3C, true)
  }

  async buildNT() {
    let type = this.getType()
    if (type === 0x4D5A) {
      let next = this.getLfaNew()
      return new HeaderNT(this.file, next)
    } else {
      throw new Error('not a dos file')
    }
  }
}
