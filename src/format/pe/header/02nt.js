export async function parse_pe_nt(reader, offset) {
    const view = await reader.offsetToView(offset, 4)
    const result = {}
    result.Type = view.getUint32(0, true)
    if (result.Type !== 0x4550) {
        throw 'nt mark missing'
    }
    return result
}
