import { profile } from "./modules/profile.js";
import { post } from "./modules/post.js";
import { list_posts } from "./modules/list_posts.js";
import { postsCache } from "./modules/list_posts.js";

document.addEventListener(
  "DOMContentLoaded",
  () => {
    const USER = document.querySelector("#username")
      ? document.querySelector("#username")
      : undefined;
    USER &&
      USER.addEventListener("click", () => {
        username(USER.text);
        let key = USER.text;
        history.pushState({ key_username: key }, "", `/posts/${key}`);
      });

    document.querySelector("#all-posts").addEventListener("click", () => {
      !USER && window.location.replace(`/posts/all`);
      all_posts();
      let key = "all";
      history.pushState({ key_allPosts: key }, "", `/posts/${key}`);
    });
    document.querySelector("#following") &&
      document.querySelector("#following").addEventListener("click", () => {
        following(`${USER.text}-following`);
        let key = `${USER.text}-following`;
        history.pushState({ key_following: key }, "", `/posts/${key}`);
      });

    document.querySelector("#new-post") &&
      document
        .querySelector("#new-post")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const postContent = document.querySelector("#post-textarea")
            .innerHTML;
          if (
            postContent.length > 0 &&
            postContent.substring(0, 5) !== "<div>"
          ) {
            post();
          }
          setTimeout(() => all_posts(), 100);
          postsCache.all = undefined;
          postsCache[document.querySelector("#username").text] = undefined;
        });

    console.log(window.location.pathname);

    if (
      USER &&
      (window.location.pathname === `/login` ||
        window.location.pathname === "/register")
    ) {
      username(USER.text);
      USER.parentElement.style.background = "#E8E8E8";
      window.location.replace(`/posts/${USER.text}`);
      let key = USER.text;
      history.pushState({ key_username: key }, "", `/posts/${key}`);
    } else if (window.location.pathname === "/login") {
      document.querySelector("#log-in").parentElement.style.background =
        "#E8E8E8";
    } else if (window.location.pathname === "/register") {
      document.querySelector("#register").parentElement.style.background =
        "#E8E8E8";
    } else if (!USER && window.location.pathname === `/logout`) {
      window.location.replace(`/login`);
    } else if (
      window.location.pathname === "/" ||
      window.location.pathname === `/posts/all` ||
      window.location.pathname === `/posts/`
    ) {
      all_posts();
      document.querySelector("#all-posts").style.background = "#E8E8E8";
    } else if (USER && window.location.pathname === `/posts/${USER.text}`) {
      username(USER.text);
      USER.parentElement.style.background = "#E8E8E8";
    } else if (
      USER &&
      window.location.pathname === `/posts/${USER.text}-following`
    ) {
      following(`${USER.text}-following`);
      document.querySelector("#following").style.background = "#E8E8E8";
    } else {
      document.querySelector(
        ".body"
      ).innerHTML = `<div id="page-not-found">The requested page does not exist</div> <br> <button id="back" class="btn  btn-outline-secondary">Back to All Posts</button>`;
      document.querySelector("#back").onclick = () => {
        window.location.replace(`/posts/all`);
      };
    }

    document.querySelector("#log-out")
      ? (document.querySelector("#log-out").onclick = () => {
          window.location.replace(`/logout`);
        })
      : null;

    document.querySelectorAll(".nav-item").forEach((button) =>
      button.addEventListener("click", () => {
        for (let i = 0; i < button.parentElement.children.length; i++) {
          button.parentElement.children[i].style.background = "";
        }
        button.style.background = "#E8E8E8";
      })
    );
  },
  { once: true }
);

window.addEventListener("popstate", handle_popstate);

function handle_popstate(event) {
  document.querySelectorAll(".nav-item").forEach((button) => {
    for (let i = 0; i < button.parentElement.children.length; i++) {
      button.parentElement.children[i].style.background = "";
    }
  });

  const USER = document.querySelector("#username");

  if (
    USER &&
    (window.location.pathname === "/register" ||
      window.location.pathname === "/login")
  ) {
    window.location.replace(`/logout`);
  }

  if (event.state.key_username !== undefined) {
    username(document.querySelector("#username").text);
    USER.parentElement.style.background = "#E8E8E8";
  } else if (event.state.key_allPosts !== undefined) {
    all_posts();
    document.querySelector("#all-posts").style.background = "#E8E8E8";
  } else if (event.state.key_following !== undefined) {
    following(`${document.querySelector("#username").text}-following`);
    document.querySelector("#following").style.background = "#E8E8E8";
  } else if (
    window.location.pathname !== "/register" ||
    window.location.pathname !== "/login"
  ) {
    document.querySelector(
      ".body"
    ).innerHTML = `<div id="page-not-found">The requested page does not exist</div> <br> <button id="back" class="btn  btn-outline-secondary">Back to All Posts</button>`;
    document.querySelector("#back").onclick = () => {
      window.location.replace(`/posts/all`);
    };
  }
}

window.addEventListener(
  "unload",
  () => {
    window.removeEventListener("popstate", handle_popstate);
  },
  { once: true }
);

export function username(username) {
  document.querySelector("#view-1").style.display = "none";
  document.querySelector("#view-2").style.display = "block";
  document.querySelector("#view-3").innerHTML = "";

  if (document.querySelector("#username")) {
    profile(username);
  } else {
    document.querySelector(
      "#view-2"
    ).innerHTML = `<button id="back" class="btn  btn-outline-secondary">Back to All Posts</button>`;
    document.querySelector("#all-posts").style.background = "#B0C4DE";
    document.querySelector("#back").onclick = () => {
      window.location.replace(`/posts/all`);
    };
  }

  list_posts(username);
}

function all_posts() {
  document.querySelector("#view-1").style.display = "block";
  document.querySelector("#view-2").style.display = "none";
  document.querySelector("#view-3").innerHTML = "";

  list_posts("all");
}

function following(username) {
  document.querySelector("#view-1").style.display = "none";
  document.querySelector("#view-2").style.display = "none";
  document.querySelector("#view-3").innerHTML = "";

  list_posts(username);
}
