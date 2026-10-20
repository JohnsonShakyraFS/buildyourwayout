/* ============================================================
   Sandbox snippet buttons
   Each snippet is plain, editable code. `select` is the part the
   editor highlights after inserting, so the user can just type
   over it. Keep the list short and friendly; add more any time.
   ============================================================ */

   export const SNIPPETS = {
    html: [
      { label: "H1", title: "Big heading", code: "<h1>My heading</h1>", select: "My heading" },
      { label: "H2", title: "Smaller heading", code: "<h2>My subheading</h2>", select: "My subheading" },
      { label: "Paragraph", title: "A paragraph of text", code: "<p>Write something here.</p>", select: "Write something here." },
      { label: "Button", title: "A clickable button", code: '<button id="myButton">Click me</button>', select: "Click me" },
      { label: "Image", title: "A picture (swap the web address for your own)", code: '<img src="https://picsum.photos/300/200" alt="Describe the image" />', select: "https://picsum.photos/300/200" },
      { label: "Link", title: "A link to another page", code: '<a href="https://example.com">Link text</a>', select: "Link text" },
      { label: "List", title: "A bulleted list", code: "<ul>\n  <li>First thing</li>\n  <li>Second thing</li>\n</ul>", select: "First thing" },
      { label: "Input", title: "A box people can type in", code: '<input id="myInput" type="text" placeholder="Type here" />', select: "Type here" }
    ],
    css: [
      { label: "Text color", title: "Change the color of text", code: "h1 {\n  color: #4f9490;\n}", select: "#4f9490" },
      { label: "Background", title: "Change a background color", code: "body {\n  background: #eef3f1;\n}", select: "#eef3f1" },
      { label: "Font size", title: "Make text bigger or smaller", code: "p {\n  font-size: 18px;\n}", select: "18px" },
      { label: "Font", title: "Change the font", code: "body {\n  font-family: Georgia, serif;\n}", select: "Georgia, serif" },
      { label: "Center", title: "Center the text", code: "h1 {\n  text-align: center;\n}", select: "h1" },
      { label: "Spacing", title: "Add space inside an element", code: "button {\n  padding: 12px 20px;\n}", select: "12px 20px" },
      { label: "Border", title: "A border with rounded corners", code: "button {\n  border: 2px solid #4f9490;\n  border-radius: 12px;\n}", select: "#4f9490" },
      { label: "Hover", title: "What happens when the mouse is over it", code: "button:hover {\n  opacity: 0.8;\n}", select: "0.8" }
    ],
    js: [
      { label: "On click", title: "Run code when something is clicked", code: 'document.querySelector("#myButton").addEventListener("click", () => {\n  // your code here\n});', select: "// your code here" },
      { label: "Alert", title: "Pop up a message", code: 'alert("Hello!");', select: "Hello!" },
      { label: "Change text", title: "Change what an element says", code: 'document.querySelector("h1").textContent = "New text";', select: "New text" },
      { label: "Change color", title: "Change an element's color", code: 'document.querySelector("h1").style.color = "tomato";', select: "tomato" },
      { label: "Hide", title: "Hide an element", code: 'document.querySelector("p").style.display = "none";', select: "p" }
    ]
  };