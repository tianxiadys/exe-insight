export default async function(image) {
    let view = await image.offsetToView(0, 64)
    let result = {}
    result.Type = view.getUint16(0, true)
    result.LfaNew = view.getUint32(60, true)
    if (result.Type !== 0x5A4D) {
        throw 'cannot found dos mark'
    }
    return result
}
