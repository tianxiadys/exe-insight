using System;

namespace ExplorerIMG
{
	class ParseBaseDetails
	{
		string mItemName, mItemData;
		protected string mItemDesc;

		public string ItemName { get { return mItemName; } }
		public string ItemData { get { return mItemData; } }
		public string ItemDesc { get { return mItemDesc; } }

		public ParseBaseDetails(string Name)
		{
			mItemName = Name;
		}

		public ParseBaseDetails(string Name, ushort Data)
		{
			mItemName = Name;
			mItemData = string.Format("0x{0:X04}", Data);
		}

		public ParseBaseDetails(string Name, uint Data)
		{
			mItemName = Name;
			mItemData = string.Format("0x{0:X08}", Data);
		}

		public ParseBaseDetails(string Name, ulong Data)
		{
			mItemName = Name;
			mItemData = string.Format("0x{0:X016}", Data);
		}
	}

	class HeaderTimeStamp : ParseBaseDetails
	{
		public HeaderTimeStamp(string Name, uint Data) : base(Name, Data)
		{
			long NewTimeStamp = ((long)Data) * 10000000 + 116444736000000000;
			mItemDesc = DateTime.FromFileTimeUtc(NewTimeStamp).ToString("R");
		}
	}

	class HeaderLenght : ParseBaseDetails
	{
		string GetSizeString(uint SizeByte)
		{
			string SizeStr = SizeByte.ToString("N0") + " Bytes";

			float SizeKB = SizeByte / 1024.0f;
			float SizeMB = SizeKB / 1024.0f;
			float SizeGB = SizeMB / 1024.0f;

			if (SizeGB >= 2.0f)
				SizeStr += " (" + SizeGB.ToString("F2") + " GB)";
			else if (SizeMB >= 2.0f)
				SizeStr += " (" + SizeMB.ToString("F2") + " MB)";
			else if (SizeKB >= 2.0f)
				SizeStr += " (" + SizeKB.ToString("F2") + " KB)";

			return SizeStr;
		}

		public HeaderLenght(string Name, ushort Data) : base(Name, Data)
		{
			mItemDesc = GetSizeString(Data);
		}

		public HeaderLenght(string Name, uint Data) : base(Name, Data)
		{
			mItemDesc = GetSizeString(Data);
		}

		public HeaderLenght(string Name, ulong Data) : base(Name, Data)
		{
			mItemDesc = GetSizeString((uint)Data);
		}
	}
}
