export async function headerSection(file, offset, size) {
    //初始化
    let resultList = []
    //循环读取
    for (let index = 0; index < size; index++) {
        //初始化
        let blob = file.slice(offset + index * 40, offset + index * 40 + 40)
        let buffer = await blob.arrayBuffer()
        let view = new DataView(buffer)
        let section = {}
        //读取结构
        section.Name = fromBuffer(buffer, 0, 8, false)
        section.VirtualSize = view.getUint32(8, true)
        section.VirtualAddress = view.getUint32(12, true)
        section.SizeOfRawData = view.getUint32(16, true)
        section.PointerToRawData = view.getUint32(20, true)
        section.PointerToRelocations = view.getUint32(24, true)
        section.PointerToLinenumbers = view.getUint16(28, true)
        section.NumberOfRelocations = view.getUint16(32, true)
        section.NumberOfLinenumbers = view.getUint16(34, true)
        section.Characteristics = view.getUint32(36, true)
        //添加到结果数组
        resultList.push(section)
    }
    //导出函数
    resultList.convert = function(pointer) {
        return convertPointer(pointer, resultList)
    }
    resultList.translate = async function(pointer, max, wide) {
        return fromPointer(pointer, max, wide, file, resultList)
    }
    //返回
    return resultList
}

function convertPointer(pointer, sectionList) {
    for (let section of sectionList) {
        if (section.VirtualAddress <= pointer && section.VirtualAddress + section.VirtualSize > pointer) {
            return pointer - section.VirtualAddress + section.PointerToRawData
        }
    }
    throw Error('cannot convert pointer')
}

function fromBuffer(buffer, offset, max, wide) {
    //初始化
    let result

    //检查宽字符
    if (wide) {
        result = new Uint16Array(buffer, offset, max)
    } else {
        result = new Uint8Array(buffer, offset, max)
    }

    //查找结束标记
    let end = result.indexOf(0)
    if (end >= 0) {
        result = result.subarray(0, end)
    }

    //创建字符串
    return String.fromCharCode(...result)
}

async function fromPointer(pointer, max, wide, file, sectionList) {
    //转义指针
    let offset = convertPointer(pointer, sectionList)

    //读取文件
    let blob = file.slice(offset, offset + max)
    let buffer = await blob.arrayBuffer()

    //读取字符串
    return fromBuffer(buffer, 0, max, wide)
}
