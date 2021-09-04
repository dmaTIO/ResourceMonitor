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

//Dashboard UI functions

document.addEventListener("DOMContentLoaded", function () {
	// Set System OS Info

	//Get Name
	const osInfoStored = JSON.parse(window.localStorage.getItem("systemInfoOS"));
	document.getElementById("pcName").innerHTML = osInfoStored.hostname + " - " + osInfoStored.distro;

	//Get Ram Total
	const memInfo = JSON.parse(window.localStorage.getItem("mem"));
	document.getElementById("ramTotal").innerHTML = (parseFloat(memInfo.total) * (9.31 * Math.pow(10, -10))).toFixed(2) + " GB";

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
