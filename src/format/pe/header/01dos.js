export async function parse_pe_dos(parser) {
    const view = await parser.offsetToView(0, 64)
    const result = {}
    result.Type = view.getUint16(0, true)
    result.LfaNew = view.getUint32(60, true)
    if (result.Type !== 0x5A4D) {
        throw 'dos mark missing'
    }
    return result
}
