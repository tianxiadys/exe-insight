export async function parse_pe_export(parser, dictionary) {
    const view = await parser.pointerToView(dictionary.VritualAddress)
    const header = {}
    header.Charateristics = view.getUint32(0, true)
    header.TimeDateStamp = view.getUint32(4, true)
    header.MajorVersion = view.getUint16(8, true)
    header.MinorVersion = view.getUint16(10, true)
    header.Name = view.getUint32(12, true)
    header.Base = view.getUint32(16, true)
    header.NumberOfFunctions = view.getUint32(20, true)
    header.NumberOfNames = view.getUint32(24, true)
    header.AddressOfFunctions = view.getUint32(28, true)
    header.AddressofNames = view.getUint32(32, true)
    header.AddressOfNameOrdinals = view.getUint32(36, true)
    header.NameString = await parser.pointerToString(header.Name, false)
    header.DATA = await export_data(parser, header)
    return header
}

async function export_data(parser, header) {
    const addressView = await parser.pointerToView(header.AddressOfFunctions)
    const nameView = await parser.pointerToView(header.AddressofNames)
    const ordinalView = await parser.pointerToView(header.AddressOfNameOrdinals)
    //读取所有函数名称缓存到map
    const nameMap = new Map()
    for (let index = 0; index < header.NumberOfNames; index++) {
        const ordinal = ordinalView.getUint16(index * 2, true)
        const name = nameView.getUint32(index * 4, true)
        const nameString = await parser.pointerToString(name, false)
        nameMap.set(ordinal, nameString)
    }
    //读取所有地址并关联缓存的名称
    const itemList = []
    for (let index = 0; index < header.NumberOfFunctions; index++) {
        const item = {}
        item.Index = index
        item.Address = addressView.getUint32(index * 4, true)
        item.Name = nameMap.get(index)
        itemList.push(item)
    }
    return itemList
}
