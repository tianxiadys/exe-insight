export default class {
    static async parseNormal(image, dictionary) {
    }

    static async parseDelay(image, dictionary) {
        let resultList = []
        for (let index = 0; ; index++) {
            let view = await image.pointerToView(dictionary.VritualAddress + index * 32)
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
    }

    static async #importList32(image, view) {
    }

    static async #importList64(image, view) {
    }
}

