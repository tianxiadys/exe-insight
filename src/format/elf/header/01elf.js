export async function parse_elf_elf(parser) {
    const view = await parser.offsetToView(0, 64)
    const result = {}
    result.ei_magic = view.getUint32(0, true)
    result.ei_class = view.getUint8(4)
    result.ei_date = view.getUint8(5)
    result.e_type = view.getUint16(16, true)
    result.e_machine = view.getUint16(18, true)
    result.e_version = view.getUint32(20, true)
    result.e_entry = view.getUint32(24, true)
    result.e_phoff = view.getUint32(28, true)
    result.e_shoff = view.getUint32(32, true)
    result.e_flags = view.getUint32(36, true)
    result.e_ehsize = view.getUint16(40, true)
    result.e_phentsize = view.getUint16(42, true)
    result.e_phnum = view.getUint16(44, true)
    result.e_shentsize = view.getUint16(46, true)
    result.e_shnum = view.getUint16(48, true)
    result.e_shstrndx = view.getUint16(50, true)
    return result
}
