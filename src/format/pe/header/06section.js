export async function parse_pe_section(reader, offset, count) {
    let resultList = []
    for (let index = 0; index < count; index++) {
        let view = await reader.offsetToView(offset + index * 40, 40)
        let result = {}
        result.Index = index
        result.Name = reader.bufferToString(view.buffer, false, 0, 8)
        result.VirtualSize = view.getUint32(8, true)
        result.VirtualAddress = view.getUint32(12, true)
        result.SizeOfRawData = view.getUint32(16, true)
        result.PointerToRawData = view.getUint32(20, true)
        result.PointerToRelocations = view.getUint32(24, true)
        result.PointerToLinenumbers = view.getUint16(28, true)
        result.NumberOfRelocations = view.getUint16(32, true)
        result.NumberOfLinenumbers = view.getUint16(34, true)
        result.Characteristics = view.getUint32(36, true)
        resultList.push(result)
    }
    return resultList
}
