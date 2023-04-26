export async function parse_pe_dictionary(reader, offset, count) {
    let resultList = []
    for (let index = 0; index < count; index++) {
        let view = await reader.offsetToView(offset + index * 8, 8)
        let result = {}
        result.Index = index
        result.VritualAddress = view.getUint32(0, true)
        result.Size = view.getUint32(4, true)
        if (result.Size > 0) {
            resultList.push(result)
        }
    }
    return resultList
}
