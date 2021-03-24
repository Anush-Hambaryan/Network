from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="profile")
    following = models.ManyToManyField(User, blank=True, related_name="user_following")
    follower = models.ManyToManyField(User, blank=True, related_name="user_follower")

    def serialize(self):
        return {
            "username": self.user.username,
            "following_count": self.following.count(),
            "follower_count": self.follower.count(),
            "followers": [user.username for user in self.follower.all()],
        }


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    post = models.TextField()
    likes = models.ManyToManyField(User, blank=True, related_name="likes")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.username,
            "post": self.post,
            "likes": self.likes.count(),
            "likers": [user.username for user in self.likes.all()],
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
        }


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_comments")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_comments")
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.pk,
            "user": self.user.username,
            "comment": self.comment,
            "timestamp": self.timestamp.strftime("%b %-d %Y, %-I:%M %p"),
        }
