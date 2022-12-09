export default async function(windows, dictionary) {
    //初始化
    let view = await windows.pointerToView(dictionary.VritualAddress, 8)
    let result = {}
    //读取结构
    result.VirtualAddress = view.getUint32(0, true)
    result.SizeOfBlock = view.getUint32(4, true)
    //返回
    return result
}
