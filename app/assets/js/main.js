if ( typeof module === "object" ){

	const { ipcRenderer } = require('electron')

	console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

	ipcRenderer.on('asynchronous-reply', (event, arg) => {
	  console.log(arg) // prints "pong"
	})

	ipcRenderer.send('asynchronous-message', 'ping')

}


$(document).ready(function(){

    console.log("Application Ready");

    if ( typeof process !== "undefined" && process.versions['electron'] !== "undefined") {
		$("#src-identifier").text("Application running in Electron");
	} else {
		$("#src-identifier").text("Application running in Browser");
	}

})

// https://electronjs.org/docs/api/ipc-main