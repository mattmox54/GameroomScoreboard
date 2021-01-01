const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

//=====================================================================
//READ CONFIG
//=====================================================================
var config_raw = fs.readFileSync(__dirname + "/config.json");
var config = JSON.parse(config_raw);
//console.log(config)

//=====================================================================
//GAME CLASSES
//=====================================================================
class CricketPlayer{
    constructor(name){
        this.name = name;
        this.twenty = config.darts.cricket.blank_img_path;
        this.nineteen = config.darts.cricket.blank_img_path;
        this.eightteen = config.darts.cricket.blank_img_path;
        this.seventeen = config.darts.cricket.blank_img_path;
        this.sixteen = config.darts.cricket.blank_img_path;
        this.fifteen = config.darts.cricket.blank_img_path;
        this.bull = config.darts.cricket.blank_img_path;
    }
}

class CricketGame{
    constructor(){
        this.players = []
    }
    addPlayer(name){
        this.players.push(new CricketPlayer(name));
        this.numPlayers++;
    }
}
//=====================================================================
//GLOBAL VARS
//=====================================================================
var Game = new CricketGame();

//=====================================================================
//EXPRESS
//=====================================================================
app.use(express.static('public'))

http.listen(config.port, () => { //app.listen didn't work when using socket.io, so chnaged to http and things seem ok
  console.log(`Server listening at http://localhost:${config.port}`)
})

//=====================================================================
//SOCKET IO
//=====================================================================
io.on('connection', (socket) => {
    console.log(`SOCKET.IO: ${socket.id} connected`);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('new_player_trigger', (name) => {
        console.log(`new player: ${name}`);
        Game.addPlayer(name);
        io.emit("update_game", Game);
    });
    
    socket.on('cycle_score_trigger', (data) => {
        let row_name = "";

        //console.log(`cycle_score_trigger data = ${JSON.stringify(data)}`)

        if(data.row_id.includes("20")){
            row_name = "twenty";
        }else if(data.row_id.includes("19")){
            row_name = "nineteen";
        }else if(data.row_id.includes("18")){
            row_name = "eightteen";
        }else if(data.row_id.includes("17")){
            row_name = "seventeen";
        }else if(data.row_id.includes("16")){
            row_name = "sixteen";
        }else if(data.row_id.includes("15")){
            row_name = "fifteen";
        }else if(data.row_id.includes("B")){
            row_name = "bull";
        }else{
            console.log("ERROR: Invalid row_id")
        }

        if(row_name != ""){
            //console.log(`row_name = ${row_name}`)
            let current_img = Game.players[data.col_num-1][row_name]
            if(current_img == config.darts.cricket.blank_img_path){
                Game.players[data.col_num-1][row_name] = config.darts.cricket.slash_img_path;
            }else if(current_img == config.darts.cricket.slash_img_path){
                Game.players[data.col_num-1][row_name] = config.darts.cricket.cross_img_path;
            }else if(current_img == config.darts.cricket.cross_img_path){
                Game.players[data.col_num-1][row_name] = config.darts.cricket.circle_img_path;
            }else if(current_img == config.darts.cricket.circle_img_path){
                Game.players[data.col_num-1][row_name] = config.darts.cricket.blank_img_path;
            }else{
                console.log("ERROR: Invalid image path")
            }

            io.emit("update_game", Game);
        }
        
    });

    socket.on("delete_player_trigger", (col_num)=>{
        console.log(`Removed player: ${Game.players[col_num-1].name}`)
        Game.players.splice(col_num-1, 1);
        io.emit("update_game", Game);
    });

    socket.on("reset_scores", ()=> {
        let name = "";
        for(let i=0; i<Game.players.length; i++){
            name = Game.players[i].name
            Game.players.splice(i, 1, new CricketPlayer); //delete index and replace with new blank player
            Game.players[i].name = name
        }

        io.emit("update_game", Game);
    });

    socket.emit("update_game", Game);
});