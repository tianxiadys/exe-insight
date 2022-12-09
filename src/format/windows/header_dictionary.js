export default async function(image, offset, count) {
    //初始化
    let dictionaryList = []
    //循环读取
    for (let index = 0; index < count; index++) {
        //初始化
        let view = await image.offsetToView(offset + index * 8, 8)
        let dictionary = {}
        //读取结构
        dictionary.VritualAddress = view.getUint32(0, true)
        dictionary.Size = view.getUint32(4, true)
        //添加到结果数组
        dictionaryList.push(dictionary)
    }
    //返回
    return dictionaryList
}
