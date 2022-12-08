import { readString8 } from './common_string.js'

export async function headerSection(file, offset, size) {
    //初始化
    let resultList = []
    resultList.translate = sectionTranslate
    //循环读取
    for (let index = 0; index < size; index++) {
        //初始化
        let blob = file.slice(offset + index * 40, offset + index * 40 + 40)
        let buffer = await blob.arrayBuffer()
        let view = new DataView(buffer)
        let section = {}
        //读取结构
        section.Name = readString8(buffer, 0, 8)
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
    //返回
    return resultList
}

function sectionTranslate(pointer) {
    for (let section of this) {
        if (section.VirtualAddress <= pointer && section.VirtualAddress + section.VirtualSize > pointer) {
            return pointer - section.VirtualAddress + section.PointerToRawData
        }
    }
    throw Error('cannot translate pointer')
}
