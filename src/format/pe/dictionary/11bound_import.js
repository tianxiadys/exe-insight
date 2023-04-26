export async function parse_pe_bound_import(parser, dictionary) {
    const resultList = []
    let count = 1
    for (let index = 0; index < count; index++) {
        const view = await parser.pointerToView(dictionary.VritualAddress + index * 8, 8)
        const result = {}
        result.Index = index
        result.TimeDateStamp = view.getUint32(0, true)
        result.OffsetModuleName = view.getUint16(4, true)
        result.NumberOfModuleForwarderRefs = view.getUint16(6, true)
        result.NameString = await parser.pointerToString(result.OffsetModuleName, false)
        resultList.push(result)
        //延长数组长度
        count += result.NumberOfModuleForwarderRefs
    }
    return resultList
}
