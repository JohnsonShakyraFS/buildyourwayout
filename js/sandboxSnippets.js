/* ============================================================
   Sandbox snippet buttons
   Each snippet is plain, editable code.
   - `select`  : the part highlighted after inserting, so the user
                 can type straight over it.
   - `target`  : if present, the snippet needs to know WHICH element
                 it applies to. `{target}` in `code` / `explain` is
                 replaced with the user's choice (a CSS selector such
                 as h1 or #myButton). The value here is the fallback
                 used when the HTML tab has nothing to pick from.
   - `noBody`  : don't offer "the whole page" as a choice.
   - `explain` : the one-line, plain-language note shown after insert.
   ============================================================ */

   export const SNIPPETS = {
    html: [
      { label: "H1", title: "Big heading", code: "<h1>My heading</h1>", select: "My heading",
        explain: "Adds a big heading. Change the words between the tags to say what you like." },
      { label: "H2", title: "Smaller heading", code: "<h2>My subheading</h2>", select: "My subheading",
        explain: "Adds a smaller heading, good for sections under your main heading." },
      { label: "Paragraph", title: "A paragraph of text", code: "<p>Write something here.</p>", select: "Write something here.",
        explain: "Adds a paragraph. Type your own words between the tags." },
      { label: "Button", title: "A clickable button", code: '<button id="myButton">Click me</button>', select: "Click me",
        explain: "Adds a button. It won't do anything yet. Use “On click” on the JavaScript tab to give it a job." },
      { label: "Image", title: "A picture (swap the web address for your own)", code: '<img src="https://picsum.photos/300/200" alt="Describe the image" />', select: "https://picsum.photos/300/200",
        explain: "Adds a picture. Replace the web address with any image link. The alt text describes it for people who can't see it." },
      { label: "Link", title: "A link to another page", code: '<a href="https://example.com">Link text</a>', select: "Link text",
        explain: "Adds a link. “Link text” is what people see. The address after href is where it goes." },
      { label: "List", title: "A bulleted list", code: "<ul>\n  <li>First thing</li>\n  <li>Second thing</li>\n</ul>", select: "First thing",
        explain: "Adds a bulleted list. Each <li> is one bullet, so copy a line to add more." },
      { label: "Input", title: "A box people can type in", code: '<input id="myInput" type="text" placeholder="Type here" />', select: "Type here",
        explain: "Adds a box to type in. The placeholder is the faint hint text shown inside it." }
    ],
    css: [
      { label: "Text color", title: "Change the color of text", target: "h1",
        code: "{target} {\n  color: #4f9490;\n}", select: "#4f9490",
        explain: "Changes the text color of {target}. Replace the color code with any color you like, or a name such as tomato." },
      { label: "Background", title: "Change a background color", target: "body",
        code: "{target} {\n  background: #eef3f1;\n}", select: "#eef3f1",
        explain: "Changes the background color of {target}. Try a color name like lavender or a code like #ffe8d6." },
      { label: "Font size", title: "Make text bigger or smaller", target: "p",
        code: "{target} {\n  font-size: 18px;\n}", select: "18px",
        explain: "Sets how big the text in {target} is. Bigger number, bigger text." },
      { label: "Font", title: "Change the font", target: "body",
        code: "{target} {\n  font-family: Georgia, serif;\n}", select: "Georgia, serif",
        explain: "Changes the font for {target}. Try Arial, sans-serif or “Courier New”, monospace." },
      { label: "Center", title: "Center the text", target: "h1",
        code: "{target} {\n  text-align: center;\n}", select: "center",
        explain: "Centers the text in {target}. Try left or right instead." },
      { label: "Spacing", title: "Add space inside an element", target: "button",
        code: "{target} {\n  padding: 12px 20px;\n}", select: "12px 20px",
        explain: "Adds breathing room inside {target}. The first number is top and bottom, the second is left and right." },
      { label: "Border", title: "A border with rounded corners", target: "button",
        code: "{target} {\n  border: 2px solid #4f9490;\n  border-radius: 12px;\n}", select: "#4f9490",
        explain: "Draws a border around {target} and rounds the corners. A bigger border-radius makes rounder corners." },
      { label: "Hover", title: "What happens when the mouse is over it", target: "button",
        code: "{target}:hover {\n  opacity: 0.8;\n}", select: "0.8",
        explain: "Changes how {target} looks when the mouse is over it. 1 is normal, lower is fainter." }
    ],
    js: [
      { label: "On click", title: "Run code when something is clicked", target: "#myButton", noBody: true,
        code: 'document.querySelector("{target}").addEventListener("click", () => {\n  // your code here\n});', select: "// your code here",
        explain: "Waits for {target} to be clicked, then runs whatever you put inside. Try the Alert or Change text buttons, then paste the line in there." },
      { label: "Alert", title: "Pop up a message",
        code: 'alert("Hello!");', select: "Hello!",
        explain: "Pops up a message box. On its own it runs as soon as the page loads, so put it inside an On click to run it when someone clicks." },
      { label: "Change text", title: "Change what an element says", target: "h1", noBody: true,
        code: 'document.querySelector("{target}").textContent = "New text";', select: "New text",
        explain: "Replaces the words in {target} with your new text." },
      { label: "Change color", title: "Change an element's color", target: "h1", noBody: true,
        code: 'document.querySelector("{target}").style.color = "tomato";', select: "tomato",
        explain: "Changes the text color of {target}. Use any color name, like teal or purple." },
      { label: "Hide", title: "Hide an element", target: "p", noBody: true,
        code: 'document.querySelector("{target}").style.display = "none";', select: "none",
        explain: "Hides {target}. Change “none” to “block” to show it again." }
    ]
  };