export async function parseResource(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset)
    const header = {}
    header.Characteristics = view.getUint32(0, true)
    header.TimeDateStamp = view.getUint32(4, true)
    header.MajorVersion = view.getUint16(8, true)
    header.MinorVersion = view.getUint16(10, true)
    header.NumberOfNamedEntries = view.getUint16(12, true)
    header.NumberOfIdEntries = view.getUint16(14, true)
    header.ITEMS = await resourceItems(parser, dictionary, offset + 16, header.NumberOfNamedEntries + header.NumberOfIdEntries)
    return header
}

async function resourceItems(parser, dictionary, offset, count) {
    const itemList = []
    for (let index = 0; index < count; index++) {
        const view = await parser.pointerToView(dictionary.VritualAddress + offset + index * 8)
        const item = {}
        item.Index = index
        const union1 = view.getUint32(0, true)
        if (union1 > 0x7FFF_FFFF) {
            const offset = dictionary.VritualAddress + union1 & 0x7FFF_FFFF
            const view = await parser.pointerToView(offset)
            const size = view.getUint16(0, true)
            item.Name = await parser.pointerToString(offset + 2, true, size)
        } else {
            item.Ordinal = union1
        }
        let union2 = view.getUint32(4, true)
        if (union2 > 0x7FFF_FFFF) {
            item.CHILDREN = await parseResource(parser, dictionary, union2 & 0x7FFF_FFFF)
        } else {
            const view = await parser.pointerToView(dictionary.VritualAddress + union2)
            item.OffsetToData = view.getUint32(0, true)
            item.Size = view.getUint32(4, true)
            item.CodePage = view.getUint32(8, true)
            item.Reserved = view.getUint32(12, true)
        }
        itemList.push(item)
    }
    return itemList
}
