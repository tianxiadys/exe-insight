using System.Collections.Generic;

namespace ExplorerIMG.ParsePE
{
	class ParsePE_Export : IParseBaseExport
	{
		struct IMAGE_EXPORT_DIRECTORY
		{
			public uint Characteristics;
			public uint TimeDateStamp;
			public ushort MajorVersion;
			public ushort MinorVersion;
			public uint Name;
			public uint Base;
			public uint NumberOfFunctions;
			public uint NumberOfNames;
			public uint AddressOfFunctions;
			public uint AddressOfNames;
			public uint AddressOfNameOrdinals;
		}

		string ModuleName; uint FuncNum = 0, UnNamed = 0, UnUsed = 0;
		List<IBaseExportFunc> mList = new List<IBaseExportFunc>();

		public List<IBaseExportFunc> FuncList { get { return mList; } }

		public string Description
		{
			get
			{
				string TempStr = "模块原始名: " + ModuleName;
				TempStr += "，总计导出" + FuncNum + "个函数";
				if (UnUsed > 0)
					TempStr += "，包含无效函数" + UnUsed + "个";
				if (UnNamed > 0)
					TempStr += "，包含匿名函数" + UnNamed + "个";
				return TempStr;
			}
		}

		public ParsePE_Export(ParsePE MainPE, IMAGE_DATA_DIRECTORY DirInfo)
		{
			IMAGE_EXPORT_DIRECTORY TempHeader;
			MainPE.Read(out TempHeader, DirInfo.RVA);

			ModuleName = MainPE.ReadString(TempHeader.Name);
			FuncNum = TempHeader.NumberOfFunctions;
			uint AddrOffset = TempHeader.AddressOfFunctions;

			for (uint i = 0, n; i < FuncNum; i++, AddrOffset += 4)
			{
				if ((n = MainPE.ReadUInt32(AddrOffset)) == 0) UnUsed++;
				mList.Add(new PE_ExportFunc(i + TempHeader.Base, n));
			}

			UnNamed = FuncNum - TempHeader.NumberOfNames - UnUsed;
			uint NameList = TempHeader.AddressOfNames;
			uint OrdiOffset = TempHeader.AddressOfNameOrdinals;

			for (uint i = 0; i < TempHeader.NumberOfNames;
				i++, NameList += 4, OrdiOffset += 2)
			{
				ushort FuncIndex = MainPE.ReadUInt16(OrdiOffset);
				uint NameOffset = MainPE.ReadUInt32(NameList);
				string TempName = MainPE.ReadString(NameOffset);
				((PE_ExportFunc)mList[FuncIndex]).mFuncName = TempName;
			}
		}

		class PE_ExportFunc : IBaseExportFunc
		{
			public string mFuncName; uint mFuncID, mFuncAddr;

			public uint FuncID { get { return mFuncID; } }
			public uint FuncAddr { get { return mFuncAddr; } }
			public string FuncName { get { return mFuncName; } }

			public PE_ExportFunc(uint InFuncID, uint InFuncAddr)
			{ mFuncID = InFuncID; mFuncAddr = InFuncAddr; }
		}
	}
}
