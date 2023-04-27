export async function parse_pe_load_config(parser, dictionary) {
    const view = await parser.pointerToView(dictionary.VritualAddress)
    const result = {}
    switch (parser.PE.Magic) {
        case 0x10B:
            result.Size = view.getUint32(0, true)
            result.TimeDateStamp = view.getUint32(4, true)
            result.MajorVersion = view.getUint16(8, true)
            result.MinorVersion = view.getUint16(10, true)
            result.GlobalFlagsClear = view.getUint32(12, true)
            result.GlobalFlagsSet = view.getUint32(16, true)
            result.CriticalSectionDefaultTimeout = view.getUint32(20, true)
            result.DeCommitFreeBlockThreshold = view.getUint32(24, true)
            result.DeCommitTotalFreeThreshold = view.getUint32(28, true)
            result.LockPrefixTable = view.getUint32(32, true)
            result.MaximumAllocationSize = view.getUint32(36, true)
            result.VirtualMemoryThreshold = view.getUint32(40, true)
            result.ProcessHeapFlags = view.getUint32(44, true)
            result.ProcessAffinityMask = view.getUint32(48, true)
            result.CSDVersion = view.getUint16(52, true)
            result.EditList = view.getUint32(56, true)
            result.SecurityCookie = view.getUint32(60, true)
            result.SEHandlerTable = view.getUint32(64, true)
            result.SEHandlerCount = view.getUint32(68, true)
            break
        case 0x20B:
            result.Size = view.getUint32(0, true)
            result.TimeDateStamp = view.getUint32(4, true)
            result.MajorVersion = view.getUint16(8, true)
            result.MinorVersion = view.getUint16(10, true)
            result.GlobalFlagsClear = view.getUint32(12, true)
            result.GlobalFlagsSet = view.getUint32(16, true)
            result.CriticalSectionDefaultTimeout = view.getUint32(20, true)
            result.DeCommitFreeBlockThreshold = view.getBigUint64(24, true)
            result.DeCommitTotalFreeThreshold = view.getBigUint64(32, true)
            result.LockPrefixTable = view.getBigUint64(40, true)
            result.MaximumAllocationSize = view.getBigUint64(48, true)
            result.VirtualMemoryThreshold = view.getBigUint64(56, true)
            result.ProcessAffinityMask = view.getBigUint64(64, true)
            result.ProcessHeapFlags = view.getUint32(72, true)
            result.CSDVersion = view.getUint16(76, true)
            result.EditList = view.getBigUint64(80, true)
            result.SecurityCookie = view.getBigUint64(88, true)
            result.SEHandlerTable = view.getBigUint64(96, true)
            result.SEHandlerCount = view.getBigUint64(104, true)
            break
    }
    return result
}
