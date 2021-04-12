using System;
using System.Collections.Generic;

namespace ExplorerIMG.ParsePE
{
	class ParsePE_Import : IParseBaseImport
	{
		struct IMAGE_IMPORT_DESCRIPTOR
		{
			public uint ImportNameTable;
			public uint TimeDateStamp;
			public uint ForwarderChain;
			public uint DllName;
			public uint ImportAddressTable;
		}

		struct IMAGE_DELAYLOAD_DESCRIPTOR
		{
			public uint AllAttributes;
			public uint DllName;
			public uint ModuleHandle;
			public uint ImportAddressTable;
			public uint ImportNameTable;
			public uint BoundImportAddressTable;
			public uint UnloadInformationTable;
			public uint TimeDateStamp;
		}

		uint ModNum = 0, DelayMod = 0, FuncNum = 0, DelayFunc = 0, UnNamed = 0;
		List<IBaseImportMod> mList = new List<IBaseImportMod>();

		public List<IBaseImportMod> ModList { get { return mList; } }

		public string Description
		{
			get
			{
				string TempStr = "总计导入模块" + (ModNum + DelayMod) + "个";
				if (DelayMod > 0)
					TempStr += "，延迟导入" + DelayMod + "个";
				TempStr += "；总计导入函数 " + (FuncNum + DelayFunc) + "个";
				if (DelayFunc > 0)
					TempStr += "，延迟导入" + DelayFunc + "个";
				if (UnNamed > 0)
					TempStr += "，匿名" + UnNamed + "个";
				return TempStr;
			}
		}

		public ParsePE_Import(ParsePE MainPE,
			IMAGE_DATA_DIRECTORY StdDir, IMAGE_DATA_DIRECTORY DelayDir)
		{
			if (StdDir.RVA != 0)
			{
				for (uint offset = StdDir.RVA; ; offset += 20)
				{
					IMAGE_IMPORT_DESCRIPTOR TempHeader;
					MainPE.Read(out TempHeader, offset);
					if (TempHeader.DllName == 0) break;
					mList.Add(new PE_ImportMod(MainPE, TempHeader,
						ref ModNum, ref FuncNum, ref UnNamed));
				}
			}

			if(DelayDir.RVA != 0)
			{
				for (uint offset = DelayDir.RVA; ; offset += 32)
				{
					IMAGE_DELAYLOAD_DESCRIPTOR TempHeader;
					MainPE.Read(out TempHeader, offset);
					if (TempHeader.DllName == 0) break;
					mList.Add(new PE_ImportMod(MainPE, TempHeader,
						ref DelayMod, ref DelayFunc, ref UnNamed));
				}
			}

			mList.Sort();
		}

		class PE_ImportMod : IComparable, IBaseImportMod
		{
			string mModuleName; bool IsDelay; uint FuncNum = 0, UnNamed = 0;
			List<IBaseImportFunc> mList = new List<IBaseImportFunc>();

			public List<IBaseImportFunc> FuncList { get { return mList; } }

			public string ModuleName
			{ get { return mModuleName + (IsDelay ? " [延迟]" : ""); } }

			public string Description
			{
				get
				{
					return "导入" + FuncNum + "个函数" +
						((UnNamed > 0) ? ("(" + UnNamed + "个匿名)") : "");
				}
			}

			public PE_ImportMod(ParsePE MainPE, IMAGE_IMPORT_DESCRIPTOR Header,
				ref uint SumModNum, ref uint SumFuncNum, ref uint SumUnNamed)
			{
				if (Header.ImportNameTable == 0)
					Init(MainPE, Header.DllName, Header.ImportAddressTable);
				else Init(MainPE, Header.DllName, Header.ImportNameTable);

				SumModNum++; SumFuncNum += FuncNum; SumUnNamed += UnNamed;
			}

			public PE_ImportMod(ParsePE MainPE, IMAGE_DELAYLOAD_DESCRIPTOR Header,
				ref uint DelayMod, ref uint DelayFunc, ref uint SumUnNamed)
			{
				Init(MainPE, Header.DllName, Header.ImportNameTable);

				DelayMod++; DelayFunc += FuncNum; SumUnNamed += UnNamed; IsDelay = true;
			}

			void Init(ParsePE MainPE, uint DllName, uint NameTable)
			{
				mModuleName = MainPE.ReadString(DllName);

				uint WordLen = MainPE.ImageBits / 8;
				for (uint offset = NameTable; ; offset += WordLen)
				{
					uint TempFunc = MainPE.ReadUInt32(offset);
					if (TempFunc != 0) FuncNum++; else break;

					uint HighWord = (WordLen == 4) ? TempFunc
						: MainPE.ReadUInt32(offset + 4);

					if ((HighWord & 0x80000000) != 0)
					{
						UnNamed++;
						mList.Add(new PE_ImportFunc((ushort)TempFunc, null));
					}
					else
					{
						ushort TempID = MainPE.ReadUInt16(TempFunc);
						string TempName = MainPE.ReadString(TempFunc + 2);
						mList.Add(new PE_ImportFunc(TempID, TempName));
					}
				}

				mList.Sort();
			}

			public int CompareTo(object obj)
			{
				return mModuleName.CompareTo(((PE_ImportMod)obj).mModuleName);
			}
		}

		class PE_ImportFunc : IComparable, IBaseImportFunc
		{
			ushort mFuncID; string mFuncName;

			public ushort FuncID { get { return mFuncID; } }
			public string FuncName { get { return mFuncName; } }

			public PE_ImportFunc(ushort InID, string InName)
			{ mFuncID = InID; mFuncName = InName; }

			public int CompareTo(object obj)
			{
				PE_ImportFunc Temp = (PE_ImportFunc)obj;

				if ((mFuncName == null) && (Temp.mFuncName == null))
					return mFuncID - Temp.mFuncID;
				else if (mFuncName == null)
					return -1;
				else if (Temp.mFuncName == null)
					return 1;
				else return mFuncName.CompareTo(Temp.mFuncName);
			}
		}
	}
}
