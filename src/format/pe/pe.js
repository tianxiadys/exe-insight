import { parse_dos } from './header/01dos.js'
import { parse_nt } from './header/02nt.js'
import { parse_coff } from './header/03coff.js'
import { parse_pe } from './header/04pe.js'
import { parse_dictionary } from './header/05dictionary.js'
import { parse_section } from './header/06section.js'
import { parse_export } from './dictionary/00export.js'
import { parse_resource } from './dictionary/02resource.js'
import { parse_pe_debug } from './dictionary/06debug.js'
import { parse_pe_thread_local } from './dictionary/09thread_local.js'
import { parse_pe_load_config } from './dictionary/10load_config.js'
import { parse_pe_bound_import } from './dictionary/11bound_import.js'

export class ParserPE {
    async parse(file) {
        this.FILE = file
        this.DOS = await parse_dos(this)
        this.NT = await parse_nt(this, this.DOS.LfaNew)
        this.COFF = await parse_coff(this, this.DOS.LfaNew + 4)
        this.PE = await parse_pe(this, this.DOS.LfaNew + 24, this.COFF.SizeOfOptionalHeader)
        this.DICTIONARY = await parse_dictionary(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader - this.PE.NumberOfRvaAndSizes * 8 + 24, this.PE.NumberOfRvaAndSizes)
        this.SECTION = await parse_section(this, this.DOS.LfaNew + this.COFF.SizeOfOptionalHeader + 24, this.COFF.NumberOfSections)
        for (const dictionary of this.DICTIONARY) {
            switch (dictionary.Index) {
                case 0:
                    this.EXPORT = await parse_export(this, dictionary)
                    break
                // case 1:
                //     this.IMPORT = await parse_pe_import(this, dictionary)
                //     break
                case 2:
                    this.RESOURCE = await parse_resource(this, dictionary, 0)
                    break
                // case 3:
                //     this.EXCEPTION = await dictionaryException.parse(this, dictionary)
                //     break
                // case 4:
                //     this.SECURITY = await dictionarySecurity.parse(this, dictionary)
                //     break
                // case 5:
                //     this.BASE_RELOCATION = await dictionaryBaseRelocation.parse(this, dictionary)
                //     break
                case 6:
                    this.DEBUG = await parse_pe_debug(this, dictionary)
                    break
                // case 7:
                //     this.ARCHITECTURE = await dictionaryArchitecture.parse(this, dictionary)
                //     break
                // case 8:
                //     this.GLOBAL_POINTER = await dictionaryGlobalPointer.parse(this, dictionary)
                //     break
                case 9:
                    this.THREAD_LOCAL = await parse_pe_thread_local(this, dictionary)
                    break
                case 10:
                    this.LOAD_CONFIG = await parse_pe_load_config(this, dictionary)
                    break
                case 11:
                    this.BOUND_IMPORT = await parse_pe_bound_import(this, dictionary)
                    break
                // case 13:
                //     this.DELAY_IMPORT = await dictionaryImport.parseDelay(this, dictionary)
                //     break
                // case 14:
                //     this.COM_DESCRIPTOR = await dictionaryComDescriptor.parse(this, dictionary)
                //     break
            }
        }
    }

    bufferToString(buffer, wide, offset, size) {
        let part
        if (wide) {
            part = new Uint16Array(buffer, offset, size)
        } else {
            part = new Uint8Array(buffer, offset, size)
        }
        const end = part.indexOf(0)
        if (end >= 0) {
            part = part.subarray(0, end)
        }
        return String.fromCharCode(...part)
    }

    async offsetToBuffer(offset, size) {
        const blob = this.FILE.slice(offset, offset + size)
        return blob.arrayBuffer()
    }

    async offsetToView(offset, size) {
        const buffer = await this.offsetToBuffer(offset, size)
        return new DataView(buffer)
    }

    async pointerToSection(pointer) {
        for (const section of this.SECTION) {
            if (section.VirtualAddress <= pointer && section.VirtualAddress + section.VirtualSize > pointer) {
                if (!section.BUFFER) {
                    section.BUFFER = await this.offsetToBuffer(section.PointerToRawData, section.SizeOfRawData)
                }
                return section
            }
        }
        throw 'pointer out of bound'
    }

    async pointerToView(pointer) {
        const section = await this.pointerToSection(pointer)
        return new DataView(section.BUFFER, pointer - section.VirtualAddress)
    }

    async pointerToString(pointer, wide, size) {
        const section = await this.pointerToSection(pointer)
        return this.bufferToString(section.BUFFER, wide, pointer - section.VirtualAddress, size)
    }
}
