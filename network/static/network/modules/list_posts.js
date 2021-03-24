import { list_likers } from "./list_likers.js";
import { list_comments } from "./list_comments.js";
import { edit_post } from "./edit_post.js";
import { remove_post } from "./remove_post.js";
import { add_comment } from "./add_comment.js";
import { like } from "./like.js";
import { username } from "../script.js";

export let postsCache = {};

export async function list_posts(key) {
  const USER = document.querySelector("#username")
    ? document.querySelector("#username").text
    : undefined;
  let refresh = false;

  if (postsCache[key] === undefined) {
    refresh = true;
    await fetch(`/network/posts/${key}`)
      .then((response) => response.json())
      .then((response) => {
        postsCache[key] = response;
      });
  }

  if (key === `${USER}-following` && postsCache[key].length === 0) {
    const div = document.createElement("div");
    div.innerHTML = `<p>No posts yet. Please follow other users to see their posts here.</p>`;
    document.querySelector("#view-3").append(div);
  } else {
    postsCache[key].forEach((post) => {
      const div = document.createElement("div");
      div.innerHTML = `<div class="post-box">
        <span class="user">${post.user}</span> 
        ${
          post.user === USER
            ? `<button type="button" data-id="${post.id}" class="close delete" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
            : ""
        } <br>
        ${
          USER === post.user
            ? `<a href="#" class="edit" data-id="${post.id}">Edit <br> </a>`
            : ""
        }
        <span class="text-post"> <span>${post.post} </span> <br> </span>
        <span class="text-secondary post-timestamp"> <small>${
          post.timestamp
        }</small> </span> <br>  
        <span class="like"> <a href="#" data-id="${post.id}" 
            ${
              post.likers.includes(USER)
                ? `data-value="unlike"> <i class="fa fa-heart"></i></a>`
                : `data-value="like"><i class="far fa-heart"></i></a>`
            }</span>
        <span> ${
          post.likes !== 0
            ? `<span class="text-secondary likers"> ${post.likes}</span>`
            : ""
        } <span class="likers-box" data-likers="${
        post.likers
      }"></span> </span><br>
        <hr class="hrline">
        <span class="list-comments"></span>
        ${
          USER !== undefined
            ? `<form class="comment"><span data-id="${post.id}" class="comment-input" contenteditable="true" placeholder="Comment"></span></form>`
            : ""
        }
        </div>`;
      list_likers(div);
      list_comments(post.id, div);
      if (refresh) {
        setTimeout(() => {
          document.querySelector("#view-3").append(div);
        }, 50);
      } else {
        document.querySelector("#view-3").append(div);
      }

      div.setAttribute("class", "post-background");
      div
        .querySelectorAll(".user")
        .forEach((user) => user.addEventListener("click", user_handler));
      div
        .querySelectorAll(".like")
        .forEach((heart) => heart.addEventListener("click", like_handler));
      div
        .querySelectorAll(".edit")
        .forEach((post) => post.addEventListener("click", edit_handler));
      div
        .querySelectorAll(".delete")
        .forEach((post) => post.addEventListener("click", remove_post_handler));
      div
        .querySelectorAll(".comment")
        .forEach((comment) =>
          comment.addEventListener("keypress", comment_handler)
        );
    });
  }
  refresh = false;
}

function user_handler(e) {
  e.preventDefault();
  const USER = document.querySelector("#username")
    ? document.querySelector("#username").text
    : undefined;
  e.currentTarget.innerHTML === USER
    ? window.location.assign(`/posts/${USER}`)
    : username(e.currentTarget.innerHTML);
}

function like_handler(e) {
  e.preventDefault();
  like(
    e.currentTarget.children[0].dataset.id,
    e.currentTarget.children[0].dataset.value,
    e.currentTarget
  );
}

function edit_handler(e) {
  e.preventDefault();
  edit_post(e.currentTarget);
  postsCache.all = undefined;
  postsCache[document.querySelector("#username").text] = undefined;
}

function remove_post_handler(e) {
  e.preventDefault();
  e.currentTarget.removeEventListener("click", remove_post_handler);
  e.currentTarget.parentElement
    .querySelector(".user")
    .removeEventListener("click", user_handler);
  e.currentTarget.parentElement
    .querySelector(".like")
    .removeEventListener("click", like_handler);
  e.currentTarget.parentElement
    .querySelector(".edit")
    .removeEventListener("click", edit_handler);
  e.currentTarget.parentElement
    .querySelector(".delete")
    .removeEventListener("click", remove_post_handler);
  e.currentTarget.parentElement
    .querySelector(".comment")
    .removeEventListener("keypress", comment_handler);
  remove_post(e.currentTarget);
  postsCache.all = undefined;
  postsCache[document.querySelector("#username").text] = undefined;
}

function comment_handler(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    if (e.currentTarget.children[0].innerHTML.length > 0) {
      add_comment(e.currentTarget);
    }
  }
}
