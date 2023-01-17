export default class {
    static async parse(image, dictionary) {
        let view = await image.pointerToView(dictionary.VritualAddress, 40)
        let result = {}
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
        //实际解释
        result.NameString = await image.pointerToString(result.Name, false)
        result.LIST = await this.#exportList(image, result)
        return result
    }

    static async #exportList(image, result) {
        let addressView = await image.pointerToView(result.AddressOfFunctions, result.NumberOfFunctions * 4)
        let nameView = await image.pointerToView(result.AddressofNames, result.NumberOfNames * 4)
        let ordinalView = await image.pointerToView(result.AddressOfNameOrdinals, result.NumberOfNames * 4)
        //读取所有函数名称缓存到map
        let nameMap = new Map()
        for (let index = 0; index < result.NumberOfNames; index++) {
            let ordinal = ordinalView.getUint16(index * 2, true)
            let name = nameView.getUint32(index * 4, true)
            let nameString = await image.pointerToString(name, false)
            nameMap.set(ordinal, nameString)
        }
        //读取所有地址并关联缓存的名称
        let itemList = []
        for (let index = 0; index < result.NumberOfFunctions; index++) {
            let item = {}
            item.Index = index
            item.Address = addressView.getUint32(index * 4, true)
            item.Name = nameMap.get(index)
            itemList.push(item)
        }
        return itemList
    }
}
