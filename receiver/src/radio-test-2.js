'use strict';

const rf=require("nrf24");
const Gpio = require("pigpio").Gpio;


//LED
const led = new Gpio(17, {mode: Gpio.OUTPUT});
//Vibrationsmotor
const vMotor = new Gpio(27, {mode: Gpio.INPUT});
//Button
const button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
});

const CE=22,CS=0;
const IRQ=-1;
//console.log("Cofiguration pins CE->",CE," CS->",CS," IRQ->",IRQ);
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
            AutoAck:true,
            Irq: IRQ
          };


radio.config(config,false);
const pipe = "0x65646f4e32" 
radio.addReadPipe(pipe);

let setInt = setInterval(loop,1000);

function loop(){
  rcv();
}

function rcv(){
  if (radio.read){
    warning(false);
  }
  else {
    warning(false);
  }
  console.log(radio.read())
  radio.read(function(d,items) {
    let data = d[0].data.toString();
      console.log(data);
  },function() { console.log("STOP!"); });
}

function warning(bool){
  if (bool === true){
  led.pwmWrite(255);
  vMotor.pwmWrite(255);
}
  else{
    led.pwmWrite(0);
    vMotor.pwmWrite(0);
  }
}
button.on("interrupt", (level) => {
  console.log("bStatus: " + level);
  //endLoop();
  warning(false);
  });

function clearInt() {
    clearInterval(setInt);
}

//ctrl + c in node
process.on("SIGINT",clearInt);