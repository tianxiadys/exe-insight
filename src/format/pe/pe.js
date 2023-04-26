import headerDOS from './01dos.js'
import headerNT from './02nt.js'
import headerCOFF from './03coff.js'
import headerPE from './04pe.js'
import headerDictionary from './05dictionary.js'
import headerSection from './06section.js'
import dictionaryExport from './00export.js'
import dictionaryImport from './01import.js'
import dictionaryResource from './02resource.js'
import dictionaryException from './03exception.js'
import dictionarySecurity from './04security.js'
import dictionaryBaseRelocation from './05base_relocation.js'
import dictionaryDebug from './06debug.js'
import dictionaryArchitecture from './07architecture.js'
import dictionaryGlobalPointer from './08global_pointer.js'
import dictionaryThreadLocal from './09thread_local.js'
import dictionaryLoadConfig from './10load_config.js'
import dictionaryBoundImport from './11bound_import.js'
import dictionaryComDescriptor from './14com_descriptor.js'

export default class WindowsImage {
    constructor(file) {
        this.file = file
    }

    async parse() {
        this.DOS = await headerDOS.parse(this)
        this.NT = await headerNT.parse(this, this.DOS.LfaNew)
        this.COFF = await headerCOFF.parse(this, this.DOS.LfaNew + 4)
        this.PE = await headerPE.parse(this, this.DOS.LfaNew + 24, this.COFF.SizeOfOptionalHeader)
        this.BITS = headerPE.parseBits(this.PE)
        this.DICTIONARY = await headerDictionary.parse(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader - this.PE.NumberOfRvaAndSizes * 8 + 24, this.PE.NumberOfRvaAndSizes)
        this.SECTION = await headerSection.parse(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader + 24, this.COFF.NumberOfSections)
        for (let dictionary of this.DICTIONARY) {
            switch (dictionary.Index) {
                case 0:
                    this.EXPORT = await dictionaryExport.parse(this, dictionary)
                    break
                case 1:
                    this.IMPORT = await dictionaryImport.parseNormal(this, dictionary)
                    break
                case 2:
                    this.RESOURCE = await dictionaryResource.parse(this, dictionary, 0)
                    break
                case 3:
                    this.EXCEPTION = await dictionaryException.parse(this, dictionary)
                    break
                case 4:
                    this.SECURITY = await dictionarySecurity.parse(this, dictionary)
                    break
                case 5:
                    this.BASE_RELOCATION = await dictionaryBaseRelocation.parse(this, dictionary)
                    break
                case 6:
                    this.DEBUG = await dictionaryDebug.parse(this, dictionary)
                    break
                case 7:
                    this.ARCHITECTURE = await dictionaryArchitecture.parse(this, dictionary)
                    break
                case 8:
                    this.GLOBAL_POINTER = await dictionaryGlobalPointer.parse(this, dictionary)
                    break
                case 9:
                    this.THREAD_LOCAL = await dictionaryThreadLocal.parse(this, dictionary)
                    break
                case 10:
                    this.LOAD_CONFIG = await dictionaryLoadConfig.parse(this, dictionary)
                    break
                case 11:
                    this.BOUND_IMPORT = await dictionaryBoundImport.parse(this, dictionary)
                    break
                //case 12 IAT表包含在IMPORT表中，无法独立存在
                case 13:
                    this.DELAY_IMPORT = await dictionaryImport.parseDelay(this, dictionary)
                    break
                case 14:
                    this.COM_DESCRIPTOR = await dictionaryComDescriptor.parse(this, dictionary)
                    break
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
        throw 'pointer out of bound'
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
