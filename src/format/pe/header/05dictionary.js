export async function parse_dictionary(parser, DOS, PE) {
    const dictionaryList = []
    for (let index = 0; index < PE.NumberOfRvaAndSizes; index++) {
        const view = await parser.offsetToView(DOS.LfaNew + PE.OffsetDictionary + index * 8, 8)
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
