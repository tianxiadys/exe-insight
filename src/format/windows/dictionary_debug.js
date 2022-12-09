export async function dictionaryDebug(file, dictionary, section) {
    //初始化
    let offset = section.convert(dictionary.VritualAddress)
    let blob = file.slice(offset, offset + 28)
    let buffer = await blob.arrayBuffer()
    let view = new DataView(buffer)
    let result = {}
    //读取结构
    result.Characteristics = view.getUint32(0, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.MajorVersion = view.getUint32(8, true)
    result.MinorVersion = view.getUint32(10, true)
    result.Type = view.getUint32(12, true)
    result.SizeOfData = view.getUint32(16, true)
    result.AddressOfRawData = view.getUint32(20, true)
    result.PointerToRawData = view.getUint32(24, true)
    //返回
    return result
}
