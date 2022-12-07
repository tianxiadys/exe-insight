import HeaderCOFF from './header_coff.js'
import HeaderPE from './header_pe.js'

export default async function(file, offset) {
  //初始化
  let blob = file.slice(offset, offset + 4)
  let buffer = await blob.arrayBuffer()
  let view = new DataView(buffer)
  let result = {}
  //读取结构
  result.Type = view.getUint32(0, true)
  //检查类型
  if (result.Type === 0x4550) {
    result.COFF = await HeaderCOFF(file, offset + 4)
    result.PE = await HeaderPE(file, offset + 24, result.COFF.SizeOfOptionalHeader)
  } else {
    throw Error('not a pe file')
  }
  //返回
  return result
}
