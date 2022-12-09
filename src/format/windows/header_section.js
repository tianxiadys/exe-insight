export default async function(image, offset, count) {
    //初始化
    let resultList = []
    //循环读取
    for (let index = 0; index < count; index++) {
        //初始化
        let view = await image.offsetToView(offset + index * 40, 40)
        let result = {}
        //读取结构
        result.Index = index
        result.Name = image.bufferToString(view.buffer, false, 0, 8)
        result.VirtualSize = view.getUint32(8, true)
        result.VirtualAddress = view.getUint32(12, true)
        result.SizeOfRawData = view.getUint32(16, true)
        result.PointerToRawData = view.getUint32(20, true)
        result.PointerToRelocations = view.getUint32(24, true)
        result.PointerToLinenumbers = view.getUint16(28, true)
        result.NumberOfRelocations = view.getUint16(32, true)
        result.NumberOfLinenumbers = view.getUint16(34, true)
        result.Characteristics = view.getUint32(36, true)
        //添加到结果数组
        resultList.push(result)
    }
    //返回
    return resultList
}
