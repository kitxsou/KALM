activateAmbientEffects(0, true);

function activateAmbientEffects(val, countingUp) {
  console.log("Entering activateAmbientEffects()");
  //Ein Song wird gespielt (Pfad bitte anpassen)
  playSound("Pfad");
  //Do While ist wie While, nur der Inhalt der Funktion wird mindestens einmal durchgespielt
  do {
    if (countingUp === true) {
      val++;
      //console.log("💫fading in💫" + val);
      //hohe Zahl, damit das Pulsieren länger anhält

      if (val >= 25500) {
        countingUp = false;
      }
    } else {
      val--;
      //console.log("💫fading out💫" + val);
      if (val <= 1000) {
        countingUp = true;
      }
    }
    //da die LED und der Button einen integer wollen, wird die Zahl nach oben gerundet.
    nVal = Math.ceil(val / 100);
    console.log(nVal);
    //LED und vibrationMotor werden aktiviert
    ledIsLit(nVal);
    //falls der Vibrationsmotor immernoch nicht pulsieren will, schreibe hier einfach eine Zahl rein. Ansonsten habe ich unten noch eine Alternative
    vibrationMotorIsVibrating(nVal);
    //wenn der Button gedrückt wird, wird das hier ausgegeben
    if (buttonPressed()) {
      console.log("finished");
    }
    //Solange der Button nicht gedrückt wird, wird die Schleife ausgeführt.
  } while (!buttonPressed());
}

//Hier habe ich einfach eine Zahl, die hochzählt, bis ein event eintritt. Das sollte natürlich noch geändert werden.
//du könntest aber auch einfach, statt der Funktion button.on("interrupt",()=>{}); schreiben, weil die Funktion darin ohnehin
//immer ausgeführt wird, wenn der Button gedrückt wird.
function buttonPressed() {
  let d = new Date();
  let s = d.getSeconds();
  console.log(s);
  if (s >= 30 && s <= 35) {
    return true;
  } else {
    return false;
  }
}

function ledIsLit(level) {
  console.log("LED: " + level);
}

function vibrationMotorIsVibrating(level) {
  //Ein Array mit Zahlen zwischen 0 und 60 in zweierschritten
  let arr = [];
  for (let i = 0; i <= 60; i = i + 2) {
    arr.push(i);
  }
  let l1 = level;
  let l2;
  let d = new Date();
  let s = d.getSeconds();
  //alle zwei Sekunden wird der level ausgegeben (das mit l1 und l2
  //funktioniert leider irgendwie nicht. Mein Plan war es, dass der console log nur bei einer neuen Zahl ausgeführt wird.
  //vielleicht funktioniert es auch so?)
  if (arr.includes(s) && l2 !== l1) {
    console.log("VibrationMotor: " + level);
  }
  l2 = level;
}

function playSound(path) {
  console.log("played Sound");
}
