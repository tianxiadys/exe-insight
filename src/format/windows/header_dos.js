export default async function(image) {
    //初始化
    let view = await image.offsetToView(0, 64)
    let result = {}
    //读取结构
    result.Type = view.getUint16(0, true)
    result.LfaNew = view.getUint32(60, true)
    //检查类型
    if (result.Type !== 0x5A4D) {
        throw Error('dos mark error')
    }
    //返回
    return result
}
