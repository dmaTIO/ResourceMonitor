// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, Menu } = require("electron");
app.disableHardwareAcceleration();
app.disableDomainBlockingFor3DAPIs();
const path = require("path");
const ipc = require("electron").ipcMain;
const os = require("os-utils");
const si = require("systeminformation");

// let resourceInterval;
let popWindow = true;
let menuTemplate = [
  //   {
  //     label: "Window Manager",
  //     submenu: [],
  //   },
  //   {
  //     label: "View",
  //     submenu: [{ role: "reload" }, { label: "custom reload" }],
  //   },
];

const createWindow = (screenX, screenY) => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    // resizable: false,
    // alwaysOnTop: true,
    // frame: false,
    // x: screenX,
    // y: screenY,
    icon: "assets/icons/MBAM.ico",
    minWidth: 900,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const resourceInterval = setInterval(() => {
    //Send System Time
    mainWindow.webContents.send("systemTime", si.time());

    //CPU Info
    si.currentLoad()
      .then((currentLoad) => {
        mainWindow.webContents.send("currentLoad", currentLoad);
      })
      .catch((err) => {
        console.log("currentLoad info error", err);
      });

    //GPU Load Info
    si.graphics()
      .then((graphics) => {
        // console.log(graphics);
        const { controllers } = graphics;
        const gpuLoad = controllers[0].utilizationGpu
          ? controllers[0].utilizationGpu
          : 0;
        mainWindow.webContents.send("gpuLoad", gpuLoad);
      })
      .catch((err) => {
        console.log("graphics info error", err);
      });

    si.mem().then((mem) => {
      mainWindow.webContents.send(
        "memUsagePercent",
        (mem.used / mem.total) * 100
      );
    });
  }, 1000);

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  //   let menu = Menu.buildFromTemplate(menuTemplate);
  //   Menu.setApplicationMenu(menu);

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    popWindow = null;
    // clearInterval(resourceInterval);
  });

  mainWindow.on("close", () => {
    popWindow = null;
    // clearInterval(resourceInterval);
  });
  mainWindow.on("ready-to-show", () => {
    // System Info
    si.osInfo()
      .then((os) => {
        // console.log(os);
        const { distro, hostname, fqdn, platform } = os;

        mainWindow.webContents.send("systemInfoOS", JSON.stringify(os));
      })
      .catch((err) => {
        console.log("systemInfoOS info error", err);
      });

    //Ram Info
    si.mem()
      .then((mem) => {
        mainWindow.webContents.send("mem", JSON.stringify(mem));
      })
      .catch((err) => {
        console.log("mem info error", err);
      });

    //Mem Layout
    si.memLayout()
      .then((mlm) => {
        mainWindow.webContents.send("mlm", JSON.stringify(mlm));
      })
      .catch((err) => {
        console.log("Mem Layout error", err);
      });

    //Graphics Info
    si.graphics()
      .then((graphics) => {
        // console.log(graphics);
        const { displays } = graphics;
        mainWindow.webContents.send("displays", displays);
        //   console.log(displays);
        mainWindow.webContents.send("gpuName", graphics.controllers[0].model);
        mainWindow.webContents.send(
          "GPUmemoryTotal",
          graphics.controllers[0].memoryTotal ?? "0"
        );
        mainWindow.webContents.send("bus", graphics.controllers[0].bus);
        mainWindow.webContents.send(
          "driverVersion",
          graphics.controllers[0].driverVersion
        );
        mainWindow.webContents.send("gpuCount", graphics.controllers.length);
      })
      .catch((err) => {
        console.log("graphics info error", err);
      });

    //CPU Info
    si.cpu()
      .then((cpu) => {
        mainWindow.webContents.send("cpuInfo", cpu);
      })
      .catch((err) => {
        console.log("cpu info error", err);
      });

    //File System Info
    si.fsSize()
      .then((disks) => {
        //   console.log(disks);
        mainWindow.webContents.send("disks", disks);
      })
      .catch((err) => {
        console.log("disks info error", err);
      });
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
  const displays = screen.getAllDisplays();
  if (displays.length > 1) {
    createWindow(displays[1].bounds.x + 50, displays[1].bounds.y + 50);
  } else {
    createWindow();
  }

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      const displays = screen.getAllDisplays();
      if (displays.length > 1) {
        createWindow(displays[1].bounds.x + 50, displays[1].bounds.y + 50);
      } else {
        createWindow();
      }
    }
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
