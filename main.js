// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("path");
const ipc = require("electron").ipcMain;
const os = require("os-utils");
// let resourceInterval;
let popWindow = true;

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 600,
		height: 600,
		resizable: false,
		alwaysOnTop: true,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: true,
			contextIsolation: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	const resourceInterval = setInterval(() => {
		if (popWindow) {
			os.cpuUsage(function (v) {
				mainWindow.webContents.send("cpu", v * 100);
				mainWindow.webContents.send("mem", os.freememPercentage() * 100);
				mainWindow.webContents.send("mem", 100 - os.freememPercentage() * 100);
				mainWindow.webContents.send("total-mem", os.totalmem() / 1024);
			});
		}
	}, 1000);

	// and load the index.html of the app.
	mainWindow.loadFile("index.html");

	// mainWindow.webContents.openDevTools();

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	mainWindow.on("closed", () => {
		popWindow = null;
		clearInterval(resourceInterval);
	});

	mainWindow.on("close", () => {
		popWindow = null;
		clearInterval(resourceInterval);
	});
};

ipc.on("invokeAction", function (event, data) {
	// console.log(data);
	// var result = app.getGPUFeatureStatus();
	app.exit(0);
	if (process.platform !== "darwin") app.quit();

	// app.getGPUFeatureStatus()
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	app.exit(0);
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
