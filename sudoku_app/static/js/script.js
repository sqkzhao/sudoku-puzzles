var board = []; //can be updated
var original_board = [];
var solved_sudoku = [];
var notes = [];
var pencil_on = false;
var difficulty = "easy";
var fact_num = "random";
var fact = "";
var steps = 0;
var highlight_value;



function newGame(){
    location.reload();
}

function generateBoard(difficulty){
    // get board from api; generate board
    $.get("https://sugoku.herokuapp.com/board?difficulty="+difficulty, function(data){
        board = data['board'];
        var output = renderBoard();
        document.getElementById('board').innerHTML = output;
        renderFact(fact_num);
        startStop();
    });
}

function renderBoard(){
    let output = '';
    let initialRender = true;
    if(original_board.length != 0){
        // do not create copy of original & solved_board
        initialRender = false;
    }
    for(var row = 0; row < board.length; row++){
        let temp = [];
        let tempArr = [];
        let noteArr = [];
        if(row == 2 || row == 5){
            output += "<tr class='border-bottom'>";
        } else{
            output += "<tr>";
        }
        for(var col = 0; col < board[row].length; col++){
            // empty
            if(board[row][col] == 0){
                if(col == 2 || col == 5) {
                    output+=`<td>
                                <div id=${row}${col} class='number-box empty-box border-right border-dark'></div>
                            </td>`;
                } else {
                    output+=`<td>
                                <div id=${row}${col} class='number-box empty-box'></div>
                            </td>`;
                }
            }
            // has value
            else{
                if(col == 2 || col == 5) {
                    output+=`<td>
                                <div id=${row}${col} class='number-box border-right border-dark text-info'>${board[row][col]}</div>
                            </td>`;
                } else{
                    output+=`<td>
                                <div id=${row}${col} class='number-box text-info'>${board[row][col]}</div>
                            </td>`;
                }
            }
            // create copy of original board;
            temp.push(board[row][col]);
            tempArr.push(board[row][col]);
            noteArr.push([]);
        }
        output += "</tr>";
        if(initialRender){
            original_board.push(temp);
            solved_sudoku.push(tempArr);
            notes.push(noteArr);
        }
    }
    return output;
}

function renderFact(number){
    $.get("http://numbersapi.com/" + number, function(data){
        fact = data;
        const index = fact.indexOf('is');
        document.getElementById('fact').innerHTML = `<span class='h3'>${fact.slice(0, index)}</span> ${fact.slice(index)}`;
    })
}

function generateNoteOutput(row, col) {
    let notelist = notes[row][col];
    let note_output = `<div class='row m-0 p-0'>`;
    for(var i = 1; i < 4; i++) {
        if(notelist.includes(i.toString())){
            note_output += `<span class='note-box-cell col m-0 p-0'>${i}</span>`;
        } else {
            note_output += `<span class='note-box-cell col m-0 p-0'>&nbsp;</span>`;
        }
    }
    note_output += `</div><div class='row m-0 p-0'>`;
    for(var i = 4; i < 7; i++) {
        if(notelist.includes(i.toString())){
            note_output += `<span class='note-box-cell col m-0 p-0'>${i}</span>`;
        } else {
            note_output += `<span class='note-box-cell col m-0 p-0'>&nbsp;</span>`;
        }
    }
    note_output += `</div><div class='row m-0 p-0'>`;
    for(var i = 7; i < 10; i++) {
        if(notelist.includes(i.toString())){
            note_output += `<span class='note-box-cell col m-0 p-0'>${i}</span>`;
        } else {
            note_output += `<span class='note-box-cell col m-0 p-0'>&nbsp;</span>`;
        }
    }
    note_output += `</div>`;
    return note_output;
}

function reRenderBoard(sudoku_board){
    let output = '';
    for(var row = 0; row < sudoku_board.length; row++){
        if(row == 2 || row == 5){
            output += "<tr class='border-bottom'>";
        } else{
            output += "<tr>";
        }
        for(var col = 0; col < sudoku_board[row].length; col++){
            // set value
            if(sudoku_board[row][col] == 0) {
                value = "";
            } else { 
                value = sudoku_board[row][col];
            }
            // empty
            if(original_board[row][col] == 0){
                if(notes[row][col].length > 0){
                    // render note-box
                    let note_output = generateNoteOutput(row, col);
                    if(col == 2 || col == 5) {
                        output+=`<td>
                                    <div id=${row}${col} class='note-box empty-box border-right border-dark'>
                                        ${note_output}
                                    </div>
                                </td>`;
                    } else {
                        output+=`<td>
                                    <div id=${row}${col} class='note-box empty-box'>
                                        ${note_output}
                                    </div>
                                </td>`
                    }
                } else {
                    // render number-box
                    if(col == 2 || col == 5) {
                        output+=`<td>
                                    <div id=${row}${col} class='number-box empty-box border-right border-dark'>
                                        ${value}
                                    </div>
                                </td>`;
                    } else {
                        output+=`<td>
                                    <div id=${row}${col} class='number-box empty-box'>
                                        ${value}
                                    </div>
                                </td>`;
                    }
                }
            }
            // original board number
            else{
                if(col == 2 || col == 5) {
                    output+=`<td>
                                <div id=${row}${col} class='number-box border-right border-dark text-info'>${sudoku_board[row][col]}</div>
                            </td>`;
                } else{
                    output+=`<td>
                                <div id=${row}${col} class='number-box text-info'>${sudoku_board[row][col]}</div>
                            </td>`;
                }
            }
        }
        output += "</tr>";
    }
    document.getElementById('board').innerHTML = output;
}



