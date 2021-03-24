
from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    re_path(r'^posts.', views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes
    path("network/new_post", views.new_post, name="new_post"),  # new post
    path("network/post/<int:id>", views.post, name="post"),  # retrieve, like, comment, edit, delete a post
    path("network/posts/<str:key>/", views.list_posts, name="list_posts"), # list posts, key="all", "username", "username-following"
    path("network/<str:username>", views.profile, name="profile"),  # profile
]
