from django.contrib import messages
from login_app.models import *
from django.shortcuts import render, redirect
import bcrypt


def index(request):
    return render(request, 'index.html')

def register(request):
    if request.POST:
        errors = User.objects.reg_validator(request.POST)
        if len(errors):
            for key, value in errors.items():
                messages.error(request, value)
            return redirect('/sign_in')
        else:
            user = User.objects.create(
                first_name = request.POST['first_name'],
                last_name = request.POST['last_name'],
                email = request.POST['email'],
                password = bcrypt.hashpw(request.POST['password'].encode(),
                    bcrypt.gensalt()).decode() 
            )

            request.session['user_id'] = user.id
            return redirect('/')

def login(request): 
    if request.POST:
        errors = User.objects.log_validator(request.POST)
        if len(errors):
            for key, value in errors.items():
                messages.error(request, value)
            return redirect('/sign_in')

        else:
            user = User.objects.get(email=request.POST['email_input'])
            request.session["user_id"] = user.id
            request.session["user_name"] = user.first_name
            return redirect('/')
    return redirect('/') 

def guest(request):
    request.session.clear()
    return redirect('/')