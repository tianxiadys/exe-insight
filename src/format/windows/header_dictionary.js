export default async function(image, offset, count) {
    //初始化
    let resultList = []
    //循环读取
    for (let index = 0; index < count; index++) {
        //初始化
        let view = await image.offsetToView(offset + index * 8, 8)
        let result = {}
        //读取结构
        result.Index = index
        result.VritualAddress = view.getUint32(0, true)
        result.Size = view.getUint32(4, true)
        //添加到结果数组
        resultList.push(result)
    }
    //返回
    return resultList
}
