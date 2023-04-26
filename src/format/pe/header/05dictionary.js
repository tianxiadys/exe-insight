export async function parse_pe_dictionary(parser, offset, count) {
    const resultList = []
    for (let index = 0; index < count; index++) {
        const view = await parser.offsetToView(offset + index * 8, 8)
        const result = {}
        result.Index = index
        result.VritualAddress = view.getUint32(0, true)
        result.Size = view.getUint32(4, true)
        if (result.Size > 0) {
            resultList.push(result)
        }
    }
    return resultList
}
