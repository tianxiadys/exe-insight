import { headerCOFF } from './header_coff.js'
import { headerPE } from './header_pe.js'
import { headerSection } from './header_section.js'

export async function headerNT(file, offset) {
    //初始化
    let blob = file.slice(offset, offset + 4)
    let buffer = await blob.arrayBuffer()
    let view = new DataView(buffer)
    let result = {}
    //读取结构
    result.Type = view.getUint32(0, true)
    //检查类型
    if (result.Type === 0x4550) {
        result.COFF = await headerCOFF(file, offset + 4)
        result.PE = await headerPE(file, offset + 24, result.COFF.SizeOfOptionalHeader)
        result.SECTION = await headerSection(file, offset + result.COFF.SizeOfOptionalHeader + 24, result.COFF.NumberOfSections)
    } else {
        throw Error('not a pe file')
    }
    //返回
    return result
}
