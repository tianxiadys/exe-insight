export default async function(image, offset) {
    //初始化
    let view = await image.offsetToView(offset, 4)
    let result = {}
    //读取结构
    result.Type = view.getUint32(0, true)
    //检查类型
    if (result.Type !== 0x4550) {
        throw Error('nt mark error')
    }
    //返回
    return result
}
