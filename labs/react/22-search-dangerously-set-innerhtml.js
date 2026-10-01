// SOURCE: the query string of the URL
const bio = new URLSearchParams(location.search).get("bio") ?? "";

// SINK: dangerouslySetInnerHTML sets real innerHTML with this string
const app = React.createElement("div", { dangerouslySetInnerHTML: { __html: bio } });

ReactDOM.createRoot(document.getElementById("root")).render(app);
