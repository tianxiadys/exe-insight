import HeaderNT from './header_nt.js'

export default async function(file) {
  //初始化
  let blob = file.slice(0, 64)
  let buffer = await blob.arrayBuffer()
  let view = new DataView(buffer)
  let result = {}
  //读取结构
  result.type = view.getUint16(0, true)
  result.lfaNew = view.getUint32(60, true)
  //构造头
  if (result.type === 0x5A4D) {
    result.nt = await HeaderNT(file, result.lfaNew)
  } else {
    throw Error('not a dos file')
  }
  //返回
  return result
}
