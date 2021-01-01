var socket = io();
var NumPlayers = 0;
var delete_row = document.getElementById('delete_row');
var name_row = document.getElementById('name_row');
var score20_row = document.getElementById('score20_row');
var score19_row = document.getElementById('score19_row');
var score18_row = document.getElementById('score18_row');
var score17_row = document.getElementById('score17_row');
var score16_row = document.getElementById('score16_row');
var score15_row = document.getElementById('score15_row');
var scoreB_row = document.getElementById('scoreB_row');

socket.on('update_game', (data) => {
    draw_board(data);
});
/*
socket.on('update_img', (data) => {
    update_image(data.col_num, data.row_id, data.img_path);  
});*/

function delete_player(col_num) {
    socket.emit("delete_player_trigger", col_num);
}

function new_player(){
    let name = prompt('Enter player name:')
    if(name!=null){
        socket.emit("new_player_trigger", name)
    }
}

function draw_board(data){
    console.log(`draw_board data: ${JSON.stringify(data)}`);

    clear_board();

    NumPlayers = 0;

    for(let i=0; i<data.players.length; i++){
        add_player(data.players[i]);
        NumPlayers++;
    }
}

function add_player(player){

    console.log(`add_player player: ${JSON.stringify(player)}`);

    let new_cell = delete_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<button class='table_button' onclick="delete_player(${NumPlayers + 1})">Delete</button>`

    new_cell = name_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = player.name;
    new_cell.classList.add("table_header");

    new_cell = score20_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'score20_row')" src="${player.twenty}">`;
    new_cell.classList.add("scores");

    new_cell = score19_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'score19_row')" src="${player.nineteen}">`;
    new_cell.classList.add("scores");

    new_cell = score18_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'score18_row')" src="${player.eightteen}">`;
    new_cell.classList.add("scores");

    new_cell = score17_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'score17_row')" src="${player.seventeen}">`;
    new_cell.classList.add("scores");

    new_cell = score16_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'score16_row')" src="${player.sixteen}">`;
    new_cell.classList.add("scores");

    new_cell = score15_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'score15_row')" src="${player.fifteen}">`;
    new_cell.classList.add("scores");

    new_cell = scoreB_row.insertCell(NumPlayers+1);
    new_cell.innerHTML = `<img onclick="cycle_score(${NumPlayers+1}, 'scoreB_row')" src="${player.bull}">`;
    new_cell.classList.add("scores");

}

function clear_board(){
    for(let i=0; i<NumPlayers; i++){
        delete_column(1);//hard code 1 because as they get deleted they shift and the next to delete becomes col 1
    }
}

function delete_column(col_num){
    delete_row.deleteCell(col_num);
    name_row.deleteCell(col_num);
    score20_row.deleteCell(col_num);
    score19_row.deleteCell(col_num);
    score18_row.deleteCell(col_num);
    score17_row.deleteCell(col_num);
    score16_row.deleteCell(col_num);
    score15_row.deleteCell(col_num);
    scoreB_row.deleteCell(col_num);
}

function cycle_score(col_num, row_id){
    socket.emit("cycle_score_trigger", {col_num:col_num, row_id:row_id});  
}

function reset_scores(){
    socket.emit("reset_scores");
}
/*
function update_image(col_num, row_id, img){
    document.getElementById(row_id).cells[col_num].innerHTML = `<img src="${img}">`
}*/