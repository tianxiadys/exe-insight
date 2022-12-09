export default async function(windows) {
    //初始化
    let view = await windows.offsetToView(offset, 64)
    let result = {}
    //读取结构
    result.Type = view.getUint16(0, true)
    result.LfaNew = view.getUint32(60, true)
    //检查类型
    if (result.Type !== 0x5A4D) {
        throw Error('not a dos file')
    }
    //返回
    return result
}
