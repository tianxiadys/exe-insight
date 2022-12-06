export default class {
  async constructor(file, offset) {
    let blob = file.slice(offset, 4)
    let buffer = await blob.arrayBuffer()
    this.file = file
    this.view = new DataView(buffer)
  }

  getType() {
    return this.view.getUint32(0, true)
  }

  async buildCOFF() {

  }

  async buildPE() {
    let type = this.getType()
    if (type === 0x50450000) {
      let coff = await this.buildCOFF()
    } else {
      throw  new Error('not a pe file')
    }
  }
}
