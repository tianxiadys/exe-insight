
namespace ExplorerIMG.ParsePE
{
	partial class ParsePE
	{
		struct IMAGE_LOAD_CONFIG_DIRECTORY32
		{
			public uint Size;
			public uint TimeDateStamp;
			public ushort MajorVersion;
			public ushort MinorVersion;
			public uint GlobalFlagsClear;
			public uint GlobalFlagsSet;
			public uint CriticalSectionDefaultTimeout;
			public uint DeCommitFreeBlockThreshold;
			public uint DeCommitTotalFreeThreshold;
			public uint LockPrefixTable;                // VA
			public uint MaximumAllocationSize;
			public uint VirtualMemoryThreshold;
			public uint ProcessHeapFlags;
			public uint ProcessAffinityMask;
			public ushort CSDVersion;
			public ushort Reserved1;
			public uint EditList;                       // VA
			public uint SecurityCookie;                 // VA
			public uint SEHandlerTable;                 // VA
			public uint SEHandlerCount;
			public uint GuardCFCheckFunctionPointer;    // VA
			public uint Reserved2;
			public uint GuardCFFunctionTable;           // VA
			public uint GuardCFFunctionCount;
			public uint GuardFlags;
		}

		struct IMAGE_LOAD_CONFIG_DIRECTORY64
		{
			public uint Size;
			public uint TimeDateStamp;
			public ushort MajorVersion;
			public ushort MinorVersion;
			public uint GlobalFlagsClear;
			public uint GlobalFlagsSet;
			public uint CriticalSectionDefaultTimeout;
			public ulong DeCommitFreeBlockThreshold;
			public ulong DeCommitTotalFreeThreshold;
			public ulong LockPrefixTable;             // VA
			public ulong MaximumAllocationSize;
			public ulong VirtualMemoryThreshold;
			public ulong ProcessAffinityMask;
			public uint ProcessHeapFlags;
			public ushort CSDVersion;
			public ushort Reserved1;
			public ulong EditList;                    // VA
			public ulong SecurityCookie;              // VA
			public ulong SEHandlerTable;              // VA
			public ulong SEHandlerCount;
			public ulong GuardCFCheckFunctionPointer; // VA
			public ulong Reserved2;
			public ulong GuardCFFunctionTable;        // VA
			public ulong GuardCFFunctionCount;
			public uint GuardFlags;
		}

		void ParseDirLoadConfig()
		{
			if (ImageBits == 32)
			{
				IMAGE_LOAD_CONFIG_DIRECTORY32 LoadConfig;
				Read(out LoadConfig, HeaderDir[10].RVA);


			}
			else if (ImageBits == 64)
			{
				IMAGE_LOAD_CONFIG_DIRECTORY64 LoadConfig;
				Read(out LoadConfig, HeaderDir[10].RVA);

			}
		}
	}
}
