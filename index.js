const ipc = require("electron").ipcRenderer;

const formatTime = (s) => {
	var date = new Date(s);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// Will display time in 10:30:23 format
	return hours + ":" + minutes.substr(-2);
};

ipc.on("systemInfoOS", (event, data) => {
	window.localStorage.setItem("systemInfoOS", data);
	const osInfo = JSON.parse(data);
	document.getElementById("pcName").innerHTML = osInfo.hostname + " - " + osInfo.distro;
});

ipc.on("mem", (event, data) => {
	window.localStorage.setItem("mem", data);
	const memInfo = JSON.parse(data);
	document.getElementById("ramTotal").innerHTML = (parseFloat(memInfo.total) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";
});

ipc.on("systemTime", (event, data) => {
	const currentDateTime = data.current;
	document.getElementById("time").innerHTML = formatTime(currentDateTime);
});

ipc.on("displays", (event, data) => {
	const displaysArray = data;
	window.localStorage.setItem("displaysArray", JSON.stringify(displaysArray));
	document.getElementById("displaysCount").innerHTML = data.length;
});

ipc.on("GPUmemoryTotal", (event, data) => {
	const GPUmemoryTotal = data;
	window.localStorage.setItem("GPUmemoryTotal", JSON.stringify(GPUmemoryTotal));
});

ipc.on("gpuName", (event, data) => {
	const gpuName = data;
	window.localStorage.setItem("gpuName", JSON.stringify(gpuName));
});

ipc.on("bus", (event, data) => {
	const bus = data;
	window.localStorage.setItem("bus", JSON.stringify(bus));
});

ipc.on("driverVersion", (event, data) => {
	const driverVersion = data;
	window.localStorage.setItem("driverVersion", JSON.stringify(driverVersion));
});

ipc.on("gpuCount", (event, data) => {
	const gpuCount = data;
	window.localStorage.setItem("gpuCount", gpuCount);
	document.getElementById("gpuCount").innerHTML = gpuCount;
});

ipc.on("cpuInfo", (event, data) => {
	const cpuInfo = data;
	window.localStorage.setItem("cpuInfo", JSON.stringify(cpuInfo));
	document.getElementById("cpuCount").innerHTML = data.cores;
	document.getElementById("cpuName").innerHTML = data?.brand;
});

ipc.on("disks", (event, data) => {
	const disksInfo = data;
	window.localStorage.setItem("disks", JSON.stringify(disksInfo));

	const diskBoxArray = [].slice.call(document.getElementById("drivesBox").children);

	diskBoxArray.forEach((el, idx) => {
		if (data[idx]) {
			el.getElementsByClassName("name")[0].innerHTML = data[idx]["fs"] + "/";
			el.getElementsByClassName("message-line")[0].innerHTML = (parseFloat(data[idx]["size"]) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";
			el.getElementsByClassName("message-line")[1].innerHTML = (parseFloat(data[idx]["available"]) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";
		} else {
			el.remove();
		}
	});
});

//Dashboard UI functions

document.addEventListener("DOMContentLoaded", function () {
	//Get Name
	const osInfoStored = JSON.parse(window.localStorage.getItem("systemInfoOS"));
	document.getElementById("pcName").innerHTML = osInfoStored.hostname + " - " + osInfoStored.distro;

	//Get Ram Total
	const memInfo = JSON.parse(window.localStorage.getItem("mem"));
	document.getElementById("ramTotal").innerHTML = (parseFloat(memInfo.total) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";

	//Get Displays
	const displaysInfo = JSON.parse(window.localStorage.getItem("displaysArray"));
	document.getElementById("displaysCount").innerHTML = displaysInfo.length;

	//Get GpuCount
	const gpuCount = JSON.parse(window.localStorage.getItem("gpuCount"));
	document.getElementById("gpuCount").innerHTML = gpuCount;

	//Get CPU Cores Count
	const cpuInfo = JSON.parse(window.localStorage.getItem("cpuInfo"));
	document.getElementById("cpuCount").innerHTML = cpuInfo?.cores;
	document.getElementById("cpuName").innerHTML = cpuInfo?.brand;

	//Get File System
	const fileSystem = JSON.parse(window.localStorage.getItem("disks"));
	const diskBoxArray = [].slice.call(document.getElementById("drivesBox").children);
	diskBoxArray.forEach((el, idx) => {
		if (fileSystem[idx]) {
			el.getElementsByClassName("name")[0].innerHTML = fileSystem[idx]["fs"] + "/";
			el.getElementsByClassName("message-line")[0].innerHTML = (parseFloat(fileSystem[idx]["size"]) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";
			el.getElementsByClassName("message-line")[1].innerHTML = (parseFloat(fileSystem[idx]["available"]) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";
		} else {
			el.remove();
		}
	});

	//Get Dark Mode
	let isDarkMode = window.localStorage.getItem("darkMode") === "true";
	var modeSwitch = document.querySelector(".mode-switch");

	if (isDarkMode) {
		document.documentElement.classList.add("dark");
		modeSwitch.classList.add("active");
	} else {
		document.documentElement.classList.remove("dark");
		modeSwitch.classList.remove("active");
	}

	modeSwitch.addEventListener("click", function () {
		document.documentElement.classList.toggle("dark");
		modeSwitch.classList.toggle("active");
		console.log();
		if (modeSwitch.classList[1]) {
			window.localStorage.setItem("darkMode", "true");
		} else {
			window.localStorage.setItem("darkMode", "false");
		}
	});

	var listView = document.querySelector(".list-view");
	var gridView = document.querySelector(".grid-view");
	var projectsList = document.querySelector(".project-boxes");

	listView.addEventListener("click", function () {
		gridView.classList.remove("active");
		listView.classList.add("active");
		projectsList.classList.remove("jsGridView");
		projectsList.classList.add("jsListView");
	});

	gridView.addEventListener("click", function () {
		gridView.classList.add("active");
		listView.classList.remove("active");
		projectsList.classList.remove("jsListView");
		projectsList.classList.add("jsGridView");
	});

	document.querySelector(".messages-btn").addEventListener("click", function () {
		document.querySelector(".messages-section").classList.add("show");
	});

	document.querySelector(".messages-close").addEventListener("click", function () {
		document.querySelector(".messages-section").classList.remove("show");
	});
});
