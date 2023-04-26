export async function parse_pe_resource(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset, 16)
    const result = {}
    result.Characteristics = view.getUint32(0, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.MajorVersion = view.getUint16(8, true)
    result.MinorVersion = view.getUint16(10, true)
    result.NumberOfNamedEntries = view.getUint16(12, true)
    result.NumberOfIdEntries = view.getUint16(14, true)
    result.LIST = await resource_list(parser, dictionary, offset + 16, result.NumberOfNamedEntries + result.NumberOfIdEntries)
    return result
}

async function resource_list(parser, dictionary, offset, count) {
    const resultList = []
    for (let index = 0; index < count; index++) {
        const view = await parser.pointerToView(dictionary.VritualAddress + offset + index * 8, 8)
        const result = {}
        result.Index = index
        const union1 = view.getUint32(0, true)
        if (union1 >>> 31 > 0) {
            result.Name = await resource_name(parser, dictionary, union1 & 0x7FFFFFFF)
        } else {
            result.Ordinal = union1
        }
        let union2 = view.getUint32(4, true)
        if (union2 >>> 31 > 0) {
            result.CHILDREN = await parse_pe_resource(parser, dictionary, union2 & 0x7FFFFFFF)
        } else {
            result.DATA = await resource_data(parser, dictionary, union2)
        }
        resultList.push(result)
    }
    return resultList
}

async function resource_name(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset, 2)
    const size = view.getUint16(0, true)
    return parser.pointerToString(dictionary.VritualAddress + offset + 2, true, size)
}

async function resource_data(parser, dictionary, offset) {
    const view = await parser.pointerToView(dictionary.VritualAddress + offset, 16)
    const result = {}
    result.OffsetToData = view.getUint32(0, true)
    result.Size = view.getUint32(4, true)
    result.CodePage = view.getUint32(8, true)
    result.Reserved = view.getUint32(12, true)
    return result
}
