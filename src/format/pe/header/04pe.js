export async function parsePE(parser, DOS) {
    const view = await parser.offsetToView(DOS.LfaNew + 24, 112)
    const header = {}
    header.Magic = view.getUint16(0, true)
    header.MajorLinkerVersion = view.getUint8(2)
    header.MinorLinkerVersion = view.getUint8(3)
    header.SizeOfCode = view.getUint32(4, true)
    header.SizeOfInitializedData = view.getUint32(8, true)
    header.SizeOfUninitializedData = view.getUint32(12, true)
    header.AddressOfEntryPoint = view.getUint32(16, true)
    header.BaseOfCode = view.getUint32(20, true)
    header.SectionAlignment = view.getUint32(32, true)
    header.FileAlignment = view.getUint32(36, true)
    header.MajorOperatingSystemVersion = view.getUint16(40, true)
    header.MinorOperatingSystemVersion = view.getUint16(42, true)
    header.MajorImageVersion = view.getUint16(44, true)
    header.MinorImageVersion = view.getUint16(46, true)
    header.MajorSubsystemVersion = view.getUint16(48, true)
    header.MinorSubsystemVersion = view.getUint16(50, true)
    header.Win32VersionValue = view.getUint32(52, true)
    header.SizeOfImage = view.getUint32(56, true)
    header.SizeOfHeaders = view.getUint32(60, true)
    header.CheckSum = view.getUint32(64, true)
    header.Subsystem = view.getUint16(68, true)
    header.DllCharacteristics = view.getUint16(70, true)
    if (header.Magic === 0x10B) {
        header.BaseOfData = view.getUint32(24, true)
        header.ImageBase = view.getUint32(28, true)
        header.SizeOfStackReserve = view.getUint32(72, true)
        header.SizeOfStackCommit = view.getUint32(76, true)
        header.SizeOfHeapReserve = view.getUint32(80, true)
        header.SizeOfHeapCommit = view.getUint32(84, true)
        header.LoaderFlags = view.getUint32(88, true)
        header.NumberOfRvaAndSizes = view.getUint32(92, true)
        header.OffsetDictionary = 120
    } else if (header.Magic === 0x20B) {
        header.ImageBase = view.getBigUint64(24, true)
        header.SizeOfStackReserve = view.getBigUint64(72, true)
        header.SizeOfStackCommit = view.getBigUint64(80, true)
        header.SizeOfHeapReserve = view.getBigUint64(88, true)
        header.SizeOfHeapCommit = view.getBigUint64(96, true)
        header.LoaderFlags = view.getUint32(104, true)
        header.NumberOfRvaAndSizes = view.getUint32(108, true)
        header.OffsetDictionary = 136
    } else {
        throw 'unknown pe type'
    }
    return header
}
