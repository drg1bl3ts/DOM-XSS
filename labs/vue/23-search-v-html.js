const { createApp } = Vue;

createApp({
  data() {
    // SOURCE: the query string of the URL
    // SINK: v-html in the template above parses this string as HTML
    return { bio: new URLSearchParams(location.search).get("bio") ?? "" };
  },
}).mount("#app");
