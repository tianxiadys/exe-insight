export default async function(image, dictionary) {
    //初始化
    let view = await image.pointerToView(dictionary.VritualAddress, 40)
    let result = {}
    //读取结构
    result.Charateristics = view.getUint32(0, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.MajorVersion = view.getUint16(8, true)
    result.MinorVersion = view.getUint16(10, true)
    result.Name = view.getUint32(12, true)
    result.NameString = await image.pointerToString(result.Name, false)
    result.Base = view.getUint32(16, true)
    result.NumberOfFunctions = view.getUint32(20, true)
    result.NumberOfNames = view.getUint32(24, true)
    result.AddressOfFunctions = view.getUint32(28, true)
    result.AddressofNames = view.getUint32(32, true)
    result.AddressOfNameOrdinals = view.getUint32(36, true)
    result.RESULT = []
    //处理内容
    let AddressView = await image.pointerToView(result.AddressOfFunctions, result.NumberOfFunctions * 4)
    let NameView = await image.pointerToView(result.AddressofNames, result.NumberOfNames * 4)
    let OrdinalView = await image.pointerToView(result.AddressOfNameOrdinals, result.NumberOfNames * 4)
    let NameMap = new Map()
    for (let index = 0; index < result.NumberOfNames; index++) {
        let ordinal = OrdinalView.getUint16(index * 2, true)
        let name = NameView.getUint32(index * 4, true)
        let nameString = await image.pointerToString(name, false)
        NameMap.set(ordinal, nameString)
    }
    for (let index = 0; index < result.NumberOfFunctions; index++) {
        let item = {}
        item.Address = AddressView.getUint32(index * 4, true)
        item.Name = NameMap.get(index)
        result.RESULT.push(item)
    }
    //返回
    return result
}
