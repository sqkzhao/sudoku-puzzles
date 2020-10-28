from __future__ import unicode_literals
from django.db import models
import re
import bcrypt

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')


# Create your models here.

class UserManager(models.Manager):
    def reg_validator(self, postData):
        errors = {}
    #----------Names-------------
        if len(postData['first_name']) < 3:
            errors['first_name'] = "First name must be at least 3 characters long!"
        if len(postData['last_name']) < 3:
            errors['last_name'] = "Last name must be at least 3 characters long"
    #----------Email-------------
        if not EMAIL_REGEX.match(postData['email']):
            errors['email'] = "Please input a valid email address"
        else:
            for user in User.objects.all():
                if postData['email'] == user.email:
                    errors['email'] = "Email already exists in our system"
    #-----------Password----------
        if len(postData['password']) < 8:
            errors['password'] = "Password must be at least 8 characters long"
        elif postData['password'] != postData['pass_conf']:
            errors['pass_conf'] = "Passwords do not match"

        return errors 

    def log_validator(self, postData):
        errors = {}
        user_info = User.objects.filter(email = postData['email_input'])

        if not user_info:
            errors['email_input'] = "Email does not exist."
        else:
            user = User.objects.get(email=postData['email_input'])
            if not bcrypt.checkpw(postData['password_input'].encode(),
            user.password.encode()):
                errors['password_input'] = "Password or Email information is not correct"

        return errors

    def not_logged_validator(self):
        errors = {}
        errors['no'] = "Please login before entering"
        return errors

class User(models.Model):
    first_name=models.CharField(max_length=255)     
    last_name=models.CharField(max_length=255)
    email=models.CharField(max_length=255)
    password=models.CharField(max_length=255)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    objects = UserManager()
