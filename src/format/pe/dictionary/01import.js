export default class {
    static async parseNormal(image, dictionary) {
        let resultList = []
        for (let index = 0; ; index++) {
            let view = await image.pointerToView(dictionary.VritualAddress + index * 20, 20)
            let result = {}
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
            result.NameString = await image.pointerToString(result.Name, false)
            result.LIST = await this.#importList(image, result.OriginalFirstThunk || result.FirstThunk)
            resultList.push(result)
        }
        return resultList
    }

    static async parseDelay(image, dictionary) {
        let resultList = []
        for (let index = 0; ; index++) {
            let view = await image.pointerToView(dictionary.VritualAddress + index * 32, 32)
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
            //检测终止
            if (result.ImportAddressTableRVA === 0) {
                break
            }
            result.NameString = await image.pointerToString(result.DllNameRVA, false)
            result.LIST = await this.#importList(image, result.ImportNameTableRVA || result.ImportAddressTableRVA)
            resultList.push(result)
        }
        return resultList
    }

    static async #importList(image, offset) {
        let view = await image.pointerToView(offset)
        if (image.BITS === 32) {
            return this.#importList32(image, view)
        } else {
            return this.#importList64(image, view)
        }
    }

    static async #importList32(image, view) {
        let itemList = []
        for (let index = 0; ; index++) {
            let item = {}
            item.Index = index
            let union = view.getUint32(index * 4, true)
            if (union === 0) {
                break
            } else if (union > 0x80000000) {
                item.Ordinal = union & 0xFFFF
            } else {
                item.Name = await image.pointerToString(union + 2, false)
            }
            itemList.push(item)
        }
        return itemList
    }

    static async #importList64(image, view) {
        let itemList = []
        for (let index = 0; ; index++) {
            let item = {}
            item.Index = index
            let union = view.getBigUint64(index * 8, true)
            if (union === 0n) {
                break
            } else if (union > 0x80000000n) {
                item.Ordinal = Number(union & 0xFFFFn)
            } else {
                let pointer = Number(union + 2n)
                item.Name = await image.pointerToString(pointer, false)
            }
            itemList.push(item)
        }
        return itemList
    }
}
