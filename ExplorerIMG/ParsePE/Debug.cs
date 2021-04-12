
namespace ExplorerIMG.ParsePE
{
	partial class ParsePE
	{
		struct IMAGE_DEBUG_DIRECTORY
		{
			public uint Characteristics;
			public uint TimeDateStamp;
			public ushort MajorVersion;
			public ushort MinorVersion;
			public uint Type;
			public uint SizeOfData;
			public uint AddressOfRawData;
			public uint PointerToRawData;
		}

		class HeaderDebugType : ParseBaseDetails
		{
			public HeaderDebugType(string Name, uint Data) : base(Name, Data)
			{
				switch (Data)
				{
					case 0x01: mItemDesc = "通用对象文件格式"; break;
					case 0x02: mItemDesc = "CodeView格式"; break;
					case 0x03: mItemDesc = "框架指针省略格式"; break;
					case 0x04: mItemDesc = "其他格式"; break;
					case 0x05: mItemDesc = "异常格式"; break;
					case 0x06: mItemDesc = "混合格式"; break;
					case 0x07: mItemDesc = "IMAGE_DEBUG_TYPE_OMAP_TO_SRC"; break;
					case 0x08: mItemDesc = "IMAGE_DEBUG_TYPE_OMAP_FROM_SRC"; break;
					case 0x09: mItemDesc = "Borland格式"; break;
					case 0x0B: mItemDesc = "IMAGE_DEBUG_TYPE_CLSID"; break;
				}
			}
		}

		void ParseDirDebug()
		{
			IMAGE_DEBUG_DIRECTORY DebugDir;
			Read(out DebugDir, HeaderDir[6].RVA);

			mDetailsList.Add(new ParseBaseDetails("调试信息属性", DebugDir.Characteristics));
			mDetailsList.Add(new HeaderTimeStamp("调试信息生成时间", DebugDir.TimeDateStamp));
			mDetailsList.Add(new HeaderVersion("调试信息版本号", DebugDir.MajorVersion, DebugDir.MinorVersion));
			mDetailsList.Add(new HeaderDebugType("调试信息类型", DebugDir.Type));
			mDetailsList.Add(new HeaderLenght("调试信息长度", DebugDir.SizeOfData));
			mDetailsList.Add(new ParseBaseDetails("调试信息映射偏移", DebugDir.AddressOfRawData));
			mDetailsList.Add(new ParseBaseDetails("调试信息文件偏移", DebugDir.PointerToRawData));
		}
	}
}