// SOLVER FUNCTIONS
function checkRows(){
    let correct = true;
    for(var row = 0; row < 9; row++){
        var arr = [];
        for(var col = 0; col < 9; col ++){
            if(solved_sudoku[row][col] != 0){
                if(arr.includes(solved_sudoku[row][col]) == true){
                    correct = false;
                }
                else if(arr.includes(solved_sudoku[row][col]) == false){
                    arr.push(solved_sudoku[row][col]);
                }
            }
        }
    }
    return correct;
}

function checkCols(){
    let correct = true;
    for(var col = 0; col < 9; col++){
        var arr = [];
        for(var row = 0; row < 9; row++){
            if(solved_sudoku[row][col] != 0){
                if(arr.includes(solved_sudoku[row][col]) == true){
                    correct = false;
                }
                else if(arr.includes(solved_sudoku[row][col]) == false){
                    arr.push(solved_sudoku[row][col]);
                }
            }
        }
    }
    return correct;
}

function checkBox(r,c){
    let correct = true;
    let arr = [];
    for(var row = r; row < (r+3); row++){
        for(var col = r; col < (r+3); col++){
            if(solved_sudoku[row][col] != 0){
                if(arr.includes(solved_sudoku[row][col]) == true){
                    correct = false;
                }
                else if(arr.includes(solved_sudoku[row][col]) == false){
                    arr.push(solved_sudoku[row][col]);
                }
            }
        }
    }
    return correct;
}

function checkAllBoxes(){
    for(var row = 0; row < 7; row=row+3){
        for(var col = 0; col < 7; col=col+3){
            if(checkBox(col, row) == false){
                return false;
            }
        }
    }
    return true;
}

function checkEverything(){
    if(checkRows() === false){
        return false;
    }
    if(checkCols() === false){
        return false;
    }
    if(checkAllBoxes() === false){
        return false;
    }
    return true;
}

function isEmpty(position){
    for(var row = 0; row < 9; row++){
        for(var col = 0; col < 9; col++){
            if(solved_sudoku[row][col] == 0){
                position[0] = row;
                position[1] = col;
                return true;
            }
        }
    }
    return false;
}

function inputNumber(row, col, number){
    solved_sudoku[row][col] = number;
    if(checkEverything() == true){
        return true;
    }
    solved_sudoku[row][col] = 0;
    return false;
}

function solver(){
    let position = [0,0];

    let checkEmpty = isEmpty(position);
    if(checkEmpty === false){
        return true;
    }
    let row = position[0];
    let col = position[1];
    
    for(var number=1; number < 10; number++){
        let isValid = inputNumber(row, col, number);
        if(isValid){
            solved_sudoku[row][col] = number;
            if(solver()){
                return true;
            }
            solved_sudoku[row][col] = 0;
        }
    }
    return false;
}

function validateInput(original_board, board, solved_sudoku){
    for(var row = 0; row < 9; row++){
        for(var col = 0; col < 9; col++){
            if(original_board[row][col] == 0 && board[row][col] != 0){
                // check board with solved_sudoku
                if(board[row][col] != solved_sudoku[row][col]){
                    let id = `${row}${col}`;
                    $(`#${id}`).css("color", "red");
                }
            }
        }
    }
}

// hightlight all the same numbers
function highlight(value){
    if(value != 0){
        for(var row = 0; row < 9; row++){
            for(var col = 0; col < 9; col++){
                if(board[row][col] == value){
                    $(`#${row}${col}`).css("background-color", "#d2f2fc");
                }else {
                    $(`#${row}${col}`).css("background-color", "white");
                }
            }
        }
    } 
}



// BUTTONS & INPUTS
// NUMBER CELLS 
// get id & change effects of the number-box
var cell_id, set_value;
$(document).on('click', '.empty-box', function(){
    cell_id = this.id;
    // $(`#${cell_id}`).css("color", "black");
    highlight(null);
    $(`#${cell_id}`).css("background-color", "#d2f2fc");
    renderFact(parseInt(cell_id));
});

