export default async function(image, dictionary) {
    //初始化
    let view = await image.pointerToView(dictionary.VritualAddress, 28)
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