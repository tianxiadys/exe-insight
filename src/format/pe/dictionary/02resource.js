export async function parse_resource(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset)
    const header = {}
    header.Characteristics = view.getUint32(0, true)
    header.TimeDateStamp = view.getUint32(4, true)
    header.MajorVersion = view.getUint16(8, true)
    header.MinorVersion = view.getUint16(10, true)
    header.NumberOfNamedEntries = view.getUint16(12, true)
    header.NumberOfIdEntries = view.getUint16(14, true)
    header.LIST = await resource_list(parser, dictionary, offset + 16, header.NumberOfNamedEntries + header.NumberOfIdEntries)
    return header
}

async function resource_list(parser, dictionary, offset, count) {
    const itemList = []
    for (let index = 0; index < count; index++) {
        const view = await parser.pointerToView(dictionary.VritualAddress + offset + index * 8)
        const item = {}
        item.Index = index
        const union1 = view.getUint32(0, true)
        if (union1 > 0x7FFF_FFFF) {
            item.Name = await resource_name(parser, dictionary, union1 & 0x7FFF_FFFF)
        } else {
            item.Ordinal = union1
        }
        let union2 = view.getUint32(4, true)
        if (union2 > 0x7FFF_FFFF) {
            item.CHILDREN = await parse_resource(parser, dictionary, union2 & 0x7FFF_FFFF)
        } else {
            item.DATA = await resource_data(parser, dictionary, union2)
        }
        itemList.push(item)
    }
    return itemList
}

async function resource_name(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset)
    const size = view.getUint16(0, true)
    return parser.pointerToString(dictionary.VritualAddress + offset + 2, true, size)
}

async function resource_data(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset)
    const data = {}
    data.OffsetToData = view.getUint32(0, true)
    data.Size = view.getUint32(4, true)
    data.CodePage = view.getUint32(8, true)
    data.Reserved = view.getUint32(12, true)
    return data
}
