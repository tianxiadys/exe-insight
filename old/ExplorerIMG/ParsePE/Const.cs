// IMAGE_DIRECTORY_ENTRY
// 0 EXPORT				@Export.cs	 导出表
// 1 IMPORT				@Import.cs	 导入表
// 2 RESOURCE			@Resource.cs 映像资源
// 3 EXCEPTION			 Exception Directory
// 4 SECURITY			 Security Directory
// 5 BASERELOC			#无需处理	 重定位地址表
// 6 DEBUG				@Headers.cs	 调试选项
// 7 ARCHITECTURE		 Architecture Specific Data
// 8 GLOBALPTR			@Headers.cs	 全局指针
// 9 TLS				@Headers.cs	 线程本地存储
// A LOAD_CONFIG		@Headers.cs	 载入选项
// B BOUND_IMPORT		#废弃		 绑定表
// C IAT				#无需处理	 导入地址表
// D DELAY_IMPORT		@Import.cs	 延迟导入表
// E COM_DESCRIPTOR		 COM Runtime descriptor

namespace ExplorerIMG.ParsePE
{
	partial class ParsePE
	{
		const ushort IMAGE_NT_OPTIONAL_HDR32_MAGIC = 0x10B;
		const ushort IMAGE_NT_OPTIONAL_HDR64_MAGIC = 0x20B;
	}

	struct IMAGE_FILE_HEADER
	{
		public ushort Machine;
		public ushort NumberOfSections;
		public uint TimeDateStamp;
		public uint PointerToSymbolTable;
		public uint NumberOfSymbols;
		public ushort SizeOfOptionalHeader;
		public ushort Characteristics;
	}

	struct IMAGE_OPTIONAL_HEADER32
	{
		public ushort Magic;
		public byte MajorLinkerVersion;
		public byte MinorLinkerVersion;
		public uint SizeOfCode;
		public uint SizeOfInitializedData;
		public uint SizeOfUninitializedData;
		public uint AddressOfEntryPoint;
		public uint BaseOfCode;
		public uint BaseOfData;

		public uint ImageBase;
		public uint SectionAlignment;
		public uint FileAlignment;
		public ushort MajorOperatingSystemVersion;
		public ushort MinorOperatingSystemVersion;
		public ushort MajorImageVersion;
		public ushort MinorImageVersion;
		public ushort MajorSubsystemVersion;
		public ushort MinorSubsystemVersion;
		public uint Win32VersionValue;
		public uint SizeOfImage;
		public uint SizeOfHeaders;
		public uint CheckSum;
		public ushort Subsystem;
		public ushort DllCharacteristics;
		public uint SizeOfStackReserve;
		public uint SizeOfStackCommit;
		public uint SizeOfHeapReserve;
		public uint SizeOfHeapCommit;
		public uint LoaderFlags;
		public uint NumberOfRvaAndSizes;
	}

	struct IMAGE_OPTIONAL_HEADER64
	{
		public ushort Magic;
		public byte MajorLinkerVersion;
		public byte MinorLinkerVersion;
		public uint SizeOfCode;
		public uint SizeOfInitializedData;
		public uint SizeOfUninitializedData;
		public uint AddressOfEntryPoint;
		public uint BaseOfCode;

		public ulong ImageBase;
		public uint SectionAlignment;
		public uint FileAlignment;
		public ushort MajorOperatingSystemVersion;
		public ushort MinorOperatingSystemVersion;
		public ushort MajorImageVersion;
		public ushort MinorImageVersion;
		public ushort MajorSubsystemVersion;
		public ushort MinorSubsystemVersion;
		public uint Win32VersionValue;
		public uint SizeOfImage;
		public uint SizeOfHeaders;
		public uint CheckSum;
		public ushort Subsystem;
		public ushort DllCharacteristics;
		public ulong SizeOfStackReserve;
		public ulong SizeOfStackCommit;
		public ulong SizeOfHeapReserve;
		public ulong SizeOfHeapCommit;
		public uint LoaderFlags;
		public uint NumberOfRvaAndSizes;
	}

	struct IMAGE_DATA_DIRECTORY
	{
		public uint RVA;
		public uint Size;
	}

	struct IMAGE_SECTION_HEADER
	{
		public ulong NameLong; // char[8]
		public uint VirtualSize;
		public uint VirtualAddress;
		public uint SizeOfRawData;
		public uint PointerToRawData;
		public uint PointerToRelocations;
		public uint PointerToLinenumbers;
		public ushort NumberOfRelocations;
		public ushort NumberOfLinenumbers;
		public uint Characteristics;
	}
}