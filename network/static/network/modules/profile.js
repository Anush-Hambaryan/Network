import { postsCache } from "./list_posts.js";

let profileCache = {};

export async function profile(user) {
  const USER = document.querySelector("#username").text;
  const path = window.location.href;
  const match = path.match("/posts/all");
  const btnText = match ? "Back to All Posts" : "Back to Following";
  user === USER
    ? (document.querySelector("#view-2").innerHTML = "")
    : (document.querySelector(
        "#view-2"
      ).innerHTML = `<button id="back" class="btn  btn-outline-secondary">${btnText}</button>`);

  match
    ? (document.querySelector("#all-posts").style.background = "#B0C4DE")
    : (document.querySelector("#following").style.background = "#B0C4DE");

  if (!profileCache[user] || user !== USER) {
    await fetch(`/network/${user}`)
      .then((response) => response.json())
      .then((data) => {
        profileCache = { [user]: data };
      });
  }

  const data = profileCache[user];

  const div = document.createElement("div");
  div.innerHTML = `<div id="profile">
                    <span>${
                      user !== USER
                        ? `${data.username} has ${
                            data.follower_count !== 1
                              ? `${data.follower_count} followers`
                              : "1 follower"
                          } and follows ${
                            data.following_count !== 1
                              ? `${data.following_count} users`
                              : "1 user"
                          }.`
                        : `Hi, ${data.username}! <br> You have ${
                            data.follower_count !== 1
                              ? `${data.follower_count} followers`
                              : "1 follower"
                          } and follow ${
                            data.following_count !== 1
                              ? `${data.following_count} users`
                              : "1 user"
                          }.`
                    }</span>
                ${
                  user !== USER
                    ? `<button class="follow btn btn-secondary" data-value="${
                        data.followers.includes(USER) ? "unfollow" : "follow"
                      }"> ${
                        data.followers.includes(USER) ? "Unfollow" : "Follow"
                      } </button>`
                    : ""
                }</div>`;
  document.querySelector("#view-2").append(div);
  document.querySelectorAll(".follow").forEach((button) =>
    button.addEventListener("click", async () => {
      let csrftoken = Cookies.get("csrftoken");
      await fetch(`/network/${user}`, {
        method: "PUT",
        body: JSON.stringify({
          value: button.dataset.value,
          follower: USER,
        }),
        headers: { "X-CSRFToken": csrftoken },
      })
        .then((response) => response.json())
        .then((data) => {
          div.children[0].children[0].innerHTML = `${
            user !== USER
              ? `${data.username} has ${
                  data.follower_count !== 1
                    ? `${data.follower_count} followers`
                    : "1 follower"
                } and follows ${
                  data.following_count !== 1
                    ? `${data.following_count} users`
                    : "1 user"
                }.`
              : `Hi, ${data.username}! <br> You have ${
                  data.follower_count !== 1
                    ? `${data.follower_count} followers`
                    : "1 follower"
                } and follow ${
                  data.following_count !== 1
                    ? `${data.following_count} users`
                    : "1 user"
                }.`
          }`;
          div.children[0].children[1].innerHTML = `${
            data.followers.includes(USER) ? "Unfollow" : "Follow"
          }`;
          div.children[0].children[1].dataset.value = `${
            data.followers.includes(USER) ? "unfollow" : "follow"
          }`;
          postsCache[`${USER}-following`] = undefined;
        });
    })
  );

  document.querySelector("#back")
    ? (document.querySelector("#back").onclick = () => {
        match
          ? window.location.replace(`/posts/all`)
          : window.location.replace(`/posts/${USER}-following`);
      })
    : null;
}
