export function edit_post(post) {
  const original_post = post.nextElementSibling;
  const edit = document.createElement("span");
  edit.innerHTML = `<span id="post-textarea" contenteditable="true">${post.nextElementSibling.children[0].innerHTML}</span>`;
  edit.addEventListener("keypress", async (event) => {
    if (event.keyCode == 13) {
      if (edit.children[0].innerHTML.length > 0) {
        let csrftoken = Cookies.get("csrftoken");
        await fetch(`/network/post/${post.dataset.id}`, {
          method: "PUT",
          body: JSON.stringify({
            edit: edit.children[0].innerHTML.replace(/<\/?[^>]+(>|$)/g, ""),
          }),
          headers: { "X-CSRFToken": csrftoken },
        });
        original_post.children[0].innerHTML = edit.children[0].innerHTML.replace(
          /<\/?[^>]+(>|$)/g,
          ""
        );
        edit.replaceWith(original_post);
      }
    }
  });
  post.nextElementSibling.replaceWith(edit);
}
