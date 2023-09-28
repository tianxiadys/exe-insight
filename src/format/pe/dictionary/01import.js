export async function parse_import(parser, dictionary) {
    const resultList = []
    for (let index = 0; ; index++) {
        const view = await parser.pointerToView(dictionary.VritualAddress + index * 20)
        const result = {}
        result.Index = index
        result.OriginalFirstThunk = view.getUint32(0, true)
        result.TimeDateStamp = view.getUint32(4, true)
        result.ForwarderChain = view.getUint32(8, true)
        result.Name = view.getUint32(12, true)
        result.FirstThunk = view.getUint32(16, true)
        //检测终止
        if (result.FirstThunk === 0) {
            break
        }
        result.NameString = await parser.pointerToString(result.Name, false)
        result.ITEMS = await import_items(parser, result.OriginalFirstThunk || result.FirstThunk)
        resultList.push(result)
    }
    return resultList
}

async function import_items(parser, offset) {
    const view = await parser.pointerToView(offset)
    return import_items_real(parser, view, parser.PE.BITS / 8)
}

async function import_items_real(parser, view, word) {
    const itemList = []
    for (let index = 0; ; index++) {
        const union = view.getUint32(index * word, true)
        if (union > 0) {
            const item = {}
            item.Index = index
            if (union >>> 31 > 0) {
                item.Ordinal = union & 0xFFFF
            } else {
                item.Name = await parser.pointerToString(union + 2, false)
            }
            itemList.push(item)
        } else {
            break
        }
    }
    return itemList
}
