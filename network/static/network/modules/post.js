export async function post() {
  let csrftoken = Cookies.get("csrftoken");
  await fetch("/network/new_post", {
    method: "POST",
    body: JSON.stringify({
      post: document.querySelector("#post-textarea").innerHTML,
    }),
    headers: { "X-CSRFToken": csrftoken },
  });
  document.querySelector("#post-textarea").innerHTML = "";
  return false;
}
