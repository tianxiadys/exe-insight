export async function parse_pe_nt(parser, offset) {
    const view = await parser.offsetToView(offset, 4)
    const result = {}
    result.Type = view.getUint32(0, true)
    if (result.Type !== 0x4550) {
        throw 'nt mark missing'
    }
    return result
}
