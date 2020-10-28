var board = []; //can be updated
var original_board = [];
var solved_sudoku = [];
var notes = {};
var note_cell = {
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false,
    '9': false,
}
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
        var output = renderBoard(board);
        document.getElementById('board').innerHTML = output;
        renderFact(fact_num);
        startStop();
        // solver();
    });
}

function renderBoard(board){
    var output = '';
    var initialRender = true;
    if(original_board.length != 0){
        // do not create copy of original & solved_board
        initialRender = false;
    }
    for(var row = 0; row < board.length; row++){
        if(row == 2 || row == 5){
            output += "<div class='row border-bottom border-dark'>";
        } else{
            output += "<div class='row'>";
        }
        var temp = [];
        var tempArr = [];
        for( var col = 0; col < board[row].length; col++){
            // empty
            if(board[row][col] == 0){
                if(col == 2 || col == 5) {
                    output+=`<li value=${row}${col} id='number-grid' class='col border-right border-dark m-0 p-0'>
                                <input type='text' maxlength='0' id=${row}${col} class='col'>
                            </li>`;
                    // output+=`<div class='col border-right border-dark m-0 p-0'>
                    //             <div id='note-grid'>
                    //                 <div class='row m-0 p-0'>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>1</span>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>2</span>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>3</span>
                    //                 </div>
                    //                 <div class='row m-0 p-0'>

                    //                     <span id='note-grid-cell' class='col m-0 p-0'>4</span>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>5</span>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>6</span>
                    //                 </div>
                    //                 <div class='row m-0 p-0'>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>7</span>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>8</span>
                    //                     <span id='note-grid-cell' class='col m-0 p-0'>9</span>
                    //                 </div>
                    //             </div>
                    //         </div>`;
                } else {
                    output+=`<li value=${row}${col} class='col m-0 p-0'>
                                <input type='text' maxlength='0' id=${row}${col} class='col'>
                            </li>`;
                }
                if(initialRender){
                    notes[`${row}${col}`] = note_cell;
                }
            }
            // disabled
            else{
                if(col == 2 || col == 5) {
                    output+=`<li value=${row}${col} class='col border-right border-dark m-0 p-0'>
                                    <input type='text' maxlength='1' id=${row}${col} value=${board[row][col]} disabled class='bg-muted text-info col'>
                                </li>`;
                } else{
                    output+=`<li value=${row}${col} class='col m-0 p-0'>
                                <input type='text' maxlength='1' id=${row}${col} value=${board[row][col]} disabled class='bg-muted text-info col'>
                            </li>`;
                }
            }
            // create copy of original board;
            temp.push(board[row][col]);
            tempArr.push(board[row][col]);
        }
        output += "</div>";
        if(initialRender){
            original_board.push(temp);
            solved_sudoku.push(tempArr);
        }
    }
    // console.log(notes);
    return output;
}

function renderFact(number){
    $.get("http://numbersapi.com/" + number, function(data){
        fact = data;
        const index = fact.indexOf('is');
        document.getElementById('fact').innerHTML = `<span class='h3'>${fact.slice(0, index)}</span> ${fact.slice(index)}`;
    })
}



