const ipc = require("electron").ipcRenderer;

// //const electron = require("electron");
// // Importing the app module using Electron remote
// //const app = electron.remote.app;

// app.on("gpu-info-update", () => {
//   console.log("GPU Information has been Updated");
// });

// app.on("gpu-process-crashed", (event, killed) => {
//   console.log("GPU Process has crashed");
//   console.log(event);
//   console.log("Whether GPU Process was killed - ", killed);
// });

// var metrics = document.getElementById("metrics");
// metrics.addEventListener("click", () => {
//   console.dir(app.getAppMetrics());
// });

// var basic = document.getElementById("basic");
// basic.addEventListener("click", () => {
//   app.getGPUInfo("basic").then((basicObj) => {
//     console.dir(basicObj);
//   });
// });

// var complete = document.getElementById("complete");
// complete.addEventListener("click", () => {
//   app.getGPUInfo("complete").then((completeObj) => {
//     console.dir(completeObj);
//   });
// });

// var features = document.getElementById("features");
// features.addEventListener("click", () => {
//   console.dir(app.getGPUFeatureStatus());
// });

ipc.on("cpu", (event, data) => {
  document.getElementById("cpu").innerHTML = data.toFixed(2);
});
ipc.on("mem", (event, data) => {
  document.getElementById("mem").innerHTML = data.toFixed(2);
});
ipc.on("total-mem", (event, data) => {
  document.getElementById("total-mem").innerHTML = data.toFixed(2);
});

// const features = document.getElementById("features");
// features.addEventListener("click", function () {
//   ipc.once("actionReply", function (event, response) {
//     console.dir(response);
//   });
//   ipc.send("invokeAction", "someData");
// });
