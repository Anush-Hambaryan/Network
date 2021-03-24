export function list_likers(div) {
  if (div.querySelector(".likers-box").dataset.likers.length !== 0) {
    const likers = div.querySelector(".likers-box").dataset.likers.split(",");
    for (const liker in likers) {
      const li = document.createElement("li");
      li.innerHTML = likers[liker];
      div.querySelector(".likers-box").appendChild(li);
    }
  }
}
