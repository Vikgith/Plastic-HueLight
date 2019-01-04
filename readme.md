# Hue Stock Monitor

This program, written in node.js, will connect to the Hue Bridge via HTTPS and change the state of the Hue lightbulb based on the stock price from Alpha Vantage RESTful API and will be monitored in the terminal.

## SET UP

### Hardware requirements
You will need at least one Hue lightbulb and a HUE Bridge.

### Set Up HUE lightbulb
1. First make sure your bridge is connected to your network and is functioning properly. Test that the smartphone app can control the lights on the same network.
2. Then you need to discover the IP address of the bridge on your network. You can use HUE broker server discover process by visiting [Get IP  Address](https://discovery.meethue.com).
3. Create an authorized user. for this visit "https:// *~bridge ip address~* /debug/clip.html" and fill the URL with: /api , and the Body with: {"devicetype":"my_hue_app#iphone name"}. Then press post; you will get an error, you should press the link button in the bridge and then press POST again and you will get your authorized user.
4. Edit the node.js file, and change the variables "hueBridgeIPAddress" and "hueUser" to your custom ones.

For more details visit [Get Started](https://developers.meethue.com/develop/get-started-2/)

### Customize
Inside the **hueBakcendCode.js** there are some variables that you can change to make a more customized program.
1. Time interval: You can change the vale of "timeInterval" tochange the frequency that the stocks values are requested. WARNING: there is a limit, read the details.
2. Stock Name: You can change the industry that you are looking the values for. You need to change the variable "stockName".
3. Colors: You can change the colors that the light turn by changing "hueGreen" and "hueRed".


## RUN THE SOFTWARE

1. Intstall Nexe Library (npm i nexe -g)
2. Create a .exe file from **hueBakcendCode.js** (Write in terminal, inside the folder: nexe my-app.js)".

Run the executable file.

## MORE DETAILS

- By default, the folder have a **HueController** executable file that is generated from the **hueBackendCode.js**. 

- After making changes in the .js file, you must create a new .exe fie [nexe library](https://github.com/nexe/nexe).

- Vistit [Philips Developer Guide](https://developers.meethue.com/) for more detail about the Philips Hue API.

- This is the API for getting stock price [Alpha Vantage API](https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=RY&apikey=E2F86L9K9PXN4ACO). If you call the API too often, you will get a parsing error because it has a limit (up to 5 API requests per minute and 500 requests per day). 
