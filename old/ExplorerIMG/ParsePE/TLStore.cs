
namespace ExplorerIMG.ParsePE
{
	partial class ParsePE
	{
		struct IMAGE_TLS_DIRECTORY32
		{
			public uint StartAddressOfRawData;
			public uint EndAddressOfRawData;
			public uint AddressOfIndex;         // PDWORD
			public uint AddressOfCallBacks;     // PIMAGE_TLS_CALLBACK *
			public uint SizeOfZeroFill;
			public uint Characteristics;
		}

		struct IMAGE_TLS_DIRECTORY64
		{
			public ulong StartAddressOfRawData;
			public ulong EndAddressOfRawData;
			public ulong AddressOfIndex;        // PDWORD
			public ulong AddressOfCallBacks;    // PIMAGE_TLS_CALLBACK *;
			public uint SizeOfZeroFill;
			public uint Characteristics;
		}

		void ParseDirTLS()
		{
			if (ImageBits == 32)
			{
				IMAGE_TLS_DIRECTORY32 TlsDir;
				Read(out TlsDir, HeaderDir[9].RVA);

				mDetailsList.Add(new ParseBaseDetails("TLS数据起始地址", TlsDir.StartAddressOfRawData));
				mDetailsList.Add(new HeaderLenght("TLS数据长度", TlsDir.EndAddressOfRawData - TlsDir.StartAddressOfRawData));
				mDetailsList.Add(new ParseBaseDetails("TLS初始化回调参数表", TlsDir.AddressOfIndex));
				mDetailsList.Add(new ParseBaseDetails("TLS初始化回调函数", TlsDir.AddressOfCallBacks));
				mDetailsList.Add(new HeaderLenght("TLS零填充数据长度", TlsDir.SizeOfZeroFill));
				mDetailsList.Add(new ParseBaseDetails("TLS数据对齐粒度", (TlsDir.Characteristics >> 20) & 0xF));
			}
			else if (ImageBits == 64)
			{
				IMAGE_TLS_DIRECTORY64 TlsDir;
				Read(out TlsDir, HeaderDir[9].RVA);

				mDetailsList.Add(new ParseBaseDetails("TLS数据起始地址", TlsDir.StartAddressOfRawData));
				mDetailsList.Add(new HeaderLenght("TLS数据长度", TlsDir.EndAddressOfRawData - TlsDir.StartAddressOfRawData));
				mDetailsList.Add(new ParseBaseDetails("TLS初始化回调参数表", TlsDir.AddressOfIndex));
				mDetailsList.Add(new ParseBaseDetails("TLS初始化回调函数", TlsDir.AddressOfCallBacks));
				mDetailsList.Add(new HeaderLenght("TLS零填充数据长度", TlsDir.SizeOfZeroFill));
				mDetailsList.Add(new ParseBaseDetails("TLS数据对齐粒度", (TlsDir.Characteristics >> 20) & 0xF));
			}
		}
	}
}
