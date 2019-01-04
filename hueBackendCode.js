
var request = require("request");
var stdin = process.stdin;

var hueBridgeIPAddress = "192.168.45.170"
var hueUser  = "3hK4qDUyCFkSURSw8nd2mlO5OE4DCFzrNCxq5eQz"
//var hueUser2 = "lg31q20JPowhGY0P1LHpKbup8CxU7PXrEDqdaeQz"
//{"devicetype":"my_hue_app#Victor"}

// Time interval for calling the Alpha vantage API
var timeInterval = 12000

var stockName = "RY"

// HUE Colors 
var hueGreen = 25500
var hueRed = 65535

var urlForStock = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + stockName + "&apikey=E2F86L9K9PXN4ACO";
//https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RY&apikey=E2F86L9K9PXN4ACO

var urlForLightOne = "http://" + hueBridgeIPAddress + "/api/" + hueUser + "/lights/4/state";
//"http://192.168.45.170/api/3hK4qDUyCFkSURSw8nd2mlO5OE4DCFzrNCxq5eQz/lights/4/state"

var isRunning = false;
var stockPrice = 0;
var previousPrice = 0;

//Function to change the color of the light
function changeHueToColor(hue) {
	var requestBody = JSON.stringify({on: true, hue: hue,  sat: 250, bri: 100});
	request({
		uri: urlForLightOne,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		method: "PUT",
		form: requestBody
	});
}

//Function to turn ON or OFF the light
function turnHue(state) {
	var requestBody = JSON.stringify({on: state});
	request({
		uri: urlForLightOne,
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		method: "PUT",
		form: requestBody
	});
}

/////////////////////////////////////////////////////////////////////////////////
function getStockPriceForRY() {
	request(
	urlForStock, 
	function(error, response, body) {

		console.log(body);

		try {
			var obj = JSON.parse(body);
			stockPrice = obj["Global Quote"]["05. price"]
			console.log("\nIT WORKS")
			console.log("\n/////////////\n")

			updateColors()

		} catch(error) {
			console.log("\n!!!!!!!!!!!! Error !!!!!!!!!!!!")
			console.log("\n///////////\n")
			console.log(error)
			console.log("\n/////////////\n")

			// clearInterval(interval)
			// isRunning = !isRunning
			// console.log("Trying to restart...")
			// triggerRunning()
		}
	});
}
////////////////////////////////////////////////////////////////////////////

var startover = function(){

	getStockPriceForRY()

};

function updateColors() {
	var trend = "↑"
	if (stockPrice > previousPrice) {
		//Change the color of Hue to green
		changeHueToColor(hueGreen);

	} else if (stockPrice < previousPrice) {
		//Change the color of Hue to red
		trend = "↓"
		changeHueToColor(hueRed);

	} else {
		trend = "-"
	};
	if (isRunning === true) {
		process.stdout.write("\r\x1b[K");
		process.stdout.write("Quotes: " + stockPrice + trend);
	}
	previousPrice = stockPrice;
}

function triggerRunning() {
	if (isRunning === false) {
		//Start the interval
		console.log("\nRuinning...")
		console.log("\nMonitoring -> Royal Bank of Canada\n")
		interval = setInterval(startover, timeInterval);
	} else {
		//Stop the interval
		clearInterval(interval)

		console.log("\nProgram is not running. Press \"r\" to start running...")
	}

	isRunning = !isRunning
}

function mainFunction() {

	console.log("\nI am Running...");

	console.log("\n********** Menu: **********\n")

	console.log("- Press \"1\" to turn the light GREEN.");
	console.log("- Press \"2\" to turn the light RED.\n");

	console.log("- Press \"s\" to termine the program.");
	console.log("- Press \"i\" to turn the light on.");
	console.log("- Press \"o\" to turn the light off.");
	console.log("- Press \"r\" to start/stop running the program.\n");

	var interval;
	triggerRunning();

	// Codes to get keyboard input: without this, we would only get streams once enter is pressed
	stdin.setRawMode( true );

	// resume stdin in the parent process (node app won't quit all by itself unless an error or process.exit() happens)
	stdin.resume();
	stdin.setEncoding( 'utf8' );

	// on any data into stdin
	stdin.on( 'data', function( key ){
	// ctrl-c (end of text)
		if ( key === '\u0003' ) {
			process.exit();
		} else if (key === "s") {
			console.log("\n")
			process.exit();
		} else if (key === "i") {
			turnHue(true);
		} else if (key === "o") {
			turnHue(false);
		} else if (key === "r") {
			triggerRunning();
		} else if (key === "1") {
			changeHueToColor(hueGreen);
		} else if (key === "2") {
			changeHueToColor(hueRed);
		}
	});
}

mainFunction()
