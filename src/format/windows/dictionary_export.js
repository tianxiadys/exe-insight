export async function dictionaryExport(file, dictionary, section) {
    //初始化
    let offset = section.translate(dictionary.VritualAddress)
    let blob = file.slice(offset, offset + 40)
    let buffer = await blob.arrayBuffer()
    let view = new DataView(buffer)
    let result = {}
    //读取结构
    result.Charateristics = view.getUint32(0, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.MajorVersion = view.getUint16(8, true)
    result.MinorVersion = view.getUint16(10, true)
    result.Name = view.getUint32(12, true)
    result.Base = view.getUint32(16, true)
    result.NumberOfFunctions = view.getUint32(20, true)
    result.NumberOfNames = view.getUint32(24, true)
    result.AddressOfFunctions = view.getUint32(28, true)
    result.AddressofNames = view.getUint32(32, true)
    result.AddressOfNameOrdinals = view.getUint32(36, true)

    let nameOffset = section.translate(result.Name)

    //返回
    return result
}
