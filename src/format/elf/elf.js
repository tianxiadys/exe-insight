import { parse_elf_elf } from './header/01elf.js'

export class ParserELF {
    async parse(file) {
        this.FILE = file
        this.ELF = await parse_elf_elf(this)
    }

    async offsetToBuffer(offset, size) {
        const blob = this.FILE.slice(offset, offset + size)
        return blob.arrayBuffer()
    }

    async offsetToView(offset, size) {
        const buffer = await this.offsetToBuffer(offset, size)
        return new DataView(buffer)
    }
}