// SOLVER FUNCTIONS
function checkRows(){
    var correct = true;
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
    var correct = true;
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
    var correct = true;
    var arr = [];
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
    var position = [0,0];

    var checkEmpty = isEmpty(position);
    if(checkEmpty === false){
        return true;
    }
    var row = position[0];
    var col = position[1];
    
    for(var number=1; number < 10; number++){
        var isValid = inputNumber(row, col, number);
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

function renderSolution(){
    var output = '';
    for(var row = 0; row < solved_sudoku.length; row++){
        if(row == 2 || row == 5){
            output += "<div class='row border-bottom border-dark'>";
        } else{
            output += "<div class='row'>";
        }
        for( var col = 0; col < solved_sudoku[row].length; col++){
            // empty
            if(original_board[row][col] == 0){
                if(col == 2 || col == 5) {
                    output+=`<li value=${row}${col} class='col border-right border-dark m-0 p-0'>
                                <input type='text' maxlength='0' id=${row}${col} value=${solved_sudoku[row][col]} class='col'>
                            </li>`;
                } else {
                    output+=`<li value=${row}${col} class='col m-0 p-0'>
                                <input type='text' maxlength='0' id=${row}${col} value=${solved_sudoku[row][col]} class='col'>
                            </li>`;
                }
            }
            // disabled
            else{
                if(col == 2 || col == 5) {
                    output+=`<li value=${row}${col} class='col border-right border-dark m-0 p-0'>
                                <input type='text' maxlength='1' id=${row}${col} value=${solved_sudoku[row][col]} disabled class='bg-muted text-info col'>
                            </li>`;
                } else{
                    output+=`<li value=${row}${col} class='col m-0 p-0'>
                                <input type='text' maxlength='1' id=${row}${col} value=${solved_sudoku[row][col]} disabled class='bg-muted text-info col'>
                            </li>`;
                }
            }
        }
        output += "</div>";
    }
    document.getElementById('board').innerHTML = output;
}

function validateInput(original_board, board, solved_sudoku){
    for(var row = 0; row < 9; row++){
        for(var col = 0; col < 9; col++){
            if(original_board[row][col] == 0 && board[row][col] != 0){
                // check board with solved_sudoku
                if(board[row][col] != solved_sudoku[row][col]){
                    var id = `${row}${col}`;
                    $(`#${id}`).css("color", "red");
                }
            }
        }
    }
}

function highlight(value){
    if(value != 0){
        for(var row = 0; row < 9; row++){
            for(var col = 0; col < 9; col++){
                if(board[row][col] == value){
                    $(`#${row}${col}`).css("background-color", "#d2f2fc");
                }else{
                    $(`#${row}${col}`).css("background-color", "white");
                }
            }
        }
    }
}



// BUTTONS & INPUTS
// NUMBER CELLS - get the selected input id
var cell_id, set_value;
$(document).on('focus', 'input', function(){
    cell_id = this.id;
    $(`#${cell_id}`).css("color", "black");
    renderFact(parseInt(cell_id));
});

$(document).on('click', 'li', function(){
    var input_id = $(this).val().toString();
    if(input_id.length === 1){
        input_id = '0' + input_id;
    }
    var value = board[input_id[0]][input_id[1]];
    highlight_value = value;
    highlight(highlight_value);
    // cell_id = undefined;
})

// NUMBER BUTTONS - get the clicked button value, and set it as the input value
$(document).on('click', 'button:not(#validate, #clear, #solution)', function(){
    set_value = $(this).val();
    var cell = document.getElementById(cell_id)
    if(set_value == 0){ // 0
        $(cell).val(null);
    }
    else{   // 1-9
        $(cell).val(set_value);
    }
    if(cell_id){
        board[cell_id[0]][cell_id[1]] = parseInt(set_value);
    }
    highlight_value = set_value;
    highlight(highlight_value);
    renderFact(set_value);
    cell_id = undefined;
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
                var new_val = original_board[row][col];
                board[row][col] = new_val;
            }
        }
        var temp_output = renderBoard(original_board);
        document.getElementById('board').innerHTML = temp_output;
    }
});
// SOLUTION
$(document).on('click', '#solution', function(){
    if(this.id == 'solution'){
        renderSolution();
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
    var difficulty = $(this).attr("value");
    location.reload();
    generateBoard(difficulty);
    difficulty="easy";
});
// DELETE KEYDOWN
document.addEventListener("keydown", e => {
    var input_id;
    if(e.keyCode == 8){
        input_id = e.target.id;
        console.log(board[input_id[0]][input_id[1]])
        board[input_id[0]][input_id[1]] = 0;
        console.log(input_id,input_id[0], board[input_id[0]][input_id[1]] )
        highlight(highlight_value);
    }
});
// NOTES-BUTTON
$(document).on('click', '#notes-button', function(){
    // renderBoard
})

$(document).ready(function(){
    generateBoard(difficulty);
});



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