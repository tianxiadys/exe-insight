export default async function(file, offset, size) {
  //初始化
  let blob = file.slice(offset, offset + size)
  let buffer = await blob.arrayBuffer()
  let view = new DataView(buffer)
  let result = {}
  //读取结构
  result.Magic = view.getUint16(0, true)
  result.MajorLinkerVersion = view.getUint8(2)
  result.MinorLinkerVersion = view.getUint8(3)
  result.SizeOfCode = view.getUint32(4, true)
  result.SizeOfInitializedData = view.getUint32(8, true)
  result.SizeOfUninitializedData = view.getUint32(12, true)
  result.AddressOfEntryPoint = view.getUint32(16, true)
  result.BaseOfCode = view.getUint32(20, true)
  result.SectionAlignment = view.getUint32(32, true)
  result.FileAlignment = view.getUint32(36, true)
  result.MajorOperatingSystemVersion = view.getUint16(40, true)
  result.MinorOperatingSystemVersion = view.getUint16(42, true)
  result.MajorImageVersion = view.getUint16(44, true)
  result.MinorImageVersion = view.getUint16(46, true)
  result.MajorSubsystemVersion = view.getUint16(48, true)
  result.MinorSubsystemVersion = view.getUint16(50, true)
  result.Win32VersionValue = view.getUint32(52, true)
  result.SizeOfImage = view.getUint32(56, true)
  result.SizeOfHeaders = view.getUint32(60, true)
  result.CheckSum = view.getUint32(64, true)
  result.Subsystem = view.getUint16(68, true)
  result.DllCharacteristics = view.getUint16(70, true)
  //检查类型
  if (result.Magic === 0x10B) {
    result.BaseOfData = view.getUint32(24, true)
    result.ImageBase = view.getUint32(28, true)
    result.SizeOfStackReserve = view.getUint32(72, true)
    result.SizeOfStackCommit = view.getUint32(76, true)
    result.SizeOfHeapReserve = view.getUint32(80, true)
    result.SizeOfHeapCommit = view.getUint32(84, true)
    result.LoaderFlags = view.getUint32(88, true)
    result.NumberOfRvaAndSizes = view.getUint32(92, true)
  } else if (result.Magic === 0x20B) {
    result.ImageBase = view.getBigUint64(24, true)
    result.SizeOfStackReserve = view.getBigUint64(72, true)
    result.SizeOfStackCommit = view.getBigUint64(80, true)
    result.SizeOfHeapReserve = view.getBigUint64(88, true)
    result.SizeOfHeapCommit = view.getBigUint64(96, true)
    result.LoaderFlags = view.getUint32(104, true)
    result.NumberOfRvaAndSizes = view.getUint32(108, true)
  } else {
    throw Error('not a pe file')
  }
  //返回
  return result
}
