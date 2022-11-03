using System;
using System.Collections.Generic;
using System.IO;

namespace ExplorerIMG.ParsePE
{
	partial class ParsePE : ParseBase
	{
		IMAGE_FILE_HEADER HeaderFile;
		IMAGE_OPTIONAL_HEADER32 HeaderOpt32;
		IMAGE_OPTIONAL_HEADER64 HeaderOpt64;
		IMAGE_DATA_DIRECTORY[] HeaderDir;
		IMAGE_SECTION_HEADER[] HeaderSec;

		ParsePE_Export mExportTable;
		public override IParseBaseExport ExportTable
		{ get { return mExportTable; } }

		ParsePE_Import mImportTable;
		public override IParseBaseImport ImportTable
		{ get { return mImportTable; } }

		ParsePE_Resource mResourceTable;
		public override IParseBaseResource ResourceTable
		{ get { return mResourceTable; } }

		public ParsePE(FileStream TempFile)
		{
			IntPtr hMapping = CreateFileMapping(
				TempFile.SafeFileHandle, IntPtr.Zero, 0x1000002, 0, 0, null);
			ImageBase = MapViewOfFile(hMapping, 0x0004, 0, 0, 0);
			CloseHandle(hMapping);

			if (ImageBase == IntPtr.Zero)
				throw new Exception("不合法的PE文件格式");
			else ImageFile = TempFile;

			uint DOS_lfanew = ReadUInt32(60);
			Read(out HeaderFile, DOS_lfanew + 4);
			Read(out HeaderOpt32, DOS_lfanew + 24);
			Read(out HeaderOpt64, DOS_lfanew + 24);

			uint OptSize = HeaderFile.SizeOfOptionalHeader;
			Read(out HeaderDir, DOS_lfanew + OptSize - 104, 16);
			Read(out HeaderSec, DOS_lfanew + OptSize + 24, HeaderFile.NumberOfSections);

			if (HeaderOpt32.Magic == IMAGE_NT_OPTIONAL_HDR32_MAGIC)
				ImageBits = 32;
			else if (HeaderOpt32.Magic == IMAGE_NT_OPTIONAL_HDR64_MAGIC)
				ImageBits = 64;
			else throw new Exception("无法识别的PE头部类型");

			mDetailsList = new List<ParseBaseDetails>();
			mDetailsList.Add(new HeaderLenght("映像文件长度", (uint)ImageFile.Length));

			ParseHeadersDetails();

			if (HeaderDir[0].RVA != 0)
				mExportTable = new ParsePE_Export(this, HeaderDir[0]);

			if ((HeaderDir[1].RVA != 0) || (HeaderDir[13].RVA != 0))
				mImportTable = new ParsePE_Import(this, HeaderDir[1], HeaderDir[13]);

			if (HeaderDir[2].RVA != 0)
				mResourceTable = new ParsePE_Resource(this, HeaderDir[2]);

			if (HeaderDir[6].RVA != 0) ParseDirDebug();

			if (HeaderDir[8].RVA != 0)
				mDetailsList.Add(new ParseBaseDetails("全局指针寄存器", HeaderDir[8].RVA));

			if (HeaderDir[9].RVA != 0) ParseDirTLS();

			if (HeaderDir[10].RVA != 0) ParseDirLoadConfig();
		}

		public override void Dispose()
		{
			UnmapViewOfFile(ImageBase);
			ImageFile?.Dispose();
			ImageBase = IntPtr.Zero;
			ImageFile = null;
		}
	}
}
