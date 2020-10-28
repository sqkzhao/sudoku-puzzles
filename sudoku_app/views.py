from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from login_app.models import *

def index(request):
    print("request post:  ", request.POST)
    # regenerate board
    new_board = []
    for i in range(9):
        row_arr = []
        for i in request.POST.getlist('board[1][]'):
            value = int(i)
            row_arr.append(value)
        new_board.append(row_arr)
    print("this is new board" , new_board)
    return render(request, 'sudoku.html')

def new_game(request):
    return redirect('/')

def how_to_play(request):
    return render(request, 'how_to_play.html')

def medium(request):
    return render(request, 'sudoku_medium.html')

def hard(request):
    return render(request, 'sudoku_hard.html')