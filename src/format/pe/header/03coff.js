export async function parse_coff(parser, offset) {
    const view = await parser.offsetToView(offset, 20)
    const header = {}
    header.Machine = view.getUint16(0, true)
    header.NumberOfSections = view.getUint16(2, true)
    header.TimeDateStamp = view.getUint32(4, true)
    header.PointerToSymbolTable = view.getUint32(8, true)
    header.NumberOfSymbols = view.getUint32(12, true)
    header.SizeOfOptionalHeader = view.getUint16(16, true)
    header.Characteristics = view.getUint16(18, true)
    return header
}
