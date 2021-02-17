'use strict';

const Gpio = require("pigpio").Gpio;


// RADIO
const rf=require("nrf24");
const readline = require('readline');

const CE = new Gpio(22, {mode: Gpio.INPUT});
const CS= new Gpio(8, {mode: Gpio.INPUT});
const IRQ=-1;
console.log("Cofiguration pins CE->",CE," CS->",CS," IRQ->",IRQ);
var radio=new rf.nRF24(CE,CS);

radio.begin(false);

var ready=radio.present();
if(!ready) {
  console.log("ERROR:Radio is not ready!");
  process.exit(1);
}

var config={PALevel:rf.RF24_PA_MIN,
            EnableLna: false,
            DataRate:rf.RF24_1MBPS,
            Channel:76,
            AutoAck:false,
            Irq: IRQ
          };

radio.config(config,true);

var Pipes= ["0x65646f4e31","0x65646f4e32"]; // "1Node", "2Node"

function rcv(){

  var rpipe=radio.addReadPipe(Pipes[0]);
  console.log("Read Pipe "+ rpipe + " opened for " + Pipes[0]);
  radio.useWritePipe(Pipes[1]);
  radio.read(function(d,items) {
    for(var i=0;i<items;i++){
      let r=d[i].data.readUInt32LE(0);
      console.log("Payload Rcv [" + r +"], reply result:" + radio.write(d[i].data));
    }
  },function() { console.log("STOP!"); });

}


// FUNCTION FOR STREAMING DATA
function snd(do_sync) {

// START GPS
const SerialPort = require("serialport");
const SerialPortParser = require("@serialport/parser-readline");
console.log(SerialPortParser);

const GPS = require("gps");

const request = require("request-promise");

const port = new SerialPort("/dev/ttyS0", {baudRate: 9600});
const gps = new GPS();

let latitudeLong = "";
let latitudeShort = "";
let longitudeLong = "";
let longitudeShort = "";

let latLon = {
"lati": "0",
"longi": "0"
}

const parser = port.pipe(new SerialPortParser());


gps.on("data", data => {
	if(data.type === "GGA") { // just the relevant data, ignores the rest
		if(data.quality !== null) { // check if there is something in GGA
			latitudeLong = data.lat;
			latitudeShort = latitudeLong.toString().substring(0, 9);		
			latLon.lati = latitudeShort;


			longitudeLong = data.lon;
			longitudeShort = longitudeLong.toString().substring(0, 9);
			latLon.longi = longitudeShort;
		}	
	}
});


parser.on("data", data => {
	gps.update(data);
}); 


// END GPS MODULE, START RADIO
  radio.useWritePipe(Pipes[1]);
  radio.addReadPipe(Pipes[0]);
  console.log("Open Write Pipe "+ Pipes[1]+ " reading from " + Pipes[0]);

  var tmstp;
  var roundtrip;
  var sender=function(){
   // var data=Buffer.alloc(32);

radio.changeWritePipe(true, 2048);
	//var data = Buffer.from(JSON.stringify(latLon));
		var data = Buffer.from("Hallo");

	radio.stream(data, (success, tx_ok, tx_bytes, tx_req, frame_size, aborted) => {
		if(success) { 
			console.log("Stream ok");
		} else {
			console.log("error " + data);
		} 

	});
  
    }


  radio.read(function(d,n) {
    if(n==1){
      let t=process.hrtime(roundtrip);
      process.stdout.write(" | response received |")
      let ret=d[0].data.readUInt32LE(0);
      if( ret == tmstp) process.stdout.write(" reponse matchs ");
      else process.stdout.write(" response does not match "+ ret + " != " + tmstp);
      console.log("| roundtrip took", (t[1] /1000).toFixed(0)," us");
    }
  },function(){ console.log("STOPPED!"); });

  setInterval(sender,1000); // send every 1 sec.

}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("RF24 GettingStarted");
console.log("This script assumes that this radio is radionumber=1 in ardunino.");
console.log("Other radio must be configured with radionumber=0")
rl.question("[s]ender or [R]eceiver?",(resp)=>{
  var mode=resp.charAt(0);
  if(mode.toUpperCase()=="S") {
    rl.question("Send [s]ync or [A]sync?",(resp2)=>{
       var asy=resp2.charAt(0);
       console.log("Starting snd... press CTRL+C to stop");
       if(asy.toUpperCase()=="S") snd(true);
       else snd(false);
       rl.close(); 
    }); 
  }else {
    console.log("Starting rcv.... press CTRL+C to stop");
    rcv();
    rl.close();
  }
});