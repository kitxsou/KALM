const Gpio = require("pigpio").Gpio;

const led = new Gpio(17, {mode: Gpio.OUTPUT});
//Vibrationsmotor
const vMotor = new Gpio(27, {mode: Gpio.INPUT});
//Button
const button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
});

let buttonMode = false;

//Klick auf Button
button.on("interrupt", (level) => {
console.log("bStatus: " + level);
if (level){
    buttonMode = true;
}
else{
    buttonMode = false;
}
});

let setInt = setInterval(loop,100);

function loop(){
    if (buttonMode){
        led.pwmWrite(255);
        vMotor.pwmWrite(255);
    }
    else {
        vMotor.pwmWrite(0);
        led.pwmWrite(0);

        
    }
}

function endLoop(){
    clearInterval(setInt);
}

//ctrl + c in node
process.on("SIGINT",endLoop);