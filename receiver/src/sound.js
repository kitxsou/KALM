

const player = require("play-sound") (opts = {});

const sound = ("../sounds/sirena.mp3")

player.play(sound, {timeout: 300}, (err, succ)=>{
    if (err){
        console.error(err.message);
    }
    console.log("finish");
});

