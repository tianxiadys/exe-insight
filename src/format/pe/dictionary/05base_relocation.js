export default class {
    static async parse(image, dictionary) {
        let view = await image.pointerToView(dictionary.VritualAddress)
        let result = {}
        result.VirtualAddress = view.getUint32(0, true)
        result.SizeOfBlock = view.getUint32(4, true)
        return result
    }
}
