using System.Windows;

namespace ExplorerIMG
{
	public partial class App : Application
    {
		private void AppStartup(object sender, StartupEventArgs e)
		{
			if (e.Args.Length > 0)
				new MainWindow(e.Args[0]).Show();
			else new MainWindow(null).Show();
		}
	}
}
