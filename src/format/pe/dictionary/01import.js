export async function parseImport(parser, PE, dictionary) {
    const resultList = []
    for (let index = 0; ; index++) {
        const view = await parser.pointerToView(dictionary.VritualAddress + index * 20)
        const result = {}
        result.Index = index
        result.OriginalFirstThunk = view.getUint32(0, true)
        result.TimeDateStamp = view.getUint32(4, true)
        result.ForwarderChain = view.getUint32(8, true)
        result.NameRVA = view.getUint32(12, true)
        result.FirstThunk = view.getUint32(16, true)
        //零终止符
        if (result.NameRVA > 0) {
            result.Name = await parser.pointerToString(result.NameRVA, false)
            result.ITEMS = await importItems(parser, PE, result.OriginalFirstThunk || result.FirstThunk)
            resultList.push(result)
        } else {
            break
        }
    }
    return resultList
}

export async function parseDelayImport(parser, PE, dictionary) {
    const resultList = []
    for (let index = 0; ; index++) {
        let view = await parser.pointerToView(dictionary.VritualAddress + index * 32)
        let result = {}
        result.Index = index
        result.AllAttributes = view.getUint32(0, true)
        result.DllNameRVA = view.getUint32(4, true)
        result.ModuleHandleRVA = view.getUint32(8, true)
        result.ImportAddressTableRVA = view.getUint32(12, true)
        result.ImportNameTableRVA = view.getUint32(16, true)
        result.BoundImportAddressTableRVA = view.getUint32(20, true)
        result.UnloadInformationTableRVA = view.getUint32(24, true)
        result.TimeDateStamp = view.getUint32(28, true)
        //零终止符
        if (result.DllNameRVA > 0) {
            result.Name = await parser.pointerToString(result.DllNameRVA, false)
            result.LIST = await importItems(parser, PE, result.ImportNameTableRVA || result.ImportAddressTableRVA)
            resultList.push(result)
        } else {
            break
        }
    }
    return resultList
}

async function importItems(parser, PE, offset) {
    if (PE.Magic === 0x10B) {
        return importItems32(parser, offset)
    } else if (PE.Magic === 0x20B) {
        return importItems64(parser, offset)
    }
}

async function importItems32(parser, offset) {
    const view = await parser.pointerToView(offset)
    const itemList = []
    for (let index = 0; ; index++) {
        const union = view.getUint32(index * 4, true)
        //零终止符
        if (union > 0) {
            const item = {}
            item.Index = index
            if (union > 0x7FFF_FFFF) {
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

async function importItems64(parser, offset) {
    const view = await parser.pointerToView(offset)
    const itemList = []
    for (let index = 0; ; index++) {
        const union = view.getBigUint64(index * 8, true)
        //零终止符
        if (union > 0n) {
            const item = {}
            item.Index = index
            if (union > 0x7FFF_FFFFn) {
                item.Ordinal = Number(union & 0xFFFFn)
            } else {
                const name = Number(union + 2n)
                item.Name = await parser.pointerToString(name, false)
            }
            itemList.push(item)
        } else {
            break
        }
    }
    return itemList
}
