export default class {
    static async parse(image, dictionary) {
        let resultList = []
        let count = 1
        for (let index = 0; index < count; index++) {
            let view = await image.pointerToView(dictionary.VritualAddress + index * 8, 8)
            let result = {}
            result.Index = index
            result.TimeDateStamp = view.getUint32(0, true)
            result.OffsetModuleName = view.getUint16(4, true)
            //开头元素定义后续元素数量
            if (index === 0) {
                result.NumberOfModuleForwarderRefs = view.getUint16(6, true)
                count = result.NumberOfModuleForwarderRefs + 1
            }
            result.NameString = await image.pointerToString(result.OffsetModuleName, false)
            resultList.push(result)
        }
        return resultList
    }
}
