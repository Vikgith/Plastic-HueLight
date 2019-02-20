
var request = require("request");
var stdin = process.stdin;

var hueBridgeIPAddress = "192.168.45.82" //a. 192.168.45.170 | b.192.168.45.82
// var hueUser  = "3hK4qDUyCFkSURSw8nd2mlO5OE4DCFzrNCxq5eQz"
// var hueUser = "v6CFPlhyC-SEsQh9avZKK85olTzJF1c7mby7leWE"
// var hueUser = "lg31q20JPowhGY0P1LHpKbup8CxU7PXrEDqdaeQz"
var hueUser = "w8eSAaM4Rz8VFD4WVLuFzHEryNONWh5j3EPpsq4v"

//{"devicetype":"my_hue_app#Victor"}

// Time interval for calling the Alpha vantage API
var timeInterval = 1000 // 1000 == 1 second, 1 == 1 milisecond

var stockName = "RY"

// HUE Colors (hue runs from 0 to 65535)
var hueGreen = 25500
var hueRed = 65535
var hueBlue = 46920
var hueOrange = 6176
var hueYellow = 10331
var huePurple = 48013
var huePink = 58433
var hueBlue2 = 35317

var hueWhite = 41435

// HUE Brightness intensity
var briH = 255
var briL = 100

var urlForStock = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + stockName + "&apikey=E2F86L9K9PXN4ACO";
//https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RY&apikey=E2F86L9K9PXN4ACO

var urlForLightOne = "http://" + hueBridgeIPAddress + "/api/" + hueUser + "/lights/4/state";
//"http://192.168.45.82/api/lg31q20JPowhGY0P1LHpKbup8CxU7PXrEDqdaeQz/lights/4/state"

var isRunning = false;
var stockChange = 0;
var stockPrice = 0;
var previousPrice = 0;

//Function to change the color of the light
function changeHueToColor(hue, bri) {
	var requestBody = JSON.stringify({on: true, hue: hue,  sat: 255, bri: bri});
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

		//console.log(body);

		try {
			var obj = JSON.parse(body);
			stockPrice = obj["Global Quote"]["05. price"]
			stockChange = obj["Global Quote"]["09. change"]

			
			console.log("\n//////////////////////////\n")

			console.log("****CONNECTION SUCCESS****")

			console.log("\nStock price: " + stockPrice)
			console.log("Stock change: " + stockChange + "\n")

			updateColors()

		} catch(error) {
			console.log("\n!!!!!!!!! Error !!!!!!!!!")
			console.log("\n/////////////////////////\n")
			console.log(error)
			console.log("\n/////////////////////////\n")

			clearInterval(interval)
			isRunning = !isRunning
			console.log("Trying to restart...")
			triggerRunning()
		}
	});
}
////////////////////////////////////////////////////////////////////////////

var startover = function(){

	// getStockPriceForRY()
	randomInt4();

};

function updateColors() {
	var trend = "Default"
	if (stockPrice > previousPrice) {
		//Change the color of Hue to green
		trend = "↑↑↑↑↑↑"
		changeHueToColor(hueGreen, briH);
		setTimeout(changeHueToColor, 500, hueGreen, briL);

	} else if (stockPrice < previousPrice) {
		//Change the color of Hue to red
		trend = "↓↓↓↓↓↓"
		changeHueToColor(hueRed, briH);
		setTimeout(changeHueToColor, 500, hueRed, briL);

	} else {
		trend = "-----"
		changeHueToColor(hueWhite, briH);
		setTimeout(changeHueToColor, 500, hueWhite, briL);
	};
	if (isRunning === true) {
		process.stdout.write("\r\x1b[K");
		process.stdout.write("TREND:  " + trend + "\n");

		// console.log("TREND:  " + trend)
		console.log("\n//////////////////////////")
	}
	previousPrice = stockPrice;
}

