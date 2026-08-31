/* ============================================================
   BUILD REGISTRY
   Every build is fully self-contained: its own starting
   html/css/js and its own guided steps. To add a new build:
     1. Pick a unique key (e.g. "gratitude-list")
     2. Fill in mood, title, description, steps, initialState, guidedSteps
     3. Add that key to the right mood's `builds` array in moods.js
   No other file needs to change.

   guidedSteps apply(code, state) should mutate `state`
   (state.html / state.css / state.js) directly.
   ============================================================ */

   export const builds = {

    /* ============================================================
       ANXIOUS — Breathing Timer App
       ============================================================ */
    "breathing-timer": {
      mood: "anxious",
      title: "Breathing Timer App",
      description: "Build a calming breathing circle that expands and contracts to guide your focus.",
      steps: [
        "Create the HTML layout",
        "Style a breathing circle",
        "Add CSS animation",
        "Customize breathing messages",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="breathing-app">
            <h1>Breathe With Me</h1>
            <p>A small pause for your mind.</p>
            <div class="circle"></div>
            <button id="breatheBtn">Start Breathing</button>
            <p id="message">Press the button to begin.</p>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .breathing-app { text-align: center; padding: 40px; }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          .circle { width: 150px; height: 150px; margin: 30px auto; border-radius: 50%; background: #8fb0d3; transition: transform 4s ease-in-out; }
          .circle.expand { transform: scale(1.5); }
          button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          const button = document.getElementById("breatheBtn");
          const circle = document.querySelector(".circle");
          const message = document.getElementById("message");
          button.addEventListener("click", function () {
            message.textContent = "Breathe in...";
            circle.classList.add("expand");
            setTimeout(function () {
              message.textContent = "Breathe out...";
              circle.classList.remove("expand");
            }, 4000);
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your breathing tool",
          instructions: "We added the structure for you. Customize the title and subtitle below.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Breathe With Me</h1>\n<p>A small pause for your mind.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Choose your circle color",
          instructions: "Type any color you like (examples: blue, lavender, lightpink).",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `background: softblue;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#8fb0d3";
            if (!color) color = "#8fb0d3";
            state.css = state.css.replace(/(\.circle\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Customize your button text",
          instructions: "Change what the button says when someone starts the breathing tool.",
          tip: "Tip: Change only the words inside the button.",
          starterCode: `<button id="breatheBtn">Start Breathing</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="breatheBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Choose the breathing messages",
          instructions: "Customize the messages the user sees while breathing.",
          tip: "Tip: Change the words inside the quotation marks.",
          starterCode: `const breatheInText = "Breathe in...";\nconst breatheOutText = "Breathe out...";`,
          apply(code, state) {
            const inMatch = code.match(/const breatheInText = "(.*?)";/);
            const outMatch = code.match(/const breatheOutText = "(.*?)";/);
            const breatheInText = inMatch ? inMatch[1] : "Breathe in...";
            const breatheOutText = outMatch ? outMatch[1] : "Breathe out...";
            state.js = `
              const button = document.getElementById("breatheBtn");
              const circle = document.querySelector(".circle");
              const message = document.getElementById("message");
              button.addEventListener("click", function () {
                message.textContent = "${breatheInText}";
                circle.classList.add("expand");
                setTimeout(function () {
                  message.textContent = "${breatheOutText}";
                  circle.classList.remove("expand");
                }, 4000);
              });
            `;
          }
        },
        {
          title: "Finish your build",
          instructions: "Preview your project one last time. If it feels good, continue to reflection.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your breathing tool is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       ANXIOUS — Calm Color Mixer (second build, proves multi-build works)
       ============================================================ */
    "calm-color-mixer": {
      mood: "anxious",
      title: "Calm Color Mixer",
      description: "Build a soft color-blending panel to slow your mind down and give your hands something quiet to do.",
      steps: [
        "Create the HTML layout",
        "Style the color panel",
        "Add a blend button",
        "Customize the calming message",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="color-mixer-app">
            <h1>Calm Mixer</h1>
            <p>Blend a color and just watch it settle.</p>
            <div class="swatch" id="swatch"></div>
            <button id="mixBtn">Mix a Color</button>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .color-mixer-app { text-align: center; padding: 40px; }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          .swatch { width: 150px; height: 150px; margin: 30px auto; border-radius: 24px; background: #cbd9ec; transition: background 1.2s ease; }
          button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          const palette = ["#cbd9ec", "#dcd6f7", "#d7ecdf", "#f3ddd6", "#e4e0cf"];
          const swatch = document.getElementById("swatch");
          const mixBtn = document.getElementById("mixBtn");
          mixBtn.addEventListener("click", function () {
            const next = palette[Math.floor(Math.random() * palette.length)];
            swatch.style.background = next;
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your mixer",
          instructions: "Customize the title and subtitle for your color mixer.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Calm Mixer</h1>\n<p>Blend a color and just watch it settle.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Shape your swatch",
          instructions: "Change how rounded the corners of your color box are (try a number between 0 and 75).",
          tip: "Tip: Only change the number before 'px'.",
          starterCode: `border-radius: 24px;`,
          apply(code, state) {
            const match = code.match(/border-radius:\s*(\d+)px;/);
            const radius = match ? match[1] : "24";
            state.css = state.css.replace(/(\.swatch\s*{[\s\S]*?border-radius:\s*)\d+px(;)/, `$1${radius}px$2`);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone mixes a new color.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="mixBtn">Mix a Color</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="mixBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Click your button a few times and watch the colors shift.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your color mixer is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       OVERTHINKING — Thought Sorter App
       ============================================================ */
    "thought-sorter": {
      mood: "overthinking",
      title: "Thought Sorter App",
      description: "Build a tool that helps organize racing thoughts into categories.",
      steps: [
        "Create an input box",
        "Add categories for thoughts",
        "Save thoughts to the page",
        "Customize your button",
        "Reflect on what felt lighter"
      ],
      initialState: {
        html: `
          <section class="thought-sorter-app">
            <h1>Thought Sorter</h1>
            <p>A gentle space to organize what is on your mind.</p>
            <input id="thoughtInput" type="text" placeholder="Type one thought..." />
            <select id="categorySelect">
              <option value="Worry">Worry</option>
              <option value="Task">Task</option>
              <option value="Feeling">Feeling</option>
            </select>
            <button id="addThoughtBtn">Sort Thought</button>
            <ul id="thoughtList"></ul>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .thought-sorter-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input, select { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          ul { margin-top: 20px; padding: 0; list-style: none; }
          li { margin-top: 10px; padding: 12px; background: #f8f0e4; border-radius: 12px; text-align: left; }
        `,
        js: `
          const thoughtInput = document.getElementById("thoughtInput");
          const categorySelect = document.getElementById("categorySelect");
          const addThoughtBtn = document.getElementById("addThoughtBtn");
          const thoughtList = document.getElementById("thoughtList");
          addThoughtBtn.addEventListener("click", function () {
            const thought = thoughtInput.value;
            const category = categorySelect.value;
            if (thought.trim() === "") return;
            const li = document.createElement("li");
            li.textContent = category + ": " + thought;
            thoughtList.appendChild(li);
            thoughtInput.value = "";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your thought tool",
          instructions: "Customize the title and subtitle for your thought sorter.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Thought Sorter</h1>\n<p>A gentle space to organize what is on your mind.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the input prompt",
          instructions: "Change what the input says before the user types.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="thoughtInput" type="text" placeholder="Type one thought..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="thoughtInput".*?>/s, code);
          }
        },
        {
          title: "Choose your categories",
          instructions: "Pick the categories users can sort their thoughts into.",
          tip: "Tip: Change only the words between each option tag.",
          starterCode: `<option value="Worry">Worry</option>\n<option value="Task">Task</option>\n<option value="Feeling">Feeling</option>`,
          apply(code, state) {
            state.html = state.html.replace(
              /<option value="Worry">Worry<\/option>\s*<option value="Task">Task<\/option>\s*<option value="Feeling">Feeling<\/option>/s,
              code
            );
          }
        },
        {
          title: "Customize your button",
          instructions: "Change the button text to something calming and clear.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="addThoughtBtn">Sort Thought</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="addThoughtBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Try typing a thought, choosing a category, and pressing the button.",
          tip: "Tip: You built a thought sorter inside the website.",
          starterCode: `Your thought sorter is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       UNMOTIVATED — Tiny Wins Tracker
       ============================================================ */
    "wins-tracker": {
      mood: "unmotivated",
      title: "Tiny Wins Tracker",
      description: "Build a tracker for small wins to help you rebuild momentum.",
      steps: [
        "Create a task input",
        "Add a button to save wins",
        "Display wins in a list",
        "Style your win cards",
        "Reflect on your progress"
      ],
      initialState: {
        html: `
          <section class="wins-tracker-app">
            <h1>Tiny Wins Tracker</h1>
            <p>Track one small win at a time.</p>
            <input id="winInput" type="text" placeholder="Write one tiny win..." />
            <button id="addWinBtn">Add Win</button>
            <ul id="winsList"></ul>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .wins-tracker-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          ul { margin-top: 20px; padding: 0; list-style: none; }
          li { margin-top: 10px; padding: 12px; background: #f8f0e4; border-radius: 12px; text-align: left; }
        `,
        js: `
          const winInput = document.getElementById("winInput");
          const addWinBtn = document.getElementById("addWinBtn");
          const winsList = document.getElementById("winsList");
          addWinBtn.addEventListener("click", function () {
            const win = winInput.value;
            if (win.trim() === "") return;
            const li = document.createElement("li");
            li.textContent = "✓ " + win;
            winsList.appendChild(li);
            winInput.value = "";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your wins tracker",
          instructions: "Customize the title and subtitle for your tiny wins tracker.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Tiny Wins Tracker</h1>\n<p>Track one small win at a time.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the win prompt",
          instructions: "Change what the input says before the user types.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="winInput" type="text" placeholder="Write one tiny win..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="winInput".*?>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change the button text to something encouraging.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="addWinBtn">Add Win</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="addWinBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Choose your card color",
          instructions: "Type a soft color name for each saved win, like lavender, peachpuff, or honeydew.",
          tip: "Tip: You can use simple color names.",
          starterCode: `background: #f8f0e4;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#f8f0e4";
            if (!color) color = "#f8f0e4";
            state.css = state.css.replace(/(li\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Finish your build",
          instructions: "Try adding one tiny win in the preview.",
          tip: "Tip: You built a motivation tracker inside the website.",
          starterCode: `Your tiny wins tracker is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       SAD — Gentle Affirmation Generator  (NEW: previously fell back
       to the breathing timer since no real guided build existed)
       ============================================================ */
    "affirmation-generator": {
      mood: "sad",
      title: "Gentle Affirmation Generator",
      description: "Build a soft affirmation tool that gives you encouraging messages.",
      steps: [
        "Create the HTML structure",
        "Add an affirmation display area",
        "Write your own affirmations",
        "Customize your button",
        "Reflect on what message helped most"
      ],
      initialState: {
        html: `
          <section class="affirmation-app">
            <h1>Gentle Reminders</h1>
            <p>Take a breath. Read one at a time.</p>
            <p id="affirmationText">You are allowed to take this slow.</p>
            <button id="newAffirmationBtn">New Affirmation</button>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .affirmation-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          #affirmationText { margin: 24px 0; font-size: 18px; color: #4a4740; min-height: 48px; }
          button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          const affirmations = [
            "You are allowed to take this slow.",
            "This feeling is temporary, even when it doesn't feel that way.",
            "Small steps still count as moving forward.",
            "You don't have to have it all figured out today.",
            "Being gentle with yourself is not the same as giving up."
          ];
          const text = document.getElementById("affirmationText");
          const btn = document.getElementById("newAffirmationBtn");
          btn.addEventListener("click", function () {
            const next = affirmations[Math.floor(Math.random() * affirmations.length)];
            text.textContent = next;
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your tool",
          instructions: "Customize the title and subtitle for your affirmation generator.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Gentle Reminders</h1>\n<p>Take a breath. Read one at a time.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Write your own affirmations",
          instructions: "Replace these with messages that would actually feel kind to you. Keep the quotation marks and commas.",
          tip: "Tip: Only change the words inside the quotes.",
          starterCode: `"You are allowed to take this slow.",\n"This feeling is temporary, even when it doesn't feel that way.",\n"Small steps still count as moving forward."`,
          apply(code, state) {
            const found = [...code.matchAll(/"([^"]*)"/g)].map(m => m[1]).filter(Boolean);
            const list = found.length ? found : [
              "You are allowed to take this slow.",
              "This feeling is temporary, even when it doesn't feel that way.",
              "Small steps still count as moving forward."
            ];
            const arrayLiteral = list.map(a => `"${a.replace(/"/g, "'")}"`).join(",\n            ");
            state.js = state.js.replace(
              /const affirmations = \[[\s\S]*?\];/,
              `const affirmations = [\n            ${arrayLiteral}\n          ];`
            );
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone wants a new message.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="newAffirmationBtn">New Affirmation</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="newAffirmationBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Click the button a few times and read what comes up.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your affirmation generator is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       ANGRY — Energy Release Timer  (NEW: previously fell back to
       the breathing timer since no real guided build existed)
       ============================================================ */
    "energy-release-timer": {
      mood: "angry",
      title: "Energy Release Timer",
      description: "Build a focused countdown timer to channel intense energy into a reset.",
      steps: [
        "Create the timer layout",
        "Add start and reset logic",
        "Set your countdown length",
        "Customize your message",
        "Reflect on what shifted"
      ],
      initialState: {
        html: `
          <section class="energy-timer-app">
            <h1>Reset Timer</h1>
            <p>Give it 60 seconds. Move, breathe, shake it out.</p>
            <div id="timeDisplay">01:00</div>
            <button id="startTimerBtn">Start</button>
            <button id="resetTimerBtn">Reset</button>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .energy-timer-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          #timeDisplay { font-size: 42px; margin: 20px 0; color: #b5563c; font-weight: 600; }
          button { padding: 12px 24px; margin: 0 6px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          let totalSeconds = 60;
          let remaining = totalSeconds;
          let timerInterval;
          const display = document.getElementById("timeDisplay");
          const startBtn = document.getElementById("startTimerBtn");
          const resetBtn = document.getElementById("resetTimerBtn");
          function render() {
            const m = String(Math.floor(remaining / 60)).padStart(2, "0");
            const s = String(remaining % 60).padStart(2, "0");
            display.textContent = m + ":" + s;
          }
          startBtn.addEventListener("click", function () {
            clearInterval(timerInterval);
            timerInterval = setInterval(function () {
              remaining--;
              if (remaining <= 0) {
                remaining = 0;
                clearInterval(timerInterval);
              }
              render();
            }, 1000);
          });
          resetBtn.addEventListener("click", function () {
            clearInterval(timerInterval);
            remaining = totalSeconds;
            render();
          });
          render();
        `
      },
      guidedSteps: [
        {
          title: "Name your timer",
          instructions: "Customize the title and subtitle for your reset timer.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Reset Timer</h1>\n<p>Give it 60 seconds. Move, breathe, shake it out.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Set your countdown length",
          instructions: "Choose how many seconds the timer runs for.",
          tip: "Tip: Only change the number.",
          starterCode: `let totalSeconds = 60;`,
          apply(code, state) {
            const match = code.match(/let totalSeconds = (\d+);/);
            const seconds = match ? match[1] : "60";
            state.js = state.js.replace(/let totalSeconds = \d+;/, `let totalSeconds = ${seconds};`);
          }
        },
        {
          title: "Customize your buttons",
          instructions: "Change what the start and reset buttons say.",
          tip: "Tip: Only change the words inside each button.",
          starterCode: `<button id="startTimerBtn">Start</button>\n<button id="resetTimerBtn">Reset</button>`,
          apply(code, state) {
            state.html = state.html.replace(
              /<button id="startTimerBtn">.*?<\/button>\s*<button id="resetTimerBtn">.*?<\/button>/s,
              code
            );
          }
        },
        {
          title: "Finish your build",
          instructions: "Start the timer and watch it count down.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your reset timer is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       OVERTHINKING — Worry Jar (2nd build)
       ============================================================ */
    "worry-jar": {
      mood: "overthinking",
      title: "Worry Jar",
      description: "Build a jar where you can drop a worry and watch it gently fade away.",
      steps: [
        "Create the HTML layout",
        "Style the jar",
        "Add drop-in logic",
        "Set how long worries stay",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="worry-jar-app">
            <h1>Worry Jar</h1>
            <p>Write it down. Let it go.</p>
            <input id="worryInput" type="text" placeholder="Type a worry..." />
            <button id="dropWorryBtn">Drop It In</button>
            <div class="jar" id="jar"></div>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .worry-jar-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          .jar { margin-top: 20px; min-height: 120px; padding: 16px; background: #f4eee0; border-radius: 16px; display: flex; flex-wrap: wrap; gap: 8px; align-content: flex-start; }
          .worry-chip { padding: 8px 12px; background: white; border-radius: 999px; font-size: 13px; color: #6f6a64; transition: opacity 1s ease; }
          .worry-chip.fade { opacity: 0; }
        `,
        js: `
          const worryInput = document.getElementById("worryInput");
          const dropBtn = document.getElementById("dropWorryBtn");
          const jar = document.getElementById("jar");
          const fadeDelaySeconds = 3;
          dropBtn.addEventListener("click", function () {
            const worry = worryInput.value;
            if (worry.trim() === "") return;
            const chip = document.createElement("span");
            chip.className = "worry-chip";
            chip.textContent = worry;
            jar.appendChild(chip);
            worryInput.value = "";
            setTimeout(function () {
              chip.classList.add("fade");
              setTimeout(function () { chip.remove(); }, 1000);
            }, fadeDelaySeconds * 1000);
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your jar",
          instructions: "Customize the title and subtitle for your worry jar.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Worry Jar</h1>\n<p>Write it down. Let it go.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the input prompt",
          instructions: "Change what the input says before someone types a worry.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="worryInput" type="text" placeholder="Type a worry..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="worryInput".*?>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone drops a worry in.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="dropWorryBtn">Drop It In</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="dropWorryBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Set how long worries stay",
          instructions: "Choose how many seconds a worry stays in the jar before fading.",
          tip: "Tip: Only change the number.",
          starterCode: `const fadeDelaySeconds = 3;`,
          apply(code, state) {
            const match = code.match(/const fadeDelaySeconds = (\d+);/);
            const seconds = match ? match[1] : "3";
            state.js = state.js.replace(/const fadeDelaySeconds = \d+;/, `const fadeDelaySeconds = ${seconds};`);
          }
        },
        {
          title: "Finish your build",
          instructions: "Type a worry, drop it in, and watch it fade.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your worry jar is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       UNMOTIVATED — Momentum Checklist (2nd build)
       ============================================================ */
    "momentum-checklist": {
      mood: "unmotivated",
      title: "Momentum Checklist",
      description: "Build a checklist where checking off tiny tasks fills a progress bar.",
      steps: [
        "Create the checklist layout",
        "Write your three tasks",
        "Add the progress bar logic",
        "Choose your progress bar color",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="momentum-app">
            <h1>Momentum Checklist</h1>
            <p>Check one thing off. Watch the bar move.</p>
            <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
            <ul id="checklist">
              <li><label><input type="checkbox" class="task-check" /> Get out of bed</label></li>
              <li><label><input type="checkbox" class="task-check" /> Drink some water</label></li>
              <li><label><input type="checkbox" class="task-check" /> Open one tab you've been avoiding</label></li>
            </ul>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .momentum-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          .progress-track { width: 100%; height: 14px; background: #eee2cf; border-radius: 999px; overflow: hidden; margin: 20px 0; }
          .progress-fill { height: 100%; width: 0%; background: #6fae8c; transition: width 0.4s ease; }
          ul { text-align: left; padding: 0; list-style: none; }
          li { margin-top: 10px; padding: 12px; background: #f8f0e4; border-radius: 12px; }
        `,
        js: `
          const checkboxes = document.querySelectorAll(".task-check");
          const fill = document.getElementById("progressFill");
          function updateProgress() {
            const total = checkboxes.length;
            const checked = document.querySelectorAll(".task-check:checked").length;
            const pct = total ? (checked / total) * 100 : 0;
            fill.style.width = pct + "%";
          }
          checkboxes.forEach(function (cb) { cb.addEventListener("change", updateProgress); });
          updateProgress();
        `
      },
      guidedSteps: [
        {
          title: "Name your checklist",
          instructions: "Customize the title and subtitle for your momentum checklist.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Momentum Checklist</h1>\n<p>Check one thing off. Watch the bar move.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Write your three tasks",
          instructions: "Replace these with tasks that would feel like real progress to you today.",
          tip: "Tip: Keep the checkbox tags, just change the words after them.",
          starterCode: `<li><label><input type="checkbox" class="task-check" /> Get out of bed</label></li>\n<li><label><input type="checkbox" class="task-check" /> Drink some water</label></li>\n<li><label><input type="checkbox" class="task-check" /> Open one tab you've been avoiding</label></li>`,
          apply(code, state) {
            state.html = state.html.replace(
              /<li><label><input type="checkbox" class="task-check" \/> Get out of bed<\/label><\/li>\s*<li><label><input type="checkbox" class="task-check" \/> Drink some water<\/label><\/li>\s*<li><label><input type="checkbox" class="task-check" \/> Open one tab you've been avoiding<\/label><\/li>/s,
              code
            );
          }
        },
        {
          title: "Choose your progress bar color",
          instructions: "Type a color for the bar that fills as you check things off.",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `background: #6fae8c;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#6fae8c";
            if (!color) color = "#6fae8c";
            state.css = state.css.replace(/(\.progress-fill\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Finish your build",
          instructions: "Check a task and watch the progress bar respond.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your momentum checklist is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       SAD — Gratitude Snapshot (2nd build)
       ============================================================ */
    "gratitude-snapshot": {
      mood: "sad",
      title: "Gratitude Snapshot",
      description: "Build a running list of small good things, one at a time.",
      steps: [
        "Create the HTML structure",
        "Add the list logic",
        "Customize your button",
        "Choose your card color",
        "Reflect on what stood out"
      ],
      initialState: {
        html: `
          <section class="gratitude-app">
            <h1>Gratitude Snapshot</h1>
            <p>Name a few small good things.</p>
            <input id="gratitudeInput" type="text" placeholder="One good thing..." />
            <button id="addGratitudeBtn">Add</button>
            <ul id="gratitudeList"></ul>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .gratitude-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          ul { margin-top: 20px; padding: 0; list-style: none; text-align: left; }
          li { margin-top: 10px; padding: 12px; background: #f8f0e4; border-radius: 12px; }
        `,
        js: `
          const gratitudeInput = document.getElementById("gratitudeInput");
          const addBtn = document.getElementById("addGratitudeBtn");
          const list = document.getElementById("gratitudeList");
          addBtn.addEventListener("click", function () {
            const value = gratitudeInput.value;
            if (value.trim() === "") return;
            const li = document.createElement("li");
            li.textContent = "✦ " + value;
            list.appendChild(li);
            gratitudeInput.value = "";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your snapshot",
          instructions: "Customize the title and subtitle for your gratitude snapshot.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Gratitude Snapshot</h1>\n<p>Name a few small good things.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the input prompt",
          instructions: "Change what the input says before someone types.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="gratitudeInput" type="text" placeholder="One good thing..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="gratitudeInput".*?>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone adds a good thing.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="addGratitudeBtn">Add</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="addGratitudeBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Choose your card color",
          instructions: "Type a soft color for each item in your list.",
          tip: "Tip: You can use simple color names.",
          starterCode: `background: #f8f0e4;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#f8f0e4";
            if (!color) color = "#f8f0e4";
            state.css = state.css.replace(/(li\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Finish your build",
          instructions: "Add one small good thing and watch your list grow.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your gratitude snapshot is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       ANGRY — Pressure Release Valve (2nd build)
       ============================================================ */
    "pressure-release-valve": {
      mood: "angry",
      title: "Pressure Release Valve",
      description: "Build a gauge you can tap down, one release at a time.",
      steps: [
        "Create the gauge layout",
        "Add release logic",
        "Set how much each tap releases",
        "Choose your gauge color",
        "Reflect on what shifted"
      ],
      initialState: {
        html: `
          <section class="pressure-app">
            <h1>Pressure Release</h1>
            <p>Click to let a little out.</p>
            <div class="gauge-track"><div class="gauge-fill" id="gaugeFill"></div></div>
            <button id="releaseBtn">Release</button>
            <p id="pressureLabel">Pressure: 100%</p>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .pressure-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          .gauge-track { width: 100%; height: 20px; background: #f0e2d6; border-radius: 999px; overflow: hidden; margin: 20px 0; }
          .gauge-fill { height: 100%; width: 100%; background: #c0563c; transition: width 0.35s ease; }
          button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          let pressure = 100;
          const releaseAmount = 20;
          const gaugeFill = document.getElementById("gaugeFill");
          const label = document.getElementById("pressureLabel");
          const btn = document.getElementById("releaseBtn");
          function render() {
            gaugeFill.style.width = pressure + "%";
            label.textContent = "Pressure: " + pressure + "%";
            btn.textContent = pressure <= 0 ? "Reset" : "Release";
          }
          btn.addEventListener("click", function () {
            if (pressure <= 0) {
              pressure = 100;
            } else {
              pressure = Math.max(0, pressure - releaseAmount);
            }
            render();
          });
          render();
        `
      },
      guidedSteps: [
        {
          title: "Name your valve",
          instructions: "Customize the title and subtitle for your pressure release tool.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Pressure Release</h1>\n<p>Click to let a little out.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Set how much each tap releases",
          instructions: "Choose how much pressure drops with each click (1-100).",
          tip: "Tip: Only change the number.",
          starterCode: `const releaseAmount = 20;`,
          apply(code, state) {
            const match = code.match(/const releaseAmount = (\d+);/);
            const amount = match ? match[1] : "20";
            state.js = state.js.replace(/const releaseAmount = \d+;/, `const releaseAmount = ${amount};`);
          }
        },
        {
          title: "Choose your gauge color",
          instructions: "Type a color for the pressure gauge.",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `background: #c0563c;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#c0563c";
            if (!color) color = "#c0563c";
            state.css = state.css.replace(/(\.gauge-fill\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Finish your build",
          instructions: "Click Release a few times and watch the gauge respond.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your pressure release valve is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       LONELY — Message in a Bottle
       ============================================================ */
    "message-in-a-bottle": {
      mood: "lonely",
      title: "Message in a Bottle",
      description: "Build a small space to send off a message, even with no one to send it to yet.",
      steps: [
        "Create the HTML layout",
        "Style the message box",
        "Add send logic",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="bottle-app">
            <h1>Message in a Bottle</h1>
            <p>Write something you needed to hear. Send it off.</p>
            <textarea id="bottleInput" placeholder="Write your message..."></textarea>
            <button id="sendBottleBtn">Send It Off</button>
            <div id="bottleLog"></div>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .bottle-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          textarea { width: 100%; min-height: 80px; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; font-family: inherit; resize: vertical; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #bottleLog { margin-top: 20px; text-align: left; }
          .bottle-entry { padding: 12px; margin-top: 8px; background: #eef2f6; border-radius: 12px; color: #4a4740; }
        `,
        js: `
          const input = document.getElementById("bottleInput");
          const btn = document.getElementById("sendBottleBtn");
          const log = document.getElementById("bottleLog");
          btn.addEventListener("click", function () {
            if (input.value.trim() === "") return;
            const entry = document.createElement("p");
            entry.className = "bottle-entry";
            entry.textContent = "🍾 " + input.value;
            log.prepend(entry);
            input.value = "";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your bottle",
          instructions: "Customize the title and subtitle for your message space.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Message in a Bottle</h1>\n<p>Write something you needed to hear. Send it off.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the writing prompt",
          instructions: "Change what the textarea says before someone starts typing.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<textarea id="bottleInput" placeholder="Write your message..."></textarea>`,
          apply(code, state) {
            state.html = state.html.replace(/<textarea id="bottleInput".*?><\/textarea>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone sends their message off.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="sendBottleBtn">Send It Off</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="sendBottleBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Write a message and send it off. Notice how it feels to let it go.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your bottle is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       LONELY — Constellation Builder
       ============================================================ */
    "constellation-builder": {
      mood: "lonely",
      title: "Constellation Builder",
      description: "Build a small night sky where each click adds a star and connects it to the last.",
      steps: [
        "Create the SVG sky",
        "Add click-to-add-star logic",
        "Choose your star and line colors",
        "Add a clear button",
        "Reflect on what you made"
      ],
      initialState: {
        html: `
          <section class="constellation-app">
            <h1>Constellation Builder</h1>
            <p>Click anywhere in the sky to add a star.</p>
            <svg id="skyCanvas" viewBox="0 0 400 260"></svg>
            <button id="clearSkyBtn">Clear Sky</button>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .constellation-app { width: min(440px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          svg { width: 100%; height: 220px; margin-top: 16px; background: #1c2340; border-radius: 16px; cursor: crosshair; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          const svg = document.getElementById("skyCanvas");
          const clearBtn = document.getElementById("clearSkyBtn");
          const starColor = "#f5e9c8";
          const lineColor = "#7c86b8";
          let points = [];
  
          function draw() {
            svg.innerHTML = "";
            for (let i = 1; i < points.length; i++) {
              const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
              line.setAttribute("x1", points[i - 1].x);
              line.setAttribute("y1", points[i - 1].y);
              line.setAttribute("x2", points[i].x);
              line.setAttribute("y2", points[i].y);
              line.setAttribute("stroke", lineColor);
              line.setAttribute("stroke-width", "1");
              svg.appendChild(line);
            }
            points.forEach(function (p) {
              const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
              circle.setAttribute("cx", p.x);
              circle.setAttribute("cy", p.y);
              circle.setAttribute("r", "4");
              circle.setAttribute("fill", starColor);
              svg.appendChild(circle);
            });
          }
  
          svg.addEventListener("click", function (e) {
            const rect = svg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 400;
            const y = ((e.clientY - rect.top) / rect.height) * 260;
            points.push({ x: x, y: y });
            draw();
          });
  
          clearBtn.addEventListener("click", function () {
            points = [];
            draw();
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your sky",
          instructions: "Customize the title and subtitle for your constellation builder.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Constellation Builder</h1>\n<p>Click anywhere in the sky to add a star.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Choose your star color",
          instructions: "Pick a color for each star you place.",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `const starColor = "#f5e9c8";`,
          apply(code, state) {
            const match = code.match(/const starColor = "(.*?)";/);
            const color = match ? match[1] : "#f5e9c8";
            state.js = state.js.replace(/const starColor = ".*?";/, `const starColor = "${color}";`);
          }
        },
        {
          title: "Choose your line color",
          instructions: "Pick a color for the lines that connect your stars.",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `const lineColor = "#7c86b8";`,
          apply(code, state) {
            const match = code.match(/const lineColor = "(.*?)";/);
            const color = match ? match[1] : "#7c86b8";
            state.js = state.js.replace(/const lineColor = ".*?";/, `const lineColor = "${color}";`);
          }
        },
        {
          title: "Customize your clear button",
          instructions: "Change what the button says when someone wants to start a new sky.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="clearSkyBtn">Clear Sky</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="clearSkyBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Click around to build out a small constellation of your own.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your sky is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       ANXIOUS — Grounding Check-In (3rd build)
       ============================================================ */
    "grounding-check-in": {
      mood: "anxious",
      title: "Grounding Check-In",
      description: "Build a tool that walks you through noticing a few things around you, right now.",
      steps: [
        "Create the HTML layout",
        "Add the noticing logic",
        "Set how many things to notice",
        "Customize your button",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="grounding-app">
            <h1>Grounding Check-In</h1>
            <p>Notice five things around you, one at a time.</p>
            <input id="groundInput" type="text" placeholder="Type one thing you notice..." />
            <button id="groundAddBtn">Add</button>
            <p id="groundCounter">0 of 5 noticed</p>
            <ul id="groundList"></ul>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .grounding-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #groundCounter { margin-top: 14px; font-weight: 600; color: #4f6f91; }
          ul { margin-top: 12px; padding: 0; list-style: none; text-align: left; }
          li { margin-top: 8px; padding: 10px 12px; background: #eef2f6; border-radius: 10px; }
        `,
        js: `
          const groundInput = document.getElementById("groundInput");
          const addBtn = document.getElementById("groundAddBtn");
          const counter = document.getElementById("groundCounter");
          const list = document.getElementById("groundList");
          const targetCount = 5;
          let count = 0;
          addBtn.addEventListener("click", function () {
            const value = groundInput.value;
            if (value.trim() === "") return;
            count++;
            const li = document.createElement("li");
            li.textContent = value;
            list.appendChild(li);
            groundInput.value = "";
            counter.textContent = count >= targetCount
              ? "You noticed " + targetCount + " things. Nicely grounded."
              : count + " of " + targetCount + " noticed";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your check-in",
          instructions: "Customize the title and subtitle for your grounding tool.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Grounding Check-In</h1>\n<p>Notice five things around you, one at a time.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the input prompt",
          instructions: "Change what the input says before someone types.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="groundInput" type="text" placeholder="Type one thing you notice..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="groundInput".*?>/s, code);
          }
        },
        {
          title: "Set how many things to notice",
          instructions: "Choose how many things someone should notice before finishing.",
          tip: "Tip: Only change the number.",
          starterCode: `const targetCount = 5;`,
          apply(code, state) {
            const match = code.match(/const targetCount = (\d+);/);
            const count = match ? match[1] : "5";
            state.js = state.js.replace(/const targetCount = \d+;/, `const targetCount = ${count};`);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone adds something they notice.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="groundAddBtn">Add</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="groundAddBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Try noticing a few things and watch the counter move.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your grounding check-in is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       OVERTHINKING — Decision Weigher (3rd build)
       ============================================================ */
    "decision-weigher": {
      mood: "overthinking",
      title: "Decision Weigher",
      description: "Build a two-column tool to sort what's pulling you toward or away from something.",
      steps: [
        "Create the HTML layout",
        "Style the two columns",
        "Add sorting logic",
        "Customize your column labels",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="weigher-app">
            <h1>Decision Weigher</h1>
            <p>Sort what's pulling you each way.</p>
            <input id="weighInput" type="text" placeholder="Type a thought..." />
            <div class="weigh-buttons">
              <button id="addProBtn">+ For</button>
              <button id="addConBtn">+ Against</button>
            </div>
            <div class="weigh-columns">
              <div class="weigh-column">
                <h3>For</h3>
                <ul id="proList"></ul>
              </div>
              <div class="weigh-column">
                <h3>Against</h3>
                <ul id="conList"></ul>
              </div>
            </div>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .weigher-app { width: min(460px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          .weigh-buttons { display: flex; gap: 10px; margin-top: 12px; }
          .weigh-buttons button { flex: 1; padding: 12px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          .weigh-columns { display: flex; gap: 14px; margin-top: 20px; text-align: left; }
          .weigh-column { flex: 1; background: #f8f0e4; border-radius: 12px; padding: 12px; }
          .weigh-column h3 { margin: 0 0 8px; font-size: 15px; color: #4a4740; }
          .weigh-column ul { margin: 0; padding: 0; list-style: none; }
          .weigh-column li { margin-top: 6px; padding: 8px; background: white; border-radius: 8px; font-size: 14px; }
        `,
        js: `
          const input = document.getElementById("weighInput");
          const proBtn = document.getElementById("addProBtn");
          const conBtn = document.getElementById("addConBtn");
          const proList = document.getElementById("proList");
          const conList = document.getElementById("conList");
          function addItem(list) {
            const value = input.value;
            if (value.trim() === "") return;
            const li = document.createElement("li");
            li.textContent = value;
            list.appendChild(li);
            input.value = "";
          }
          proBtn.addEventListener("click", function () { addItem(proList); });
          conBtn.addEventListener("click", function () { addItem(conList); });
        `
      },
      guidedSteps: [
        {
          title: "Name your weigher",
          instructions: "Customize the title and subtitle for your decision weigher.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Decision Weigher</h1>\n<p>Sort what's pulling you each way.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the input prompt",
          instructions: "Change what the input says before someone types a thought.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="weighInput" type="text" placeholder="Type a thought..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="weighInput".*?>/s, code);
          }
        },
        {
          title: "Customize your buttons",
          instructions: "Change what the two sorting buttons say.",
          tip: "Tip: Only change the words inside each button.",
          starterCode: `<button id="addProBtn">+ For</button>\n<button id="addConBtn">+ Against</button>`,
          apply(code, state) {
            state.html = state.html.replace(
              /<button id="addProBtn">.*?<\/button>\s*<button id="addConBtn">.*?<\/button>/s,
              code
            );
          }
        },
        {
          title: "Customize your column labels",
          instructions: "Change the two column headers to whatever framing fits your decision.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h3>For</h3>`,
          apply(code, state) {
            state.html = state.html.replace(/<h3>For<\/h3>/, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Add a few things to each column and see how it looks weighed out.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your decision weigher is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       UNMOTIVATED — Two-Minute Starter (3rd build)
       ============================================================ */
    "two-minute-starter": {
      mood: "unmotivated",
      title: "Two-Minute Starter",
      description: "Build a timer that only asks for two minutes on one small task.",
      steps: [
        "Create the timer layout",
        "Add the countdown logic",
        "Set how long the timer runs",
        "Customize your finish message",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="two-min-app">
            <h1>Two-Minute Starter</h1>
            <p>Pick one tiny task. Just start it for two minutes.</p>
            <input id="taskNameInput" type="text" value="Tidy one surface" />
            <div id="timeDisplay">02:00</div>
            <button id="startTwoMinBtn">Start</button>
            <p id="doneMessage"></p>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .two-min-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; text-align: center; }
          #timeDisplay { font-size: 42px; margin: 20px 0; color: #6fae8c; font-weight: 600; }
          button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #doneMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 20px; }
        `,
        js: `
          let totalSeconds = 120;
          let remaining = totalSeconds;
          let interval;
          const display = document.getElementById("timeDisplay");
          const startBtn = document.getElementById("startTwoMinBtn");
          const doneMessage = document.getElementById("doneMessage");
          function render() {
            const m = String(Math.floor(remaining / 60)).padStart(2, "0");
            const s = String(remaining % 60).padStart(2, "0");
            display.textContent = m + ":" + s;
          }
          startBtn.addEventListener("click", function () {
            clearInterval(interval);
            remaining = totalSeconds;
            doneMessage.textContent = "";
            render();
            interval = setInterval(function () {
              remaining--;
              if (remaining <= 0) {
                remaining = 0;
                clearInterval(interval);
                doneMessage.textContent = "You did two minutes. That counts.";
              }
              render();
            }, 1000);
          });
          render();
        `
      },
      guidedSteps: [
        {
          title: "Name your starter",
          instructions: "Customize the title and subtitle for your two-minute starter.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Two-Minute Starter</h1>\n<p>Pick one tiny task. Just start it for two minutes.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Set how long the timer runs",
          instructions: "Choose how many seconds the timer counts down (120 = two minutes).",
          tip: "Tip: Only change the number.",
          starterCode: `let totalSeconds = 120;`,
          apply(code, state) {
            const match = code.match(/let totalSeconds = (\d+);/);
            const seconds = match ? match[1] : "120";
            state.js = state.js.replace(/let totalSeconds = \d+;/, `let totalSeconds = ${seconds};`);
          }
        },
        {
          title: "Customize your finish message",
          instructions: "Change what shows up once the timer finishes.",
          tip: "Tip: Only change the words inside the quotes.",
          starterCode: `doneMessage.textContent = "You did two minutes. That counts.";`,
          apply(code, state) {
            const match = code.match(/doneMessage\.textContent = "(.*?)";/);
            const message = match ? match[1] : "You did two minutes. That counts.";
            state.js = state.js.replace(
              /doneMessage\.textContent = "You did two minutes\. That counts\.";/,
              `doneMessage.textContent = "${message}";`
            );
          }
        },
        {
          title: "Finish your build",
          instructions: "Start the timer and see how it feels to work for just two minutes.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your two-minute starter is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       SAD — Memory Lane (3rd build)
       ============================================================ */
    "memory-lane": {
      mood: "sad",
      title: "Memory Lane",
      description: "Build a running list of good memories, each one fading gently into view.",
      steps: [
        "Create the HTML structure",
        "Add the fade-in animation",
        "Add the list logic",
        "Customize your button",
        "Reflect on what you remembered"
      ],
      initialState: {
        html: `
          <section class="memory-app">
            <h1>Memory Lane</h1>
            <p>Add one good memory at a time.</p>
            <input id="memoryInput" type="text" placeholder="Describe a good memory..." />
            <button id="addMemoryBtn">Add Memory</button>
            <ul id="memoryList"></ul>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .memory-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          ul { margin-top: 20px; padding: 0; list-style: none; text-align: left; }
          li { margin-top: 10px; padding: 12px; background: #f8f0e4; border-radius: 12px; }
          .memory-item { animation: fadeInMemory 0.6s ease; }
          @keyframes fadeInMemory {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `,
        js: `
          const input = document.getElementById("memoryInput");
          const btn = document.getElementById("addMemoryBtn");
          const list = document.getElementById("memoryList");
          btn.addEventListener("click", function () {
            const value = input.value;
            if (value.trim() === "") return;
            const li = document.createElement("li");
            li.className = "memory-item";
            li.textContent = "✦ " + value;
            list.appendChild(li);
            input.value = "";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your memory lane",
          instructions: "Customize the title and subtitle for your memory list.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Memory Lane</h1>\n<p>Add one good memory at a time.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the input prompt",
          instructions: "Change what the input says before someone types a memory.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="memoryInput" type="text" placeholder="Describe a good memory..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="memoryInput".*?>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone adds a memory.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="addMemoryBtn">Add Memory</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="addMemoryBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Add a memory and watch it gently fade into your list.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your memory lane is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       ANGRY — Smash Board (3rd build)
       ============================================================ */
    "smash-board": {
      mood: "angry",
      title: "Smash Board",
      description: "Build a grid of tiles you can click through, one satisfying smash at a time.",
      steps: [
        "Create the tile grid",
        "Add smash logic",
        "Choose your smashed color",
        "Add a reset button",
        "Reflect on what shifted"
      ],
      initialState: {
        html: `
          <section class="smash-app">
            <h1>Smash Board</h1>
            <p>Click a tile to smash it.</p>
            <div class="smash-grid" id="smashGrid"></div>
            <p id="smashCounter">0 smashed</p>
            <button id="resetSmashBtn">Reset Board</button>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .smash-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          .smash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px; }
          .smash-tile { aspect-ratio: 1; background: #e7d3b8; border-radius: 10px; cursor: pointer; transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease; }
          .smash-tile.smashed { background: #c0563c; transform: scale(0.85); opacity: 0.45; cursor: default; }
          #smashCounter { margin-top: 14px; font-weight: 600; color: #4f6f91; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        `,
        js: `
          const grid = document.getElementById("smashGrid");
          const counter = document.getElementById("smashCounter");
          const resetBtn = document.getElementById("resetSmashBtn");
          const tileCount = 16;
          let smashedCount = 0;
  
          function buildGrid() {
            grid.innerHTML = "";
            smashedCount = 0;
            counter.textContent = smashedCount + " smashed";
            for (let i = 0; i < tileCount; i++) {
              const tile = document.createElement("div");
              tile.className = "smash-tile";
              tile.addEventListener("click", function () {
                if (tile.classList.contains("smashed")) return;
                tile.classList.add("smashed");
                smashedCount++;
                counter.textContent = smashedCount + " smashed";
              });
              grid.appendChild(tile);
            }
          }
  
          resetBtn.addEventListener("click", buildGrid);
          buildGrid();
        `
      },
      guidedSteps: [
        {
          title: "Name your board",
          instructions: "Customize the title and subtitle for your smash board.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Smash Board</h1>\n<p>Click a tile to smash it.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Set how many tiles",
          instructions: "Choose how many tiles are on the board.",
          tip: "Tip: Only change the number.",
          starterCode: `const tileCount = 16;`,
          apply(code, state) {
            const match = code.match(/const tileCount = (\d+);/);
            const count = match ? match[1] : "16";
            state.js = state.js.replace(/const tileCount = \d+;/, `const tileCount = ${count};`);
          }
        },
        {
          title: "Choose your smashed color",
          instructions: "Pick the color a tile turns once it's smashed.",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `background: #c0563c;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#c0563c";
            if (!color) color = "#c0563c";
            state.css = state.css.replace(/(\.smash-tile\.smashed\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Customize your reset button",
          instructions: "Change what the button says when someone wants a fresh board.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="resetSmashBtn">Reset Board</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="resetSmashBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Smash a few tiles, then reset and try again.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your smash board is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       LONELY — Companion Note Wall (3rd build)
       ============================================================ */
    "companion-note-wall": {
      mood: "lonely",
      title: "Companion Note Wall",
      description: "Build a wall of little sticky notes you pin to yourself.",
      steps: [
        "Create the HTML layout",
        "Style the sticky notes",
        "Add pinning logic",
        "Choose your note colors",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="notewall-app">
            <h1>Companion Note Wall</h1>
            <p>Pin a little note to keep yourself company.</p>
            <input id="noteInput" type="text" placeholder="Write a little note..." />
            <button id="pinNoteBtn">Pin It</button>
            <div id="noteWall" class="note-wall"></div>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .notewall-app { width: min(440px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          .note-wall { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
          .sticky-note { width: 90px; min-height: 90px; padding: 10px; border-radius: 4px; font-size: 13px; box-shadow: 0 6px 14px rgba(83, 68, 50, 0.12); word-break: break-word; }
        `,
        js: `
          const input = document.getElementById("noteInput");
          const btn = document.getElementById("pinNoteBtn");
          const wall = document.getElementById("noteWall");
          const noteColors = ["#fbeec3", "#dcd6f7", "#d7ecdf", "#f3ddd6"];
          btn.addEventListener("click", function () {
            const value = input.value;
            if (value.trim() === "") return;
            const note = document.createElement("div");
            note.className = "sticky-note";
            const color = noteColors[Math.floor(Math.random() * noteColors.length)];
            const rotation = (Math.random() * 10 - 5).toFixed(1);
            note.style.background = color;
            note.style.transform = "rotate(" + rotation + "deg)";
            note.textContent = value;
            wall.appendChild(note);
            input.value = "";
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your wall",
          instructions: "Customize the title and subtitle for your note wall.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Companion Note Wall</h1>\n<p>Pin a little note to keep yourself company.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the writing prompt",
          instructions: "Change what the input says before someone writes a note.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="noteInput" type="text" placeholder="Write a little note..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="noteInput".*?>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when someone pins a note.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="pinNoteBtn">Pin It</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="pinNoteBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Choose your note colors",
          instructions: "Replace these with any colors you'd like your notes to be. Keep the quotation marks and commas.",
          tip: "Tip: Only change the words inside the quotes.",
          starterCode: `"#fbeec3",\n"#dcd6f7",\n"#d7ecdf",\n"#f3ddd6"`,
          apply(code, state) {
            const found = [...code.matchAll(/"([^"]*)"/g)].map(m => m[1]).filter(Boolean);
            const colors = found.length ? found : ["#fbeec3", "#dcd6f7", "#d7ecdf", "#f3ddd6"];
            const arrayLiteral = colors.map(c => `"${c.replace(/"/g, "'")}"`).join(", ");
            state.js = state.js.replace(
              /const noteColors = \[[\s\S]*?\];/,
              `const noteColors = [${arrayLiteral}];`
            );
          }
        },
        {
          title: "Finish your build",
          instructions: "Pin a couple of notes and see your wall take shape.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your note wall is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    }
  
  };