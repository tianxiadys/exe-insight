import headerDOS from './header_dos.js'
import headerNT from './header_nt.js'
import headerCOFF from './header_coff.js'
import headerPE from './header_pe.js'
import headerDictionary from './header_dictionary.js'
import headerSection from './header_section.js'
import dictionaryExport from './dictionary_export.js'
import dictionaryImport from './dictionary_import.js'
import dictionaryResource from './dictionary_resource.js'
import dictionaryException from './dictionary_exception.js'
import dictionarySecurity from './dictionary_security.js'
import dictionaryBaseRelocation from './dictionary_base_relocation.js'
import dictionaryDebug from './dictionary_debug.js'
import dictionaryArchitecture from './dictionary_architecture.js'
import dictionaryGlobalPointer from './dictionary_global_pointer.js'
import dictionaryThreadLocal from './dictionary_thread_local.js'
import dictionaryLoadConfig from './dictionary_load_config.js'
import dictionaryBoundImport from './dictionary_bound_import.js'
import dictionaryImportAddress from './dictionary_import_address.js'
import dictionaryDelayImport from './dictionary_delay_import.js'
import dictionaryComDescriptor from './dictionary_com_descriptor.js'

export default class WindowsImage {
    constructor(file) {
        this.file = file
    }

    async parse() {
        this.DOS = await headerDOS(this)
        this.NT = await headerNT(this, this.DOS.LfaNew)
        this.COFF = await headerCOFF(this, this.DOS.LfaNew + 4)
        this.PE = await headerPE(this, this.DOS.LfaNew + 24, this.COFF.SizeOfOptionalHeader)
        this.SECTION = await headerSection(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader + 24, this.COFF.NumberOfSections)
    }

    async offsetToView(offset, size) {
        let blob = this.file.slice(offset, offset + size)
        let buffer = await blob.arrayBuffer()
        return new DataView(buffer)
    }

    //
    // bufferToString(buffer, offset, max, wide) {
    //     //初始化
    //     let result
    //
    //     //检查宽字符
    //     if (wide) {
    //         result = new Uint16Array(buffer, offset, max * 2)
    //     } else {
    //         result = new Uint8Array(buffer, offset, max)
    //     }
    //
    //     //查找结束标记
    //     let end = result.indexOf(0)
    //     if (end >= 0) {
    //         result = result.subarray(0, end)
    //     }
    //
    //     //创建字符串
    //     return String.fromCharCode(...result)
    // }
    //
    // pointerToOffset(pointer) {
    //     for (let section of this.SECTION) {
    //         if (section.VirtualAddress <= pointer && section.VirtualAddress + section.VirtualSize > pointer) {
    //             return pointer - section.VirtualAddress + section.PointerToRawData
    //         }
    //     }
    //     throw Error('cannot convert pointer')
    // }
    //
    // async pointerToBuffer(pointer, size) {
    //     let offset = this.pointerToOffset(pointer)
    //     let blob = this.file.slice(offset, offset + size)
    //     return blob.arrayBuffer()
    // }
    //
    // async pointerToString(pointer, max, wide) {
    //     let buffer = await this.pointerToBuffer(pointer, wide ? max * 2 : max)
    //     return this.bufferToString(buffer, 0, max, wide)
    // }
}
// //读取目录
// for (let index = 0; index < 15; index++) {
//     //查询目录
//     let dictionary = result.PE.DICTIONARY[index]
//     //检查有效
//     if (dictionary.VritualAddress > 0) {
//         if (index === 0) {
//             //todo
//             result.EXPORT = await dictionaryExport(file, dictionary, result.SECTION)
//         } else if (index === 1) {
//             //todo
//             result.IMPORT = await dictionaryImport(file, dictionary, result.SECTION)
//         } else if (index === 2) {
//             //todo
//             result.RESOURCE = await dictionaryResource(file, dictionary, result.SECTION)
//         } else if (index === 3) {
//             //todo
//             result.EXCEPTION = await dictionaryException(file, dictionary, result.SECTION)
//         } else if (index === 4) {
//             //todo
//             result.SECURITY = await dictionarySecurity(file, dictionary, result.SECTION)
//         } else if (index === 5) {
//             //todo
//             result.BASE_RELOCATION = await dictionaryBaseRelocation(file, dictionary, result.SECTION)
//         } else if (index === 6) {
//             //todo
//             result.DEBUG = await dictionaryDebug(file, dictionary, result.SECTION)
//         } else if (index === 7) {
//             //todo
//             result.ARCHITECTURE = await dictionaryArchitecture(file, dictionary, result.SECTION)
//         } else if (index === 8) {
//             //todo
//             result.GLOBAL_POINTER = await dictionaryGlobalPointer(file, dictionary, result.SECTION)
//         } else if (index === 9) {
//             //todo
//             result.THREAD_LOCAL = await dictionaryThreadLocal(file, dictionary, result.SECTION)
//         } else if (index === 10) {
//             //todo
//             result.LOAD_CONFIG = await dictionaryLoadConfig(file, dictionary, result.SECTION)
//         } else if (index === 11) {
//             //todo
//             result.BOUND_IMPORT = await dictionaryBoundImport(file, dictionary, result.SECTION)
//         } else if (index === 12) {
//             //todo
//             result.IMPORT_ADDRESS = await dictionaryImportAddress(file, dictionary, result.SECTION)
//         } else if (index === 13) {
//             //todo
//             result.DELAY_IMPORT = await dictionaryDelayImport(file, dictionary, result.SECTION)
//         } else if (index === 14) {
//             //todo
//             result.COM_DESCRIPTOR = await dictionaryComDescriptor(file, dictionary, result.SECTION)
//         }
//     }
// }
// result.DICTIONARY = await headerDictionary(file, offset + 96, result.NumberOfRvaAndSizes)
// result.DICTIONARY = await headerDictionary(file, offset + 112, result.NumberOfRvaAndSizes)