function triggerRunning() {
	if (isRunning === false) {
		//Start the interval
		console.log("Ruinning code... version 2")
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

	console.log("\n******************** MENU ********************")
	console.log("- Press \"1\" to turn the light GREEN.");        
	console.log("- Press \"2\" to turn the light RED.");            
	console.log("- Press \"3\" to turn the light BLUE.");             
	console.log("- Press \"4\" to turn the light ORANGE.");           
	console.log("- Press \"5\" to turn the light YELLOW.");          
	console.log("- Press \"6\" to turn the light PURPLE.");          
	console.log("- Press \"7\" to turn the light PINK.");            
	console.log("- Press \"8\" to turn the light LIGHT BLUE.");       
                                                                        
	console.log("\n- Press \"i\" to turn the light on.");             
	console.log("- Press \"o\" to turn the light off.");                 
                                                                          
	console.log("\n- Press \"s\" to termine the program.");              
	console.log("- Press \"r\" to start/stop running the program."); 
	console.log("**********************************************\n" )

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
			changeHueToColor(hueGreen, briH);
			setTimeout(changeHueToColor, 500, hueGreen, briL);
		} else if (key === "2") {
			changeHueToColor(hueRed, briH);
			setTimeout(changeHueToColor, 500, hueRed, briL);
		} else if (key === "3") {
			changeHueToColor(hueBlue, briH);
			setTimeout(changeHueToColor, 500, hueBlue, briL);
		} else if (key === "4") {
			changeHueToColor(hueOrange, briH);
			setTimeout(changeHueToColor, 500, hueOrange, briL);
		} else if (key === "5") {
			changeHueToColor(hueYellow, briH);
			setTimeout(changeHueToColor, 500, hueYellow, briL);
		} else if (key === "6") {
			changeHueToColor(huePurple, briH);
			setTimeout(changeHueToColor, 500, huePurple, briL);
		} else if (key === "7") {
			changeHueToColor(huePink, briH);
			setTimeout(changeHueToColor, 500, huePink, briL);
		} else if (key === "8") {
			changeHueToColor(hueBlue2, briH);
			setTimeout(changeHueToColor, 500, hueBlue2, briL);
		}
	});
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low)
}

function randomInt2() {
	var ran1 = Math.floor(Math.random() * 2)
	if (ran1 === 0) {
		changeHueToColor(hueGreen, briH);
		setTimeout(changeHueToColor, 500, hueGreen, briL);
	}else if (ran1 === 1){
		changeHueToColor(hueRed, briH);
		setTimeout(changeHueToColor, 500, hueRed, briL);
	}
}

function randomInt3() {
	var ran1 = Math.floor(Math.random() * 8)
	if (ran1 === 0) {
		changeHueToColor(hueGreen, briH);
		setTimeout(changeHueToColor, 500, hueGreen, briL);
	}else if (ran1 === 1){
		changeHueToColor(hueRed, briH);
		setTimeout(changeHueToColor, 500, hueRed, briL);
	}else if (ran1 === 2){
		changeHueToColor(hueBlue, briH);
		setTimeout(changeHueToColor, 500, hueBlue, briL);
	}else if (ran1 === 3){
		changeHueToColor(hueOrange, briH);
		setTimeout(changeHueToColor, 500, hueOrange, briL);
	}else if (ran1 === 4){
		changeHueToColor(hueYellow, briH);
		setTimeout(changeHueToColor, 500, hueYellow, briL);
	}else if (ran1 === 5){
		changeHueToColor(huePurple, briH);
		setTimeout(changeHueToColor, 500, huePurple, briL);
	}else if (ran1 === 6){
		changeHueToColor(huePink, briH);
		setTimeout(changeHueToColor, 500, huePink, briL);
	}else if (ran1 === 7){
		changeHueToColor(hueBlue2, briH);
		setTimeout(changeHueToColor, 500, hueBlue2, briL);
	}
}

function randomInt4() {
	var ran1 = Math.floor(Math.random() * 65535)
	
	changeHueToColor(ran1, briH);
	setTimeout(changeHueToColor, 500, ran1, briL);
}

mainFunction()
