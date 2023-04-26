export async function parse_pe_coff(parser, offset) {
    const view = await parser.offsetToView(offset, 20)
    const result = {}
    result.Machine = view.getUint16(0, true)
    result.NumberOfSections = view.getUint16(2, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.PointerToSymbolTable = view.getUint32(8, true)
    result.NumberOfSymbols = view.getUint32(12, true)
    result.SizeOfOptionalHeader = view.getUint16(16, true)
    result.Characteristics = view.getUint16(18, true)
    return result
}
