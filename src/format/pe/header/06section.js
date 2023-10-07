export async function parse_section(parser, DOS, COFF) {
    const sectionList = []
    for (let index = 0; index < COFF.NumberOfSections; index++) {
        const view = await parser.offsetToView(DOS.LfaNew + COFF.SizeOfOptionalHeader + index * 40 + 24, 40)
        const section = {}
        section.Index = index
        section.Name = parser.bufferToString(view.buffer, false, 0, 8)
        section.VirtualSize = view.getUint32(8, true)
        section.VirtualAddress = view.getUint32(12, true)
        section.SizeOfRawData = view.getUint32(16, true)
        section.PointerToRawData = view.getUint32(20, true)
        section.PointerToRelocations = view.getUint32(24, true)
        section.PointerToLinenumbers = view.getUint16(28, true)
        section.NumberOfRelocations = view.getUint16(32, true)
        section.NumberOfLinenumbers = view.getUint16(34, true)
        section.Characteristics = view.getUint32(36, true)
        sectionList.push(section)
    }
    return sectionList
}
