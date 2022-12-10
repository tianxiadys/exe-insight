export default async function(image, offset) {
    let view = await image.offsetToView(offset, 4)
    let result = {}
    result.Type = view.getUint32(0, true)
    if (result.Type !== 0x4550) {
        throw 'cannot found nt mark'
    }
    return result
}
