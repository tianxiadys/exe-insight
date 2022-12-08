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
            //检查有效
            if (dictionary.VritualAddress > 0) {
                if (index === 0) {
                    //todo
                    result.EXPORT = await dictionaryExport(file, dictionary, result.SECTION)
                } else if (index === 1) {
                    //todo
                    result.IMPORT = await dictionaryImport(file, dictionary, result.SECTION)
                } else if (index === 2) {
                    //todo
                    result.RESOURCE = await dictionaryResource(file, dictionary, result.SECTION)
                } else if (index === 3) {
                    //todo
                    result.EXCEPTION = await dictionaryException(file, dictionary, result.SECTION)
                } else if (index === 4) {
                    //todo
                    result.SECURITY = await dictionarySecurity(file, dictionary, result.SECTION)
                } else if (index === 5) {
                    //todo
                    result.BASE_RELOCATION = await dictionaryBaseRelocation(file, dictionary, result.SECTION)
                } else if (index === 6) {
                    //todo
                    result.DEBUG = await dictionaryDebug(file, dictionary, result.SECTION)
                } else if (index === 7) {
                    //todo
                    result.ARCHITECTURE = await dictionaryArchitecture(file, dictionary, result.SECTION)
                } else if (index === 8) {
                    //todo
                    result.GLOBAL_POINTER = await dictionaryGlobalPointer(file, dictionary, result.SECTION)
                } else if (index === 9) {
                    //todo
                    result.THREAD_LOCAL = await dictionaryThreadLocal(file, dictionary, result.SECTION)
                } else if (index === 10) {
                    //todo
                    result.LOAD_CONFIG = await dictionaryLoadConfig(file, dictionary, result.SECTION)
                } else if (index === 11) {
                    //todo
                    result.BOUND_IMPORT = await dictionaryBoundImport(file, dictionary, result.SECTION)
                } else if (index === 12) {
                    //todo
                    result.IMPORT_ADDRESS = await dictionaryImportAddress(file, dictionary, result.SECTION)
                } else if (index === 13) {
                    //todo
                    result.DELAY_IMPORT = await dictionaryDelayImport(file, dictionary, result.SECTION)
                } else if (index === 14) {
                    //todo
                    result.COM_DESCRIPTOR = await dictionaryComDescriptor(file, dictionary, result.SECTION)
                }
            }
        }
    } else {
        throw Error('not a pe file')
    }
    //返回
    return result
}
