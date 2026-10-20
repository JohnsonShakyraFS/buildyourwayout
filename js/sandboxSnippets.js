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
   - `control` : if present, the user picks the value before inserting.
                 `{value}` in `code`, `select` and `explain` is replaced
                 with their pick. Types: color, range (min/max/step/unit),
                 choice (options), text (jsString escapes it for a quoted
                 JavaScript string).
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
        control: { type: "color", label: "Pick a color", value: "#4f9490" },
        code: "{target} {\n  color: {value};\n}", select: "{value}",
        explain: "Changes the text color of {target}. Change the color code, or swap it for a color name such as tomato." },
      { label: "Background", title: "Change a background color", target: "body",
        control: { type: "color", label: "Pick a background color", value: "#eef3f1" },
        code: "{target} {\n  background: {value};\n}", select: "{value}",
        explain: "Changes the background color of {target}. Try a color name like lavender or a code like #ffe8d6." },
      { label: "Font size", title: "Make text bigger or smaller", target: "p",
        control: { type: "range", label: "How big?", min: 12, max: 64, step: 1, unit: "px", value: 18 },
        code: "{target} {\n  font-size: {value};\n}", select: "{value}",
        explain: "Sets how big the text in {target} is. Bigger number, bigger text." },
      { label: "Font", title: "Change the font", target: "body",
        control: { type: "choice", label: "Pick a font", value: "Georgia, serif",
          options: ["Georgia, serif", "Arial, sans-serif", "'Courier New', monospace", "'Trebuchet MS', sans-serif", "'Times New Roman', serif"] },
        code: "{target} {\n  font-family: {value};\n}", select: "{value}",
        explain: "Changes the font for {target}. Swap in any other font name you know." },
      { label: "Center", title: "Center the text", target: "h1",
        control: { type: "choice", label: "Line up the text", value: "center", options: ["left", "center", "right"] },
        code: "{target} {\n  text-align: {value};\n}", select: "{value}",
        explain: "Lines up the text in {target}. Try left, center or right." },
      { label: "Spacing", title: "Add space inside an element", target: "button",
        control: { type: "range", label: "How much space?", min: 0, max: 60, step: 2, unit: "px", value: 12 },
        code: "{target} {\n  padding: {value};\n}", select: "{value}",
        explain: "Adds breathing room inside {target}. Bigger number, more space. Two numbers like 12px 20px mean top and bottom, then left and right." },
      { label: "Border", title: "A border with rounded corners", target: "button",
        control: { type: "color", label: "Pick a border color", value: "#4f9490" },
        code: "{target} {\n  border: 2px solid {value};\n  border-radius: 12px;\n}", select: "{value}",
        explain: "Draws a border around {target} and rounds the corners. A bigger border-radius makes rounder corners." },
      { label: "Hover", title: "What happens when the mouse is over it", target: "button",
        control: { type: "range", label: "How faint on hover?", min: 0.2, max: 1, step: 0.1, unit: "", value: 0.8 },
        code: "{target}:hover {\n  opacity: {value};\n}", select: "{value}",
        explain: "Changes how {target} looks when the mouse is over it. 1 is normal, lower is fainter." }
    ],
    js: [
      { label: "On click", title: "Run code when something is clicked", target: "#myButton", noBody: true,
        code: 'document.querySelector("{target}").addEventListener("click", () => {\n  // your code here\n});', select: "// your code here",
        explain: "Waits for {target} to be clicked, then runs whatever you put inside. Try the Alert or Change text buttons, then paste the line in there." },
      { label: "Alert", title: "Pop up a message",
        control: { type: "text", label: "What should the message say?", value: "Hello!", jsString: true },
        code: 'alert("{value}");', select: "{value}",
        explain: "Pops up a message box. On its own it runs as soon as the page loads, so put it inside an On click to run it when someone clicks." },
      { label: "Change text", title: "Change what an element says", target: "h1", noBody: true,
        control: { type: "text", label: "What should it say?", value: "New text", jsString: true },
        code: 'document.querySelector("{target}").textContent = "{value}";', select: "{value}",
        explain: "Replaces the words in {target} with your new text." },
      { label: "Change color", title: "Change an element's color", target: "h1", noBody: true,
        control: { type: "color", label: "Pick a color", value: "#e07a5f" },
        code: 'document.querySelector("{target}").style.color = "{value}";', select: "{value}",
        explain: "Changes the text color of {target}. You can also swap in a color name, like teal or purple." },
      { label: "Hide", title: "Hide an element", target: "p", noBody: true,
        code: 'document.querySelector("{target}").style.display = "none";', select: "none",
        explain: "Hides {target}. Change “none” to “block” to show it again." }
    ]
  };