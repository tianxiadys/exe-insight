
namespace ExplorerIMG.ParsePE
{
	partial class ParsePE
	{
		class HeaderMachine : ParseBaseDetails
		{
			public HeaderMachine(string Name, ushort Data) : base(Name, Data)
			{
				switch (Data)
				{
					case 0x014C: mItemDesc = "I386(Intel x86)"; break;
					case 0x0200: mItemDesc = "IA64(Intel 64)"; break;
					case 0x8664: mItemDesc = "AMD64(x86_64)"; break;
					case 0x01C0: mItemDesc = "ARM(Littel-Endian)"; break;
				}
			}
		}

		class HeaderVersion : ParseBaseDetails
		{
			public HeaderVersion(string Name, ushort Data1, ushort Data2)
				: base(Name, (uint)((Data1 << 16) | Data2))
			{
				mItemDesc = string.Format("Ver: {0:D}.{1:D}", Data1, Data2);
			}
		}

		class HeaderOptMagic : ParseBaseDetails
		{
			public HeaderOptMagic(string Name, ushort Data) : base(Name, Data)
			{
				if (Data == IMAGE_NT_OPTIONAL_HDR32_MAGIC)
					mItemDesc = "32位映像头部";
				else if (Data == IMAGE_NT_OPTIONAL_HDR64_MAGIC)
					mItemDesc = "64位映像头部";
			}
		}

		class HeaderSubSystem : ParseBaseDetails
		{
			public HeaderSubSystem(string Name, ushort Data) : base(Name, Data)
			{
				switch (Data)
				{
					case 0x01: mItemDesc = "Native(驱动程序)"; break;
					case 0x02: mItemDesc = "Windows_GUI(窗口程序)"; break;
					case 0x03: mItemDesc = "Windows_CUI(控制台程序)"; break;
					case 0x05: mItemDesc = "OS2_CUI(OS2控制台程序)"; break;
					case 0x07: mItemDesc = "POSIX_CUI(POSIX控制台程序)"; break;
					case 0x08: mItemDesc = "Win9xNative(Win9x驱动程序)"; break;
					case 0x09: mItemDesc = "Windows_CE_GUI(CE窗口程序)"; break;
					case 0x0A: mItemDesc = "EFI_Application(EFI应用程序)"; break;
					case 0x0B: mItemDesc = "EFI_Service_Driver(EFI服务驱动程序)"; break;
					case 0x0C: mItemDesc = "EFI_Runtime_Driver(EFI运行时驱动程序)"; break;
					case 0x0D: mItemDesc = "EFI_ROM(EFI固件)"; break;
					case 0x0E: mItemDesc = "XBOX_Application(XBOX应用程序)"; break;
					case 0x10: mItemDesc = "Boot_Application(引导程序)"; break;
				}
			}
		}

		class HeaderFlagA : ParseBaseDetails
		{
			public HeaderFlagA(string Name, ushort Data) : base(Name, Data)
			{
				// IMAGE_FILE_RELOCS_STRIPPED
				if ((Data & 0x0001) != 0) mItemDesc += "[重定位剥离] ";
				// IMAGE_FILE_EXECUTABLE_IMAGE
				if ((Data & 0x0002) != 0) mItemDesc += "[可执行] ";
				// IMAGE_FILE_LARGE_ADDRESS_AWARE
				if ((Data & 0x0020) != 0) mItemDesc += "[大地址感知] ";
				// IMAGE_FILE_32BIT_MACHINE
				if ((Data & 0x0100) != 0) mItemDesc += "[32位] ";
				// IMAGE_FILE_DEBUG_STRIPPED
				if ((Data & 0x0200) != 0) mItemDesc += "[无调试信息] ";
				// IMAGE_FILE_REMOVABLE_RUN_FROM_SWAP
				if ((Data & 0x0400) != 0) mItemDesc += "[移动缓存执行] ";
				// IMAGE_FILE_NET_RUN_FROM_SWAP
				if ((Data & 0x0800) != 0) mItemDesc += "[网络缓存执行] ";
				// IMAGE_FILE_SYSTEM
				if ((Data & 0x1000) != 0) mItemDesc += "[系统文件] ";
				// IMAGE_FILE_DLL
				if ((Data & 0x2000) != 0) mItemDesc += "[动态链接库] ";
				// IMAGE_FILE_UP_SYSTEM_ONLY
				if ((Data & 0x4000) != 0) mItemDesc += "[禁止多处理器] ";
			}
		}

