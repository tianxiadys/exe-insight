export default async function(image, dictionary) {
    //初始化
    let resultList = []
    //循环读取
    for (let index1 = 0; ; index1++) {
        //初始化
        let view = await image.pointerToView(dictionary.VritualAddress + index1 * 20, 20)
        let result = {}
        //读取结构
        result.Index = index1
        result.OriginalFirstThunk = view.getUint32(0, true)
        result.TimeDateStamp = view.getUint32(4, true)
        result.ForwarderChain = view.getUint32(8, true)
        result.Name = view.getUint32(12, true)
        result.FirstThunk = view.getUint32(16, true)
        //检查停止位
        if (result.FirstThunk === 0) {
            break
        }
        //附加字段
        result.NameString = await image.pointerToString(result.Name, false)
        result.RESULT = []
        //处理内容
        let thunkView = await image.pointerToView(result.FirstThunk)
        for (let index2 = 0; ; index2++) {
            let item = {}
            let unionData = thunkView.getUint32(index2 * 4, true)
            if (unionData === 0) {
                break
            } else if (unionData & 0x80000000) {
                item.Index = index2
                item.Ordinal = unionData & 0x7FFFFFFF
            } else {
                item.Index = index2
                item.Name = await image.pointerToString(unionData + 2, false)
            }
            result.RESULT.push(item)
        }
        //添加到结果数组
        resultList.push(result)
    }
    //返回
    return resultList
}
