export default class {
    static async parse(image, dictionary, offset) {
        let view = await image.pointerToView(dictionary.VritualAddress + offset, 16)
        let result = {}
        result.Characteristics = view.getUint32(0, true)
        result.TimeDateStamp = view.getUint32(4, true)
        result.MajorVersion = view.getUint16(8, true)
        result.MinorVersion = view.getUint16(10, true)
        result.NumberOfNamedEntries = view.getUint16(12, true)
        result.NumberOfIdEntries = view.getUint16(14, true)
        result.LIST = await this.#resourceList(image, dictionary, offset + 16, result.NumberOfNamedEntries + result.NumberOfIdEntries)
        return result
    }

    static async #resourceList(image, dictionary, offset, count) {
        let resultList = []
        for (let index = 0; index < count; index++) {
            let view = await image.pointerToView(dictionary.VritualAddress + offset + index * 8, 8)
            let result = {}
            result.Index = index
            let union1 = view.getUint32(0, true)
            if (union1 > 0x80000000) {
                result.Name = await this.#resourceName(image, dictionary, union1 & 0x7FFFFFFF)
            } else {
                result.Ordinal = union1
            }
            let union2 = view.getUint32(4, true)
            if (union2 > 0x80000000) {
                result.CHILDREN = await this.parse(image, dictionary, union2 & 0x7FFFFFFF)
            } else {
                result.DATA = await this.#resourceData(image, dictionary, union2)
            }
            resultList.push(result)
        }
        return resultList
    }

    static async #resourceName(image, dictionary, offset) {
        let view = await image.pointerToView(dictionary.VritualAddress + offset, 2)
        let size = view.getUint16(0, true)
        return image.pointerToString(dictionary.VritualAddress + offset + 2, true, size)
    }

    static async #resourceData(image, dictionary, offset) {
        let view = await image.pointerToView(dictionary.VritualAddress + offset, 16)
        let result = {}
        result.OffsetToData = view.getUint32(0, true)
        result.Size = view.getUint32(4, true)
        result.CodePage = view.getUint32(8, true)
        result.Reserved = view.getUint32(12, true)
        return result
    }
}
