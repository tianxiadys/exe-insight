export async function createView(input, offset, size) {
  let headBlob = input.slice(offset, offset + size)
  let headData = await headBlob.arrayBuffer()
  return new DataView(headData)
}

export async function parseFile(file) {

  let headView = await createView(file, 0, 2)
  let typeMark = headView.getUint16(0, true)

  //dos
  if (typeMark === 23117) {
    return parsePE(file)
  }
}

async function parsePE(file) {
  let dosView = await createView(file, 0, 64)

  let ntOffset = dosView.getUint32(60, true)

  let ntView = await createView(file, ntOffset, 500)

  let peMark = ntView.getUint32(0, true)

  if (peMark !== 17744) {
    throw '识别到非pe格式的dos可执行文件'
  }

  let typeMark = ntView.getUint16(24, true)

  if (typeMark === 267) {
    return parsePE32(ntView)
  } else if (typeMark === 523) {
    return parsePE64(ntView)
  }
}

async function parsePE32(ntView) {

}

async function parsePE64(ntView) {

}
