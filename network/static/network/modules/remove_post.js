export async function remove_post(post) {
  let csrftoken = Cookies.get("csrftoken");
  await fetch(`/network/post/${post.dataset.id}`, {
    method: "DELETE",
    body: JSON.stringify({
      post: true,
    }),
    headers: { "X-CSRFToken": csrftoken },
  });
  post.parentElement.parentElement.remove();
}
