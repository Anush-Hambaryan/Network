import { list_likers } from "./list_likers.js";

export async function like(id, value, EventTarget) {
  if (document.querySelector("#username")) {
    let csrftoken = Cookies.get("csrftoken");
    await fetch(`/network/post/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        value: value,
      }),
      headers: { "X-CSRFToken": csrftoken },
    })
      .then((response) => response.json())
      .then((result) => {
        EventTarget.innerHTML = `<a href="#" data-id="${id}" 
            ${
              value === "like"
                ? `data-value="unlike"> <i class="fa fa-heart"></i></a>`
                : `data-value="like"><i class="far fa-heart"></i></a>`
            }`;

        EventTarget.nextElementSibling.innerHTML = `${
          result[0] !== 0
            ? `<span class="text-secondary likers"> ${result[0]}</span>`
            : ""
        } <span class="likers-box" data-likers="${result[1]}"></span>`;
      });

    list_likers(EventTarget.parentElement);
  }
}
