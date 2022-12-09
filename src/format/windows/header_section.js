export default async function(windows, offset, count) {
    //初始化
    let sectionList = []
    //循环读取
    for (let index = 0; index < count; index++) {
        //初始化
        let view = await windows.offsetToView(offset + index * 40, 40)
        let section = {}
        //读取结构
        section.Name = windows.viewToString(view, 0, 8, false)
        section.VirtualSize = view.getUint32(8, true)
        section.VirtualAddress = view.getUint32(12, true)
        section.SizeOfRawData = view.getUint32(16, true)
        section.PointerToRawData = view.getUint32(20, true)
        section.PointerToRelocations = view.getUint32(24, true)
        section.PointerToLinenumbers = view.getUint16(28, true)
        section.NumberOfRelocations = view.getUint16(32, true)
        section.NumberOfLinenumbers = view.getUint16(34, true)
        section.Characteristics = view.getUint32(36, true)
        //添加到结果数组
        sectionList.push(section)
    }
    //返回
    return sectionList
}
