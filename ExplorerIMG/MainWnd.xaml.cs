using Microsoft.Win32;
using System;
using System.Windows;
using System.Windows.Input;

namespace ExplorerIMG
{
	public partial class MainWindow : Window
	{
		ParseBase MainFile;

		public MainWindow(string FileName)
		{
			InitializeComponent();

			CommandBinding Binds;
			Binds = new CommandBinding(ApplicationCommands.Open);
			Binds.Executed += OnOpen;
			CommandBindings.Add(Binds);

			Binds = new CommandBinding(ApplicationCommands.Close);
			Binds.CanExecute += CanClose;
			Binds.Executed += OnClose;
			CommandBindings.Add(Binds);

			if (FileName != null) OpenFile(FileName);
		}

		void OpenFile(string FileName)
		{
			try
			{
				MainFile?.Dispose();
				MainFile = ParseBase.OpenFile(FileName);
				MainTab.DataContext = MainFile;
                Title = "ExplorerIMG [" + MainFile.FileName + "]";
			}
			catch (Exception e)
			{
				MessageBox.Show(this, e.Message, "打开失败",
					MessageBoxButton.OK, MessageBoxImage.Error);
			}
		}

		public void OnOpen(object sender, ExecutedRoutedEventArgs e)
		{
			OpenFileDialog ofd = new OpenFileDialog();
			ofd.Filter = "IMG FILE|*.*";
			if (ofd.ShowDialog() == true) OpenFile(ofd.FileName);
		}

		private void Window_Drop(object sender, DragEventArgs e)
		{
			if (e.Data.GetDataPresent(DataFormats.FileDrop))
			{
				object FileNames = e.Data.GetData(DataFormats.FileDrop);
				OpenFile(((string[])FileNames)[0]);
			}
		}

		public void CanClose(object sender, CanExecuteRoutedEventArgs e)
		{
			e.CanExecute = (MainFile != null);
		}

		public void OnClose(object sender, ExecutedRoutedEventArgs e)
		{
			MainFile?.Dispose();
			MainFile = null;
			MainTab.DataContext = null;
            Title = "ExplorerIMG";
		}
	}
}
