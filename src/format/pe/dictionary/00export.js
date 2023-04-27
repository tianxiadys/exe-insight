export async function parse_pe_export(parser, dictionary) {
    const view = await parser.pointerToView(dictionary.VritualAddress)
    const result = {}
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
    result.NameString = await parser.pointerToString(result.Name, false)
    result.LIST = await export_list(parser, result)
    return result
}

async function export_list(parser, result) {
    const addressView = await parser.pointerToView(result.AddressOfFunctions)
    const nameView = await parser.pointerToView(result.AddressofNames)
    const ordinalView = await parser.pointerToView(result.AddressOfNameOrdinals)
    //读取所有函数名称缓存到map
    const nameMap = new Map()
    for (let index = 0; index < result.NumberOfNames; index++) {
        const ordinal = ordinalView.getUint16(index * 2, true)
        const name = nameView.getUint32(index * 4, true)
        const nameString = await parser.pointerToString(name, false)
        nameMap.set(ordinal, nameString)
    }
    //读取所有地址并关联缓存的名称
    const itemList = []
    for (let index = 0; index < result.NumberOfFunctions; index++) {
        const item = {}
        item.Index = index
        item.Address = addressView.getUint32(index * 4, true)
        item.Name = nameMap.get(index)
        itemList.push(item)
    }
    return itemList
}
