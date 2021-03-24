import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.paginator import Paginator
from .models import User, Post, Comment, Profile


def index(request):
    return render(request, "network/index.html")

def new_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        text = data.get("post")
        post = Post(user=request.user, post=text)
        post.save()
        return JsonResponse({"message": "Posted successfully."}, status=201)
    return JsonResponse({"error": "POST request required."}, status=400)

def post(request, id):
    if request.method == "GET":
        post = Post.objects.get(pk=id)
        comments = Comment.objects.filter(post=post).order_by("timestamp").all()
        return JsonResponse([comment.serialize() for comment in comments], safe=False)
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("value") is not None:
            post = Post.objects.get(pk=id)
            if data.get("value") == "like":
                post.likes.add(request.user)
                return JsonResponse([post.likes.count(), post.serialize()["likers"]], safe=False)
            else:
                post.likes.remove(request.user)
                return JsonResponse([post.likes.count(), post.serialize()["likers"]], safe=False)
        elif data.get("edit") is not None:
            post = Post.objects.get(pk=id)
            post.post = data.get("edit")
            post.save()
            return JsonResponse({"message": "Edited successfully."}, status=201)
    elif request.method == "POST":
        data = json.loads(request.body)
        if data.get("comment") is not None:
            post = Post.objects.get(pk=id)
            comment = Comment(user=request.user, post=post, comment=data.get("comment"))
            comment.save()
            return JsonResponse(comment.serialize(), safe=False)
    elif request.method == "DELETE":
        data = json.loads(request.body)
        if data.get("post") is not None:
            Post.objects.get(pk=id).delete()
            return JsonResponse({"message": "Post deleted successfully."}, status=201)
        elif data.get("comment_id") is not None:
            Comment.objects.get(pk=data.get("comment_id")).delete()
            return JsonResponse({"message": "Comment deleted successfully."}, status=201)

def list_posts(request, key):
    try:
        if key == "all":
            posts = Post.objects.order_by("-timestamp").all()
            return JsonResponse([post.serialize() for post in posts], safe=False)
        elif key[-10:] == "-following":
            posts = Post.objects.filter(user__in=request.user.profile.get(user=request.user).following.all()).order_by("-timestamp").all()
            return JsonResponse([post.serialize() for post in posts], safe=False)
        else:
            user = User.objects.get(username=key)
            posts = Post.objects.filter(user=user).order_by("-timestamp").all()
            return JsonResponse([post.serialize() for post in posts], safe=False)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Posts not found."}, status=404)

def profile(request, username):
    if request.method == "GET":
        user = User.objects.get(username=username)
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = Profile(user=user)
            profile.save()
        return JsonResponse(profile.serialize(), safe=False)
    elif request.method == "PUT":
        user = User.objects.get(username=username)
        follower = User.objects.get(username=json.loads(request.body).get("follower"))
        user_profile = Profile.objects.get(user=user)
        follower_profile = Profile.objects.get(user=follower)
        if json.loads(request.body).get("value") == "follow":
            user_profile.follower.add(follower)
            follower_profile.following.add(user)
        else:
            user_profile.follower.remove(follower)
            follower_profile.following.remove(user)
        return JsonResponse(user_profile.serialize(), safe=False)

def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return render(request, "network/index.html")
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")

def logout_view(request):
    logout(request)
    return render(request, "network/index.html")

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return render(request, "network/index.html")
    else:
        return render(request, "network/register.html")
