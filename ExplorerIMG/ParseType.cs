using System.Collections.Generic;

namespace ExplorerIMG
{
	interface IParseBaseExport
	{
		List<IBaseExportFunc> FuncList { get; }
		string Description { get; }
	}

	interface IBaseExportFunc
	{
		uint FuncID { get; }
		uint FuncAddr { get; }
		string FuncName { get; }
	}

	interface IParseBaseImport
	{
		List<IBaseImportMod> ModList { get; }
		string Description { get; }
	}

	interface IBaseImportMod
	{
		List<IBaseImportFunc> FuncList { get; }
		string ModuleName { get; }
		string Description { get; }
	}

	interface IBaseImportFunc
	{
		ushort FuncID { get; }
		string FuncName { get; }
	}

	interface IParseBaseResource
	{
		List<IBaseResourceType> TypeList { get; }
		string Description { get; }
	}

	interface IBaseResourceType
	{
		List<IBaseResourceItem> ItemList { get; }
		string TypeName { get; }
		string Description { get; }
	}

	interface IBaseResourceItem
	{

	}
}
