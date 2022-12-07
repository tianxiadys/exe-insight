export async function headerDictionary(file, offset, size) {
    //初始化
    let resultList = []
    //循环读取
    for (let index = 0; index < size; index++) {
        //初始化
        let blob = file.slice(offset + index * 8, offset + index * 8 + 8)
        let buffer = await blob.arrayBuffer()
        let view = new DataView(buffer)
        let dictionary = {}
        //读取结构
        dictionary.VritualAddress = view.getUint32(0, true)
        dictionary.Size = view.getUint32(4, true)
        //添加到结果数组
        resultList.push(dictionary)
    }
    //返回
    return resultList
}
