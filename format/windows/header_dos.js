import HeaderNT from './header_nt.js'

export default async function(file) {
  //初始化
  let blob = file.slice(0, 64)
  let buffer = await blob.arrayBuffer()
  let view = new DataView(buffer)
  let result = {}
  //读取结构
  result.Type = view.getUint16(0, true)
  result.LfaNew = view.getUint32(60, true)
  //检查类型
  if (result.Type === 0x5A4D) {
    result.NT = await HeaderNT(file, result.LfaNew)
  } else {
    throw Error('not a dos file')
  }
  //返回
  return result
}
