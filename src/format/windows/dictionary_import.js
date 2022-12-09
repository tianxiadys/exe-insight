export default async function(windows, dictionary) {
    //初始化
    let view = await windows.pointerToView(dictionary.VritualAddress, 20)
    let result = {}
    //读取结构
    result.OriginalFirstThunk = view.getUint32(0, true)
    result.TimeDateStamp = view.getUint32(4, true)
    result.ForwarderChain = view.getUint32(8, true)
    result.Name = view.getUint32(12, true)
    result.FirstThunk = view.getUint32(16, true)
    //返回
    return result
}
