using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ExplorerIMG.ParsePE
{
	class ParsePE_Resource : IParseBaseResource
	{
		struct IMAGE_RESOURCE_DIRECTORY
		{
			public uint Characteristics;
			public uint TimeDateStamp;
			public ushort MajorVersion;
			public ushort MinorVersion;
			public ushort NumberOfNamedEntries;
			public ushort NumberOfIdEntries;
		}

		struct IMAGE_RESOURCE_DIRECTORY_ENTRY
		{
			public uint NameID;
			public uint Offset;
		}


		List<IBaseResourceType> mList = new List<IBaseResourceType>();

		public List<IBaseResourceType> TypeList { get { return mList; } }

		public string Description
		{
			get
			{
				return null;
			}
		}

		public ParsePE_Resource(ParsePE MainPE, IMAGE_DATA_DIRECTORY DirInfo)
		{

		}
	}
}
