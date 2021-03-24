import { commentsCache, handle_comment_delete } from "./list_comments.js";

export async function add_comment(comment) {
  const comment_id = comment.children[0].dataset.id;
  const USER = document.querySelector("#username").text;

  let csrftoken = Cookies.get("csrftoken");
  await fetch(`/network/post/${comment_id}`, {
    method: "POST",
    body: JSON.stringify({
      comment: comment.children[0].innerHTML,
    }),
    headers: { "X-CSRFToken": csrftoken },
  })
    .then((response) => response.json())
    .then((new_comment) => {
      const span = document.createElement("span");
      span.innerHTML = `<div class="comment-box"> <b>${new_comment.user}</b> ${
        new_comment.user === USER
          ? `<button type="button" data-post_id="${comment.children[0].dataset.id}" data-comment_id="${new_comment.id}" class="close delete" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
          : ""
      } <span class="text-secondary"> <small>${
        new_comment.timestamp
      }</small></span> <br> 
            ${new_comment.comment}</div>`;
      comment.previousElementSibling.append(span);
      span
        .querySelector(".delete")
        .addEventListener("click", handle_comment_delete);
    });

  comment.children[0].innerHTML = "";
  commentsCache[comment_id] = undefined;
}
