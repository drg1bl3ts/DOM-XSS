document.getElementById("save").onclick = function () {
  localStorage.setItem("nickname", document.getElementById("nickname").value);
  location.reload();
};

// SOURCE: localStorage holds whatever a user saved earlier
const nickname = localStorage.getItem("nickname");

if (nickname) {
  // SINK: innerHTML parses the string as HTML
  document.getElementById("profile").innerHTML = "Hi, " + nickname;
}
