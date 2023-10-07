export async function parseNT(parser, DOS) {
    const view = await parser.offsetToView(DOS.LfaNew, 24)
    const header = {}
    header.Type = view.getUint32(0, true)
    if (header.Type !== 0x4550) {
        throw 'nt mark missing'
    }
    return header
}
