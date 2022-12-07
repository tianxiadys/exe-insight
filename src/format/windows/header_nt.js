import { headerCOFF } from './header_coff.js'
import { headerPE } from './header_pe.js'
import { headerSection } from './header_section.js'
import { dictionaryExport } from './dictionary_export.js'
import { dictionaryImport } from './dictionary_import.js'
import { dictionaryResource } from './dictionary_resource.js'
import { dictionaryException } from './dictionary_exception.js'
import { dictionarySecurity } from './dictionary_security.js'
import { dictionaryBaseRelocation } from './dictionary_base_relocation.js'
import { dictionaryDebug } from './dictionary_debug.js'
import { dictionaryArchitecture } from './dictionary_architecture.js'
import { dictionaryGlobalPointer } from './dictionary_global_pointer.js'
import { dictionaryThreadLocal } from './dictionary_thread_local.js'
import { dictionaryLoadConfig } from './dictionary_load_config.js'
import { dictionaryBoundImport } from './dictionary_bound_import.js'
import { dictionaryImportAddress } from './dictionary_import_address.js'
import { dictionaryDelayImport } from './dictionary_delay_import.js'
import { dictionaryComDescriptor } from './dictionary_com_descriptor.js'

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
        //构造头
        result.COFF = await headerCOFF(file, offset + 4)
        result.PE = await headerPE(file, offset + 24, result.COFF.SizeOfOptionalHeader)
        result.SECTION = await headerSection(file, offset + result.COFF.SizeOfOptionalHeader + 24, result.COFF.NumberOfSections)
        //读取目录
        for (let index = 0; index < 15; index++) {
            //查询目录
            let dictionary = result.PE.DICTIONARY[index]
            let offset = result.SECTION.translate(dictionary.VritualAddress)
            //读取目录
            if (index === 0) {
                result.EXPORT = dictionaryExport(file, dictionary, offset)
            } else if (index === 1) {
                result.IMPORT = dictionaryImport(file, dictionary, offset)
            } else if (index === 2) {
                result.RESOURCE = dictionaryResource(file, dictionary, offset)
            } else if (index === 3) {
                result.EXCEPTION = dictionaryException(file, dictionary, offset)
            } else if (index === 4) {
                result.SECURITY = dictionarySecurity(file, dictionary, offset)
            } else if (index === 5) {
                result.BASE_RELOCATION = dictionaryBaseRelocation(file, dictionary, offset)
            } else if (index === 6) {
                result.DEBUG = dictionaryDebug(file, dictionary, offset)
            } else if (index === 7) {
                result.ARCHITECTURE = dictionaryArchitecture(file, dictionary, offset)
            } else if (index === 8) {
                result.GLOBAL_POINTER = dictionaryGlobalPointer(file, dictionary, offset)
            } else if (index === 9) {
                result.THREAD_LOCAL = dictionaryThreadLocal(file, dictionary, offset)
            } else if (index === 10) {
                result.LOAD_CONFIG = dictionaryLoadConfig(file, dictionary, offset)
            } else if (index === 11) {
                result.BOUND_IMPORT = dictionaryBoundImport(file, dictionary, offset)
            } else if (index === 12) {
                result.IMPORT_ADDRESS = dictionaryImportAddress(file, dictionary, offset)
            } else if (index === 13) {
                result.DELAY_IMPORT = dictionaryDelayImport(file, dictionary, offset)
            } else if (index === 14) {
                result.COM_DESCRIPTOR = dictionaryComDescriptor(file, dictionary, offset)
            }
        }
    } else {
        throw Error('not a pe file')
    }
    //返回
    return result
}
