export default async function(image, dictionary) {
    let view = await image.pointerToView(dictionary.VritualAddress, 8)
    let result = {}
    result.VirtualAddress = view.getUint32(0, true)
    result.SizeOfBlock = view.getUint32(4, true)
    return result
}
