export async function parse_pe_dictionary(parser, offset, count) {
    const dictionaryList = []
    for (let index = 0; index < count; index++) {
        const view = await parser.offsetToView(offset + index * 8, 8)
        const dictionary = {}
        dictionary.Index = index
        dictionary.VritualAddress = view.getUint32(0, true)
        dictionary.Size = view.getUint32(4, true)
        if (dictionary.Size > 0) {
            dictionaryList.push(dictionary)
        }
    }
    return dictionaryList
}
