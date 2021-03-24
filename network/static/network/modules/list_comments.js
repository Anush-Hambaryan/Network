export let commentsCache = {};

export async function list_comments(id, div) {
  const USER = document.querySelector("#username")
    ? document.querySelector("#username").text
    : undefined;

  if (commentsCache[id] === undefined) {
    await fetch(`/network/post/${id}`)
      .then((response) => response.json())
      .then((response) => {
        commentsCache[id] = response;
      });
  }

  const comments = commentsCache[id];

  comments.forEach((comment) => {
    const span = document.createElement("span");
    span.innerHTML = `<div class="comment-box"> <b>${comment.user}</b> ${
      comment.user === USER
        ? `<button type="button" data-post_id="${id}" data-comment_id="${comment.id}" class="close delete" aria-label="Close"><span aria-hidden="true">&times;</span></button>`
        : ""
    } <span class="text-secondary"> <small>${
      comment.timestamp
    }</small></span> <br> 
            ${comment.comment}</div>`;
    div.children[0].querySelector(".list-comments").append(span);
  });

  div.children[0]
    .querySelector(".list-comments")
    .querySelectorAll(".delete")
    .forEach((comment) =>
      comment.addEventListener("click", handle_comment_delete)
    );
}

export async function handle_comment_delete(e) {
  e.preventDefault();
  e.currentTarget.removeEventListener("click", handle_comment_delete);

  const id = e.currentTarget.dataset.post_id;
  const target = e.currentTarget;

  let csrftoken = Cookies.get("csrftoken");
  await fetch(`/network/post/${id}`, {
    method: "DELETE",
    body: JSON.stringify({
      comment_id: e.currentTarget.dataset.comment_id,
    }),
    headers: { "X-CSRFToken": csrftoken },
  });
  commentsCache[id] = undefined;
  target.parentElement.remove();
  return false;
}
