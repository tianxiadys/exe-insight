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
        this.DICTIONARY = await headerDictionary(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader - this.PE.NumberOfRvaAndSizes * 8 + 24, this.PE.NumberOfRvaAndSizes)
        this.SECTION = await headerSection(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader + 24, this.COFF.NumberOfSections)
        for (let dictionary of this.DICTIONARY) {
            if (dictionary.VritualAddress > 0) {
                if (dictionary.Index === 0) {
                    this.EXPORT = await dictionaryExport(this, dictionary)
                } else if (dictionary.Index === 1) {
                    this.IMPORT = await dictionaryImport(this, dictionary)
                } else if (dictionary.Index === 2) {
                    this.RESOURCE = await dictionaryResource(this, dictionary)
                } else if (dictionary.Index === 3) {
                    this.EXCEPTION = await dictionaryException(this, dictionary)
                } else if (dictionary.Index === 4) {
                    this.SECURITY = await dictionarySecurity(this, dictionary)
                } else if (dictionary.Index === 5) {
                    this.BASE_RELOCATION = await dictionaryBaseRelocation(this, dictionary)
                } else if (dictionary.Index === 6) {
                    this.DEBUG = await dictionaryDebug(this, dictionary)
                } else if (dictionary.Index === 7) {
                    this.ARCHITECTURE = await dictionaryArchitecture(this, dictionary)
                } else if (dictionary.Index === 8) {
                    this.GLOBAL_POINTER = await dictionaryGlobalPointer(this, dictionary)
                } else if (dictionary.Index === 9) {
                    this.THREAD_LOCAL = await dictionaryThreadLocal(this, dictionary)
                } else if (dictionary.Index === 10) {
                    this.LOAD_CONFIG = await dictionaryLoadConfig(this, dictionary)
                } else if (dictionary.Index === 11) {
                    this.BOUND_IMPORT = await dictionaryBoundImport(this, dictionary)
                } else if (dictionary.Index === 12) {
                    this.IMPORT_ADDRESS = await dictionaryImportAddress(this, dictionary)
                } else if (dictionary.Index === 13) {
                    this.DELAY_IMPORT = await dictionaryDelayImport(this, dictionary)
                } else if (dictionary.Index === 14) {
                    this.COM_DESCRIPTOR = await dictionaryComDescriptor(this, dictionary)
                }
            }
        }
    }

    bufferToString(buffer, wide, offset, max) {
        let result
        if (wide) {
            result = new Uint16Array(buffer, offset, max)
        } else {
            result = new Uint8Array(buffer, offset, max)
        }
        let end = result.indexOf(0)
        if (end >= 0) {
            result = result.subarray(0, end)
        }
        return String.fromCharCode(...result)
    }

    async offsetToBuffer(offset, size) {
        let blob = this.file.slice(offset, offset + size)
        return blob.arrayBuffer()
    }

    async offsetToView(offset, size) {
        let buffer = await this.offsetToBuffer(offset, size)
        return new DataView(buffer)
    }

    async pointerToSection(pointer) {
        for (let section of this.SECTION) {
            if (section.VirtualAddress <= pointer && section.VirtualAddress + section.VirtualSize > pointer) {
                if (!section.BUFFER) {
                    section.BUFFER = await this.offsetToBuffer(section.PointerToRawData, section.SizeOfRawData)
                }
                return section
            }
        }
        throw Error('section error')
    }

    async pointerToView(pointer, size) {
        let section = await this.pointerToSection(pointer)
        return new DataView(section.BUFFER, pointer - section.VirtualAddress, size)
    }

    async pointerToString(pointer, wide, max) {
        let section = await this.pointerToSection(pointer)
        return this.bufferToString(section.BUFFER, wide, pointer - section.VirtualAddress, max)
    }
}
