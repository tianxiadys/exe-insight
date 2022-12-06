// import HeaderNT from './header_nt.js'

export default async function(file) {
  let blob = file.slice(0, 0x40)
  let buffer = await blob.arrayBuffer()
  let view = new DataView(buffer)

  function getType() {
    return view.getUint16(0, true)
  }

  function getLfaNew() {
    return view.getUint32(0x3C, true)
  }

  async function buildNT() {
    let type = getType()
    if (type === 0x5A4D) {
      let next = getLfaNew()
      //return new HeaderNT(this.file, next)
    } else {
      throw new Error('not a dos file')
    }
  }

  return {
    getType,
    getLfaNew,
    buildNT
  }
}
