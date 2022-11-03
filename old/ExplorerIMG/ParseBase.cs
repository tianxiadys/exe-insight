using System;
using System.IO;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using System.Collections.Generic;

namespace ExplorerIMG
{
	abstract class ParseBase
	{
		public uint ImageBits;
		protected FileStream ImageFile;
		protected IntPtr ImageBase;
		protected List<ParseBaseDetails> mDetailsList;

		public abstract IParseBaseExport ExportTable { get; }
		public abstract IParseBaseImport ImportTable { get; }
		public abstract IParseBaseResource ResourceTable { get; }

		public object DetailsList { get { return mDetailsList; } }
		public string FileName { get { return ImageFile.Name; } }

		public static ParseBase OpenFile(string FileName)
		{
			FileStream TempFile = new FileStream(FileName,
				FileMode.Open, FileAccess.Read, FileShare.Read);
			byte[] Sign = new byte[4]; TempFile.Read(Sign, 0, 4);

			if (BitConverter.ToUInt32(Sign, 0) == 0x464C457F) // [ELF]
				throw new Exception("暂未支持ELF格式");
			else if (BitConverter.ToUInt16(Sign, 0) == 0x5A4D) // [MZ]
				return new ParsePE.ParsePE(TempFile);

			throw new Exception("无法识别的文件类型");
		}

		public abstract void Dispose();
		~ParseBase() { Dispose(); }

		public void Read<T>(out T outstruct, uint offset)
		{
			outstruct = (T)Marshal.PtrToStructure(
				IntPtr.Add(ImageBase, (int)offset), typeof(T));
		}

		public void Read<T>(out T[] outstruct, uint offset, int count)
		{
			outstruct = new T[count];
			uint size = (uint)Marshal.SizeOf(typeof(T));

			for (int i = 0; i < count; i++, offset += size)
				outstruct[i] = (T)Marshal.PtrToStructure(
					IntPtr.Add(ImageBase, (int)offset), typeof(T));
		}

		public ushort ReadUInt16(uint offset)
		{
			return (ushort)Marshal.ReadInt16(ImageBase, (int)offset);
		}

		public uint ReadUInt32(uint offset)
		{
			return (uint)Marshal.ReadInt32(ImageBase, (int)offset);
		}

		public ulong ReadUInt64(uint offset)
		{
			return (ulong)Marshal.ReadInt64(ImageBase, (int)offset);
		}

		public string ReadString(uint offset)
		{
			return Marshal.PtrToStringAnsi(
				IntPtr.Add(ImageBase, (int)offset));
		}

		[DllImport("kernel32.dll")]
		protected static extern IntPtr CreateFileMapping(
			SafeFileHandle hFile, IntPtr lpAttributes,
			uint flProtect, uint dwMaximumSizeHigh,
			uint dwMaximumSizeLow, string lpName);

		[DllImport("kernel32.dll")]
		protected static extern IntPtr MapViewOfFile(
			IntPtr hFileMappingObject, uint dwDesiredAccess,
			uint dwHigh, uint dwLow, uint dwNumberOfBytes);

		[DllImport("kernel32.dll")]
		protected static extern int CloseHandle(IntPtr hObject);

		[DllImport("kernel32.dll")]
		protected static extern int UnmapViewOfFile(IntPtr lpBaseAddress);
	}
}