		class HeaderFlagB : ParseBaseDetails
		{
			public HeaderFlagB(string Name, ushort Data) : base(Name, Data)
			{
				// IMAGE_DLLCHARACTERISTICS_HIGH_ENTROPY_VA
				if ((Data & 0x0020) != 0) mItemDesc += "[高熵ASLR] ";
				// IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE
				if ((Data & 0x0040) != 0) mItemDesc += "[可重定位] ";
				// IMAGE_DLLCHARACTERISTICS_FORCE_INTEGRITY
				if ((Data & 0x0080) != 0) mItemDesc += "[强制完整性检查] ";
				// IMAGE_DLLCHARACTERISTICS_NX_COMPAT
				if ((Data & 0x0100) != 0) mItemDesc += "[兼容DEP] ";
				// IMAGE_DLLCHARACTERISTICS_NO_ISOLATION
				if ((Data & 0x0200) != 0) mItemDesc += "[禁止隔离] ";
				// IMAGE_DLLCHARACTERISTICS_NO_SEH
				if ((Data & 0x0400) != 0) mItemDesc += "[禁止SEH] ";
				// IMAGE_DLLCHARACTERISTICS_NO_BIND
				if ((Data & 0x0800) != 0) mItemDesc += "[禁止绑定] ";
				// IMAGE_DLLCHARACTERISTICS_APPCONTAINER
				if ((Data & 0x1000) != 0) mItemDesc += "[AppContainer] ";
				// IMAGE_DLLCHARACTERISTICS_WDM_DRIVER
				if ((Data & 0x2000) != 0) mItemDesc += "[WDM驱动] ";
				// IMAGE_DLLCHARACTERISTICS_GUARD_CF
				if ((Data & 0x4000) != 0) mItemDesc += "[执行流保护] ";
				// IMAGE_DLLCHARACTERISTICS_TERMINAL_SERVER_AWARE
				if ((Data & 0x8000) != 0) mItemDesc += "[终端服务感知] ";
			}
		}

