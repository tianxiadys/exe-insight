export async function dictionaryBaseRelocation(file, dictionary, section) {
    //初始化
    let offset = section.convert(dictionary.VritualAddress)
    let blob = file.slice(offset, offset + 8)
    let buffer = await blob.arrayBuffer()
    let view = new DataView(buffer)
    let result = {}
    //读取结构
    result.VirtualAddress = view.getUint32(0, true)
    result.SizeOfBlock = view.getUint32(4, true)
    //返回
    return result
}
