export default async function(file, offset) {
    //初始化
    let blob = file.slice(offset, offset + 20)
    let buffer = await blob.arrayBuffer()
    let view = new DataView(buffer)
    let result = {}
    //读取结构
    result.Machine = view.getUint16(0, true)
    result.NumberOfSections = view.getUint16(2, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.PointerToSymbolTable = view.getUint32(8, true)
    result.NumberOfSymbols = view.getUint32(12, true)
    result.SizeOfOptionalHeader = view.getUint16(16, true)
    result.Characteristics = view.getUint16(18, true)
    //返回
    return result
}
