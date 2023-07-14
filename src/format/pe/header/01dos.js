export async function parse_dos(parser) {
    const view = await parser.offsetToView(0, 64)
    const header = {}
    header.Type = view.getUint16(0, true)
    header.LfaNew = view.getUint32(60, true)
    if (header.Type !== 0x5A4D) {
        throw 'dos mark missing'
    }
    return header
}
