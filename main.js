let editingPost = null;

// Load posts from localStorage when page is loaded
window.onload = function () {
  loadPostsFromStorage();
};

function addOrUpdatePost() {
  const postContent = document.getElementById("post-input").value;

  if (postContent.trim() !== "") {
    if (editingPost) {
      // Update the post if editing
      const postText = editingPost.querySelector(".post-content p");
      postText.innerText = postContent;

      // Update localStorage
      updatePostInStorage(editingPost.dataset.postId, postContent);

      editingPost = null; // Reset the editing post
    } else {
      // Create a new post if not editing
      const postId = Date.now(); // Unique ID for each post
      const postHTML = createPostHTML(postId, postContent);

      document
        .getElementById("posts-container")
        .insertAdjacentHTML("afterbegin", postHTML);

      // Save the post in localStorage
      savePostToStorage(postId, postContent);
    }

    document.getElementById("post-input").value = "";
    document.querySelector("button.btn-block").innerText = "Post";
  }
}

function createPostHTML(postId, postContent) {
  const date = new Date().toLocaleString();
  return `
  <div class="post-container" data-post-id="${postId}">
    <div class="d-flex align-items-center">
      <img src="https://via.placeholder.com/50" alt="User" class="profile-img">
      <div class="ml-3">
        <h6 class="mb-0">Md Mohin Uddin</h6>
        <small class="text-muted">${date}</small>
      </div>
      <button type="button" class="btn btn-link ml-auto" onclick="editPost(this)">Edit</button>
      <button type="button" class="btn btn-link text-danger ml-2" onclick="deletePost(this)">Delete</button>
    </div>

    <div class="post-content">
      <p>${postContent}</p>
    </div>

    <div class="reaction-counts">
      <span><i class="fas fa-thumbs-up"></i> 0 Likes</span>
      <span class="comment-count">0 Comments</span>
      <span class="shares-count">0 Shares</span>
    </div>

    <div class="reaction-buttons">
      <button type="button" class="btn btn-light" onclick="incrementLike(this)"><i class="fas fa-thumbs-up"></i> Like</button>
      <button type="button" class="btn btn-light" onclick="showCommentSection(this)"><i class="fas fa-comment"></i> Comment</button>
      <button type="button" class="btn btn-light" onclick="incrementShare(this)"><i class="fas fa-share"></i> Share</button>
    </div>

    <div class="comments-section">
      <input type="text" class="form-control comment-input" placeholder="Write a comment...">
      <button class="btn btn-sm btn-primary mt-2 mb-2" onclick="submitComment(this)">Comment</button>
      <div class="comments-list"></div>
    </div>
  </div>
`;
}

function incrementLike(button) {
  const likeSpan =
    button.parentElement.previousElementSibling.querySelector("span");
  const currentLikes = parseInt(likeSpan.textContent);
  likeSpan.innerHTML = `<i class="fas fa-thumbs-up"></i> ${
    currentLikes + 1
  } Likes`;
}

function incrementShare(button) {
  const shareSpan =
    button.parentElement.previousElementSibling.querySelector(".shares-count");
  const currentShares = parseInt(shareSpan.textContent);
  shareSpan.innerHTML = `<i class="fas fa-share"></i>  ${
    currentShares + 1
  } Shares`;
}

function editPost(button) {
  const postContainer = button.closest(".post-container");
  const postContent = postContainer.querySelector(".post-content p").innerText;

  document.getElementById("post-input").value = postContent;
  document.querySelector("button.btn-block").innerText = "Update Post";

  editingPost = postContainer;
}

function deletePost(button) {
  if (confirm("Are you sure you want to delete this post?")) {
    const postContainer = button.closest(".post-container");
    const postId = postContainer.dataset.postId;

    // Remove from DOM
    postContainer.remove();

    // Remove from localStorage
    deletePostFromStorage(postId);
  }
}

function submitComment(button) {
  const date = new Date().toLocaleString();
  const input = button.previousElementSibling;
  const commentText = input.value.trim();

  if (commentText !== "") {
    const commentHTML = ` <div class="ml-3">
        <h6 class="mb-0">User</h6>
        <small class="text-muted">${date}</small>
      </div><div class="comment">${commentText}</div>`;
    const commentsList = button.parentElement.querySelector(".comments-list");
    commentsList.insertAdjacentHTML("beforeend", commentHTML);
    input.value = "";

    // Update comment count
    const commentCountSpan = button
      .closest(".post-container")
      .querySelector(".comment-count");
    let currentCount = parseInt(commentCountSpan.textContent);
    commentCountSpan.innerText = `${currentCount + 1} Comments`;
  }
}

function showCommentSection(button) {
  const commentInput =
    button.parentElement.nextElementSibling.querySelector(".comment-input");
  commentInput.focus();
}

// Functions to handle localStorage
function savePostToStorage(postId, postContent) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.push({ id: postId, content: postContent });
  localStorage.setItem("posts", JSON.stringify(posts));
}

function updatePostInStorage(postId, updatedContent) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.map((post) =>
    post.id == postId ? { id: postId, content: updatedContent } : post
  );
  localStorage.setItem("posts", JSON.stringify(posts));
}

function deletePostFromStorage(postId) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.filter((post) => post.id != postId);
  localStorage.setItem("posts", JSON.stringify(posts));
}

function loadPostsFromStorage() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach((post) => {
    const postHTML = createPostHTML(post.id, post.content);
    document
      .getElementById("posts-container")
      .insertAdjacentHTML("afterbegin", postHTML);
  });
}