		void ParseHeadersDetails()
		{
			mDetailsList.Add(new HeaderMachine("映像体系结构", HeaderFile.Machine));
			mDetailsList.Add(new ParseBaseDetails("数据节数量", HeaderFile.NumberOfSections));
			mDetailsList.Add(new HeaderTimeStamp("映像编译时间戳", HeaderFile.TimeDateStamp));
			mDetailsList.Add(new ParseBaseDetails("调试符号RVA", HeaderFile.PointerToSymbolTable));
			mDetailsList.Add(new ParseBaseDetails("调试符号数量", HeaderFile.NumberOfSymbols));
			mDetailsList.Add(new HeaderLenght("可选头部长度", HeaderFile.SizeOfOptionalHeader));
			mDetailsList.Add(new HeaderFlagA("映像属性A", HeaderFile.Characteristics));

			mDetailsList.Add(new HeaderOptMagic("可选头部类型", HeaderOpt32.Magic));
			mDetailsList.Add(new HeaderVersion("链接器版本号", HeaderOpt32.MajorLinkerVersion, HeaderOpt32.MinorLinkerVersion));
			mDetailsList.Add(new HeaderLenght("代码长度", HeaderOpt32.SizeOfCode));
			mDetailsList.Add(new HeaderLenght("初始化数据长度", HeaderOpt32.SizeOfInitializedData));
			mDetailsList.Add(new HeaderLenght("未初始化数据长度", HeaderOpt32.SizeOfUninitializedData));
			mDetailsList.Add(new ParseBaseDetails("程序入口RVA", HeaderOpt32.AddressOfEntryPoint));
			mDetailsList.Add(new ParseBaseDetails("代码基址RVA", HeaderOpt32.BaseOfCode));

			if (ImageBits == 32)
			{
				mDetailsList.Add(new ParseBaseDetails("数据基址RVA", HeaderOpt32.BaseOfData));
				mDetailsList.Add(new ParseBaseDetails("映像基址", HeaderOpt32.ImageBase));
			}
			else mDetailsList.Add(new ParseBaseDetails("映像基址", HeaderOpt64.ImageBase));

			mDetailsList.Add(new HeaderLenght("数据节对齐倍数", HeaderOpt32.SectionAlignment));
			mDetailsList.Add(new HeaderLenght("文件节对齐倍数", HeaderOpt32.FileAlignment));
			mDetailsList.Add(new HeaderVersion("操作系统版本号", HeaderOpt32.MajorOperatingSystemVersion, HeaderOpt32.MinorOperatingSystemVersion));
			mDetailsList.Add(new HeaderVersion("映像版本号", HeaderOpt32.MajorImageVersion, HeaderOpt32.MinorImageVersion));
			mDetailsList.Add(new HeaderVersion("子系统版本号", HeaderOpt32.MajorSubsystemVersion, HeaderOpt32.MinorSubsystemVersion));
			mDetailsList.Add(new ParseBaseDetails("Win32系统版本号", HeaderOpt32.Win32VersionValue));
			mDetailsList.Add(new HeaderLenght("映射长度", HeaderOpt32.SizeOfImage));
			mDetailsList.Add(new HeaderLenght("头部长度", HeaderOpt32.SizeOfHeaders));
			mDetailsList.Add(new ParseBaseDetails("映像校验和", HeaderOpt32.CheckSum));
			mDetailsList.Add(new HeaderSubSystem("映像子系统", HeaderOpt32.Subsystem));
			mDetailsList.Add(new HeaderFlagB("映像属性B", HeaderOpt32.DllCharacteristics));

			if (ImageBits == 32)
			{
				mDetailsList.Add(new HeaderLenght("栈初始分配长度", HeaderOpt32.SizeOfStackReserve));
				mDetailsList.Add(new HeaderLenght("栈增长粒度", HeaderOpt32.SizeOfStackCommit));
				mDetailsList.Add(new HeaderLenght("堆初始分配长度", HeaderOpt32.SizeOfHeapReserve));
				mDetailsList.Add(new HeaderLenght("堆增长粒度", HeaderOpt32.SizeOfHeapCommit));
				mDetailsList.Add(new ParseBaseDetails("载入选项", HeaderOpt32.LoaderFlags));
				mDetailsList.Add(new ParseBaseDetails("数据目录数量", HeaderOpt32.NumberOfRvaAndSizes));
			}
			else
			{
				mDetailsList.Add(new HeaderLenght("栈初始分配长度", HeaderOpt64.SizeOfStackReserve));
				mDetailsList.Add(new HeaderLenght("栈增长粒度", HeaderOpt64.SizeOfStackCommit));
				mDetailsList.Add(new HeaderLenght("堆初始分配长度", HeaderOpt64.SizeOfHeapReserve));
				mDetailsList.Add(new HeaderLenght("堆增长粒度", HeaderOpt64.SizeOfHeapCommit));
				mDetailsList.Add(new ParseBaseDetails("载入选项", HeaderOpt64.LoaderFlags));
				mDetailsList.Add(new ParseBaseDetails("数据目录数量", HeaderOpt64.NumberOfRvaAndSizes));
			}
		}
	}
}
