export async function parse_pe_thread_local(parser, dictionary) {
    const view = await parser.pointerToView(dictionary.VritualAddress)
    const result = {}
    switch (parser.PE.Magic) {
        case 0x10B:
            result.StartAddressOfRawData = view.getUint32(0, true)
            result.EndAddressOfRawData = view.getUint32(4, true)
            result.AddressOfIndex = view.getUint32(8, true)
            result.AddressOfCallBacks = view.getUint32(12, true)
            result.SizeOfZeroFill = view.getUint32(16, true)
            result.Characteristics = view.getUint32(20, true)
            break
        case 0x20B:
            result.StartAddressOfRawData = view.getBigUint64(0, true)
            result.EndAddressOfRawData = view.getBigUint64(8, true)
            result.AddressOfIndex = view.getBigUint64(16, true)
            result.AddressOfCallBacks = view.getBigUint64(24, true)
            result.SizeOfZeroFill = view.getUint32(28, true)
            result.Characteristics = view.getUint32(32, true)
            break
    }
    return result
}