// NUMBER-BOX
$(document).on('click', '.number-box', function(){
    let box_id = this.id;
    if(box_id.length === 1){
        box_id = '0' + box_id;
    }
    let value = board[box_id[0]][box_id[1]];
    highlight_value = value;
    highlight(highlight_value);
})
// NUMBER BUTTONS - get the clicked button value, and set it as the input value
$(document).on('click', 'button:not(#validate, #clear, #solution)', function(){
    set_value = $(this).val();
    if(!pencil_on){
        if(cell_id){
            board[cell_id[0]][cell_id[1]] = parseInt(set_value);
            if(notes[cell_id[0]][cell_id[1]]){
                notes[cell_id[0]][cell_id[1]] = [];
            }
        }
        reRenderBoard(board);
        highlight_value = set_value;
        highlight(highlight_value);
    } else{
        if(cell_id){
            if(!notes[cell_id[0]][cell_id[1]]){
                notes[cell_id[0]][cell_id[1]] = [];
            } 
            if(!notes[cell_id[0]][cell_id[1]].includes(set_value)){
                notes[cell_id[0]][cell_id[1]].push(set_value);
            }
        }
        reRenderBoard(board);
    }
    renderFact(set_value);
    // cell_id = null;
});
// VALIDATE
$(document).on('click', '#validate', function(){
    validateInput(original_board, board, solved_sudoku);
});
// CLEAR
$(document).on('click', '#clear', function(){
    if(this.id == 'clear'){
        for(var row = 0; row < 9; row++){
            for(var col = 0; col < 9; col++){
                let new_val = original_board[row][col];
                board[row][col] = new_val;
            }
        }
        let temp_output = renderBoard(original_board);
        document.getElementById('board').innerHTML = temp_output;
    }
});
// SOLUTION
$(document).on('click', '#solution', function(){
    if(this.id == 'solution'){
        reRenderBoard(solved_sudoku);
        validateInput(original_board, board, solved_sudoku);
        for(var row = 0; row < 9; row++){
            for(var col = 0; col < 9; col++){
                if(original_board[row][col] == 0){
                    if(board[row][col] != solved_sudoku[row][col]){
                        const temp = solved_sudoku[row][col];
                        board[row][col] = temp;
                    } 
                }
            }
        }
    }
});
// DIFFICULTY
$(document).on('click', '#difficulty', function(){
    let difficulty = $(this).attr("value");
    location.reload();
    generateBoard(difficulty);
    difficulty="easy";
});
// NOTE-BUTTON
$(document).on('click', '#note-button', function(){
    if(pencil_on){
        // change pencil status
        document.getElementById('pencil-status').innerHTML = `<i class="far fa-times-circle"></i>`;
    } else {
        document.getElementById('pencil-status').innerHTML = `<i class="far fa-check-circle"></i>`;
    }
    pencil_on = !pencil_on;
})

$(document).ready(function(){
    generateBoard(difficulty);
});
// DELETE KEYDOWN
// document.addEventListener("keydown", e => {
//     var input_id;
//     if(e.keyCode == 8){
//         input_id = e.target.id;
//         console.log(board[input_id[0]][input_id[1]])
//         board[input_id[0]][input_id[1]] = 0;
//         console.log(input_id,input_id[0], board[input_id[0]][input_id[1]] )
//         highlight(highlight_value);
//     }
// });



// TIMER
let seconds = 0;
let minutes = 0;
let hours = 0;
//Define vars to hold "display" value
let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;
//Define var to hold setInterval() function
let interval = null;
//Define var to hold stopwatch status
let status = "stopped";

//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch(){
    seconds++;
    //Logic to determine when to increment next value
    if(seconds / 60 === 1){
        seconds = 0;
        minutes++;

        if(minutes / 60 === 1){
            minutes = 0;
            hours++;
        }
    }
    //If seconds/minutes/hours are only one digit, add a leading 0 to the value
    if(seconds < 10){
        displaySeconds = "0" + seconds.toString();
    }
    else{
        displaySeconds = seconds;
    }
    if(minutes < 10){
        displayMinutes = "0" + minutes.toString();
    }
    else{
        displayMinutes = minutes;
    }
    if(hours < 10){
        displayHours = "0" + hours.toString();
    }
    else{
        displayHours = hours;
    }
    // run solver() when timer started
    if(displayHours + ":" + displayMinutes + ":" + displaySeconds === "00:00:01"){
        solver();
    }
    //Display updated time values to user
    document.getElementById("display").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
}

function startStop(){
    if(status === "stopped"){
        //Start the stopwatch (by calling the setInterval() function)
        interval = window.setInterval(stopWatch, 1000);
        document.getElementById("startStop").innerHTML = `<i class="far fa-pause-circle"></i>`;
        status = "started";
    }
    else{
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = `<i class="far fa-play-circle"></i>`;
        status = "stopped";
    }
}

//Function to reset the stopwatch
function reset(){
    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById("display").innerHTML = "00:00:00";
    document.getElementById("startStop").innerHTML = "Start";
}