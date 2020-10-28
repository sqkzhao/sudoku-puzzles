var board = []; //can be updated
var allInputs = [];
var solved_sudoku = [];

// display timer
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
    //Display updated time values to user
    document.getElementById("display").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;
}

function startStop(){
    if(status === "stopped"){
        //Start the stopwatch (by calling the setInterval() function)
        interval = window.setInterval(stopWatch, 1000);
        document.getElementById("startStop").innerHTML = "Stop";
        status = "started";
    }
    else{
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
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

// function printSubGridBorder(){
//     for(var row = 0; row < board.length; row++){
//         for( var col = 0; col < board[row].length; col++){
//             if((row == 2) || (row == 5)){
//                 // var cell = document.getElementById(`${row}${col}`);
//                 var cell_id = `${row}${col}`;
//                 console.log("cell", cell_id);
//                 $("#cell_id").css("border-right", "red");
//             }
//         }
//     }
// }

var difficulty = "medium";
// $(document).on('click', '.dropdown-item', function(){
//     var difficulty = $(this).attr("value");
//     console.log(difficulty);
//     generateBoard();
// });

function generateBoard(){
    var csrf = $("#csrf").val()
    var output = '';
    // get board from api; generate board
    console.log(difficulty);
    $.get("https://sugoku.herokuapp.com/board?difficulty="+difficulty, function(data){
        board = data['board'];
        original_board = data['board'];
    for(var row = 0; row < board.length; row++){
        output += "<tr>";
        for( var col = 0; col < board[row].length; col++){
            if(board[row][col] == 0){
                output += `<td><input type='text' maxlength='0' id=${row}${col}></td>`;
            }
            else{
                output += `<td><input type='text' maxlength='1' value=${board[row][col]} disabled></td>`;
            }
        }
        output += "</tr>";
    }
    console.log("BOARD: ",board)
    // $.ajaxSetup({
    //     beforeSend:(xhr, settings) =>{
    //         xhr.setRequestHeader("X-CSRFToken", csrf)
    //     },
    //     url:"http://localhost:8000/",
    //     type:"POST",
    //     crossDomain:true,
    //     data:{
    //         "board":board
    //     },
    //     success:()=>{
    //         console.log('success')
    //     },
    //     complete:()=>{
    //         console.log("complete")
    //     }
    // })
    // $.ajax()
    document.getElementById('board').innerHTML = output;
    // printSubGridBorder();
    // console.log("generated board:", board);
    });
}

generateBoard();

var cell_id, set_value;
// get the selected input id
$(document).on('focus', 'input', function(){
    cell_id = this.id;
    // console.log("cell_id:", cell_id);
    $(`#${cell_id}`).css("color", "black");
});

// get the clicked button value, and set it as the input value
$(document).on('click', 'button:not(#validate, #clear, #solution)', function(){
    console.log('clicked NUMBER');
    set_value = $(this).val();
    var cell = document.getElementById(cell_id)
    if(set_value == 0){
        $(cell).val(null);
        // if earased, pop from allInputs
        for(var i=0; i < allInputs.length; i++){
            if(allInputs[i] == cell.id){
                allInputs.splice(i, 1);
            }
        }
    }
    else{
        $(cell).val(set_value);
        allInputs.push(cell_id);    // keep track what has been entered
    }
    board[cell_id[0]][cell_id[1]] = parseInt(set_value);
    
    console.log("interval",interval);
    console.log(allInputs);
    console.log(board);
});


// sudoku validation
function checkRows(){
    var correct = true;
    for(var row = 0; row < 9; row++){
        var arr = [];
        for(var col = 0; col < 9; col ++){
            if(board[row][col] != 0){
                if(arr.includes(board[row][col]) == true){
                    var id = `${row}${col}`;
                    if(allInputs.includes(id) == true){
                        $(`#${id}`).css("color", "red");
                    }
                    correct = false;
                }
                else if(arr.includes(board[row][col]) == false){
                    arr.push(board[row][col]);
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
            if(board[row][col] != 0){
                if(arr.includes(board[row][col]) == true){
                    var id = `${row}${col}`;
                    if(allInputs.includes(id) == true){
                        $(`#${id}`).css("color", "red");
                    }
                    correct = false;
                }
                else if(arr.includes(board[row][col]) == false){
                    arr.push(board[row][col]);
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
            if(board[row][col] != 0){
                if(arr.includes(board[row][col]) == true){
                    var id = `${row}${col}`;
                    if(allInputs.includes(id) == true){
                        $(`#${id}`).css("color", "red");
                    }
                    correct = false;
                }
                else if(arr.includes(board[row][col]) == false){
                    arr.push(board[row][col]);
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

$(document).on('click', '#validate', function(){
    console.log('clicked VALIDATE');
    validate_result = [];
    // check if board is valid
    console.log(checkRows());
    console.log(checkCols());
    console.log(checkAllBoxes());
    // return checkEverything();
});

$(document).on('click', '#clear', function(){
    if(this.id == 'clear'){
        console.log('clicked CLEAR');
        for(var i=0; i < allInputs.length; i++){
            cell_id = allInputs[i];
            board[cell_id[0]][cell_id[1]] = 0;
            var cell = document.getElementById(cell_id)
            $(cell).val(null);
        }
        allInputs = []; // added this
    }
});

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
            if(board[row][col] == 0){
                position[0] = row;
                position[1] = col;
                return true;
            }
        }
    }
    return false;
}

function inputNumber(row, col, number){
    board[row][col] = number;
    if(checkEverything() == true){
        console.log(board);
        return true;
    }
    board[row][col] = 0;
    return false;
}

function solver(){
    var position = [0,0];

    var checkEmpty = isEmpty(position);
    console.log("empty position", position);
    if(checkEmpty === false){
        return true;
    }
    var row = position[0];
    var col = position[1];
    
    for(var number=1; number < 10; number++){
        var isValid = inputNumber(row, col, number);
        if(isValid){
            board[row][col] = number;
            // console.log("inputting number: ", row, col, "value", board[row][col] );
            if(solver()){
                return true;
            }
            board[row][col] = 0;
        }
    }
    console.log(board);
    return false;
}

$(document).on('click', '#solution', function(){
    if(this.id == 'solution'){
        console.log('clicked SOLUTION');
        for(var i = 0; i < board.length; i++){
            solved_sudoku.push(board[0]);
        }
        solver();
        var x = "";
        for(var i = 0; i < board.length; i++){
            var str = board[i].join();
            x += str;
        }
        // alert(output);
        var output = '';

        for(var row = 0; row < board.length; row++){
            output += "<tr>";
            for( var col = 0; col < board[row].length; col++){
                if(board[row][col] == 0){
                    output += `<td><input type='text' maxlength='0' id=${row}${col}></td>`;
                }
                else{
                    output += `<td><input type='text' maxlength='1' value=${board[row][col]} disabled></td>`;
                }
            }
            output += "</tr>";
        }
        document.getElementById('board').innerHTML = output;
        // alert("solved sudoku:",board);
        // for(var i=0; i < allInputs.length; i++){
        //     cell_id = allInputs[i];
        //     board[cell_id[0]][cell_id[1]] = 0;
        //     var cell = document.getElementById(cell_id)
        //     $(cell).val(null);
        // }
    }
});
