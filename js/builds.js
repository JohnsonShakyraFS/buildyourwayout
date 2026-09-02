/* ============================================================
   BUILD REGISTRY
   Every build is fully self-contained: its own starting
   html/css/js and its own guided steps. To add a new build:
     1. Pick a unique key (e.g. "gratitude-list")
     2. Fill in mood, difficulty, requiredPlan, title, description,
        steps, initialState, guidedSteps
     3. Add that key to the right mood's `builds` array in moods.js
   No other file needs to change.

   difficulty: "beginner" | "intermediate" | "advanced"
   requiredPlan: "free" | "plus" | "premium" — currently every
   build is set to "free" as a placeholder until real billing
   exists. Bumping this later is a one-word change per build.

   guidedSteps apply(code, state) should mutate `state`
   (state.html / state.css / state.js) directly.
   ============================================================ */

   export const builds = {

    /* ============================================================
       ANXIOUS — Breathing Timer App
       ============================================================ */
    "breathing-timer": {
      mood: "anxious",
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
       SAD — Gentle Affirmation Generator
       ============================================================ */
    "affirmation-generator": {
      mood: "sad",
      difficulty: "beginner",
      requiredPlan: "free",
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
       ANGRY — Energy Release Timer
       ============================================================ */
    "energy-release-timer": {
      mood: "angry",
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
      difficulty: "beginner",
      requiredPlan: "free",
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
       ANXIOUS — Grounding Sequence (3rd build)
       Replaces the old "Grounding Check-In" (was too similar to
       the tracker-style builds). New mechanic: single-answer
       sequential stages instead of an accumulating list.
       ============================================================ */
    "grounding-check-in": {
      mood: "anxious",
      difficulty: "beginner",
      requiredPlan: "free",
      title: "Grounding Sequence",
      description: "Build a guided flow that walks you through five senses, one stage at a time.",
      steps: [
        "Create the HTML layout",
        "Add the stage sequence logic",
        "Customize your five prompts",
        "Customize your button",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="grounding-sequence-app">
            <h1>Grounding Sequence</h1>
            <p>Walk through five senses, one at a time.</p>
            <p id="stagePrompt">See: name one thing you can see.</p>
            <input id="stageInput" type="text" placeholder="Type your answer..." />
            <button id="stageNextBtn">Next</button>
            <p id="stageProgress">Step 1 of 5</p>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .grounding-sequence-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          #stagePrompt { margin-top: 16px; font-weight: 600; color: #4a4740; min-height: 40px; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #stageProgress { margin-top: 14px; font-weight: 500; color: #4f6f91; }
        `,
        js: `
          const stages = [
            { label: "See", prompt: "See: name one thing you can see." },
            { label: "Hear", prompt: "Hear: name one thing you can hear." },
            { label: "Touch", prompt: "Touch: name one thing you can touch." },
            { label: "Smell", prompt: "Smell: name one thing you can smell." },
            { label: "Feel", prompt: "Feel: name one word for how your body feels right now." }
          ];

          let currentStage = 0;

          const stagePrompt = document.getElementById("stagePrompt");
          const stageInput = document.getElementById("stageInput");
          const stageNextBtn = document.getElementById("stageNextBtn");
          const stageProgress = document.getElementById("stageProgress");

          function renderStage() {
            if (currentStage >= stages.length) {
              stagePrompt.textContent = "You made it through all five senses. Nicely grounded.";
              stageInput.style.display = "none";
              stageNextBtn.style.display = "none";
              stageProgress.textContent = "Complete";
              return;
            }
            stagePrompt.textContent = stages[currentStage].prompt;
            stageProgress.textContent = "Step " + (currentStage + 1) + " of " + stages.length;
            stageInput.value = "";
          }

          stageNextBtn.addEventListener("click", function () {
            if (stageInput.value.trim() === "") return;
            currentStage++;
            renderStage();
          });

          renderStage();
        `
      },
      guidedSteps: [
        {
          title: "Name your sequence",
          instructions: "Customize the title and subtitle for your grounding sequence.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Grounding Sequence</h1>\n<p>Walk through five senses, one at a time.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize your five prompts",
          instructions: "Replace these with prompts that feel right to you. Keep the quotation marks and commas.",
          tip: "Tip: Only change the words inside the quotes, and keep all five.",
          starterCode: `"See: name one thing you can see.",\n"Hear: name one thing you can hear.",\n"Touch: name one thing you can touch.",\n"Smell: name one thing you can smell.",\n"Feel: name one word for how your body feels right now."`,
          apply(code, state) {
            const found = [...code.matchAll(/"([^"]*)"/g)].map(m => m[1]).filter(Boolean);
            const defaults = [
              "See: name one thing you can see.",
              "Hear: name one thing you can hear.",
              "Touch: name one thing you can touch.",
              "Smell: name one thing you can smell.",
              "Feel: name one word for how your body feels right now."
            ];
            const prompts = found.length === 5 ? found : defaults;
            const labels = ["See", "Hear", "Touch", "Smell", "Feel"];
            const stagesLiteral = labels
              .map((label, i) => `{ label: "${label}", prompt: "${prompts[i].replace(/"/g, "'")}" }`)
              .join(",\n        ");
            state.js = state.js.replace(
              /const stages = \[[\s\S]*?\];/,
              `const stages = [\n        ${stagesLiteral}\n      ];`
            );
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when you move to the next sense.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="stageNextBtn">Next</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="stageNextBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Walk through all five senses and see the completion message.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your grounding sequence is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       OVERTHINKING — Clarity Scale (3rd build)
       Replaces the old "Decision Weigher" (too similar to the
       list-based builds). New mechanic: weighted slider scoring.
       ============================================================ */
    "decision-weigher": {
      mood: "overthinking",
      difficulty: "intermediate",
      requiredPlan: "free",
      title: "Clarity Scale",
      description: "Build a tool that turns three honest sliders into a single clarity score.",
      steps: [
        "Create the HTML layout",
        "Add the scoring logic",
        "Adjust the scoring weights",
        "Customize your button",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="clarity-app">
            <h1>Clarity Scale</h1>
            <p>Slide each one honestly. See where you land.</p>
            <label>Excitement<input type="range" id="excitementSlider" min="0" max="10" value="5" /></label>
            <label>Fear<input type="range" id="fearSlider" min="0" max="10" value="5" /></label>
            <label>Reversibility<input type="range" id="reversibilitySlider" min="0" max="10" value="5" /></label>
            <button id="calculateBtn">See My Score</button>
            <p id="clarityResult"></p>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .clarity-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          label { display: block; margin-top: 16px; text-align: left; font-size: 14px; color: #4a4740; }
          input[type="range"] { width: 100%; margin-top: 6px; }
          button { width: 100%; margin-top: 18px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #clarityResult { margin-top: 16px; font-weight: 500; color: #4f6f91; min-height: 22px; }
        `,
        js: `
          const excitementSlider = document.getElementById("excitementSlider");
          const fearSlider = document.getElementById("fearSlider");
          const reversibilitySlider = document.getElementById("reversibilitySlider");
          const calculateBtn = document.getElementById("calculateBtn");
          const result = document.getElementById("clarityResult");

          calculateBtn.addEventListener("click", function () {
            const excitement = Number(excitementSlider.value);
            const fear = Number(fearSlider.value);
            const reversibility = Number(reversibilitySlider.value);

            const score = (excitement * 1.2) - (fear * 0.8) + (reversibility * 1.0);

            let message;
            if (score >= 10) {
              message = "This leans toward a clear yes.";
            } else if (score >= 0) {
              message = "This is genuinely mixed — sit with it a little longer.";
            } else {
              message = "This leans toward a clear no, or at least 'not yet.'";
            }

            result.textContent = "Score: " + score.toFixed(1) + " — " + message;
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your scale",
          instructions: "Customize the title and subtitle for your clarity scale.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Clarity Scale</h1>\n<p>Slide each one honestly. See where you land.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize your factor labels",
          instructions: "Change the three words describing what each slider measures. Keep the input tags exactly as they are — just change the label words.",
          tip: "Tip: Don't remove any of the input tags, only the words before them.",
          starterCode: `<label>Excitement<input type="range" id="excitementSlider" min="0" max="10" value="5" /></label>\n<label>Fear<input type="range" id="fearSlider" min="0" max="10" value="5" /></label>\n<label>Reversibility<input type="range" id="reversibilitySlider" min="0" max="10" value="5" /></label>`,
          apply(code, state) {
            state.html = state.html.replace(
              /<label>.*?excitementSlider.*?<\/label>\s*<label>.*?fearSlider.*?<\/label>\s*<label>.*?reversibilitySlider.*?<\/label>/s,
              code
            );
          }
        },
        {
          title: "Adjust the scoring weights",
          instructions: "This formula weighs excitement, fear, and reversibility differently. Try changing the numbers to see how it shifts what counts most.",
          tip: "Tip: Higher weight on fear (a bigger negative number) makes the tool more cautious.",
          starterCode: `const score = (excitement * 1.2) - (fear * 0.8) + (reversibility * 1.0);`,
          apply(code, state) {
            state.js = state.js.replace(/const score = .*?;/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when you calculate your score.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="calculateBtn">See My Score</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="calculateBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Slide each factor honestly and see where you land.",
          tip: "Tip: You built real weighted scoring logic — the same idea behind a lot of decision tools.",
          starterCode: `Your clarity scale is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       UNMOTIVATED — Two-Minute Starter (3rd build)
       ============================================================ */
    "two-minute-starter": {
      mood: "unmotivated",
      difficulty: "beginner",
      requiredPlan: "free",
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
       SAD — Letter to Future You (3rd build)
       Replaces the old "Memory Lane" (too similar to the
       list-based builds). New mechanic: sealed, timed reveal.
       ============================================================ */
    "memory-lane": {
      mood: "sad",
      difficulty: "beginner",
      requiredPlan: "free",
      title: "Letter to Future You",
      description: "Write something kind to yourself, seal it, and wait a moment before you can read it back.",
      steps: [
        "Create the HTML structure",
        "Add the sealing + countdown logic",
        "Set how long the letter stays sealed",
        "Customize your button",
        "Reflect on what you wrote"
      ],
      initialState: {
        html: `
          <section class="future-letter-app">
            <h1>Letter to Future You</h1>
            <p>Write something kind. It'll be ready to read in a little while.</p>
            <textarea id="letterInput" placeholder="Dear future me..."></textarea>
            <button id="sealLetterBtn">Seal Letter</button>
            <div id="letterStatus"></div>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .future-letter-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          textarea { width: 100%; min-height: 90px; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; font-family: inherit; resize: vertical; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #letterStatus { margin-top: 16px; color: #4f6f91; font-weight: 500; min-height: 24px; }
          #letterStatus button { width: auto; padding: 10px 20px; }
        `,
        js: `
          const letterInput = document.getElementById("letterInput");
          const sealBtn = document.getElementById("sealLetterBtn");
          const status = document.getElementById("letterStatus");
          const sealDelaySeconds = 10;
          let sealedText = "";
          let countdownInterval;

          sealBtn.addEventListener("click", function () {
            if (letterInput.value.trim() === "") return;
            sealedText = letterInput.value;
            letterInput.value = "";
            letterInput.disabled = true;
            sealBtn.disabled = true;

            let remaining = sealDelaySeconds;
            status.textContent = "Sealed. Ready in " + remaining + "s...";

            clearInterval(countdownInterval);
            countdownInterval = setInterval(function () {
              remaining--;
              if (remaining <= 0) {
                clearInterval(countdownInterval);
                status.innerHTML = "";
                const revealBtn = document.createElement("button");
                revealBtn.textContent = "Read Your Letter";
                revealBtn.addEventListener("click", function () {
                  status.textContent = sealedText;
                });
                status.appendChild(revealBtn);
              } else {
                status.textContent = "Sealed. Ready in " + remaining + "s...";
              }
            }, 1000);
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your letter tool",
          instructions: "Customize the title and subtitle for your future letter.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Letter to Future You</h1>\n<p>Write something kind. It'll be ready to read in a little while.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Set how long the letter stays sealed",
          instructions: "Choose how many seconds pass before you can read your letter back.",
          tip: "Tip: Only change the number.",
          starterCode: `const sealDelaySeconds = 10;`,
          apply(code, state) {
            const match = code.match(/const sealDelaySeconds = (\d+);/);
            const seconds = match ? match[1] : "10";
            state.js = state.js.replace(/const sealDelaySeconds = \d+;/, `const sealDelaySeconds = ${seconds};`);
          }
        },
        {
          title: "Customize your seal button",
          instructions: "Change what the button says when you seal your letter.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="sealLetterBtn">Seal Letter</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="sealLetterBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Write a short letter, seal it, and wait for it to be ready.",
          tip: "Tip: You built this inside the website — no outside editor needed.",
          starterCode: `Your letter tool is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },
  
    /* ============================================================
       ANGRY — Smash Board (3rd build)
       ============================================================ */
    "smash-board": {
      mood: "angry",
      difficulty: "beginner",
      requiredPlan: "free",
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
       LONELY — Comfort Board (3rd build)
       Replaces the old "Companion Note Wall" (too similar to the
       list-based builds). New mechanic: draggable, freely
       positioned notes on a board.
       ============================================================ */
    "companion-note-wall": {
      mood: "lonely",
      difficulty: "intermediate",
      requiredPlan: "free",
      title: "Comfort Board",
      description: "Build a board of comforting notes you can drag around and arrange however feels right.",
      steps: [
        "Create the HTML layout",
        "Style the board and notes",
        "Add notes to the board",
        "Add drag logic",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="comfort-board-app">
            <h1>Comfort Board</h1>
            <p>Add a comforting note, then drag it wherever feels right.</p>
            <input id="noteInput" type="text" placeholder="Write something kind..." />
            <button id="addNoteBtn">Add to Board</button>
            <div id="board" class="board"></div>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .comfort-board-app { width: min(460px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
          button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          .board { position: relative; margin-top: 20px; height: 220px; background: #f4eee0; border-radius: 16px; overflow: hidden; }
          .comfort-note { position: absolute; width: 110px; padding: 10px; background: #fbeec3; border-radius: 8px; font-size: 13px; box-shadow: 0 6px 14px rgba(83, 68, 50, 0.12); cursor: grab; user-select: none; }
        `,
        js: `
          const noteInput = document.getElementById("noteInput");
          const addBtn = document.getElementById("addNoteBtn");
          const board = document.getElementById("board");
          let activeNote = null;
          let offsetX = 0;
          let offsetY = 0;

          addBtn.addEventListener("click", function () {
            const value = noteInput.value;
            if (value.trim() === "") return;

            const note = document.createElement("div");
            note.className = "comfort-note";
            note.textContent = value;
            note.style.left = (20 + Math.random() * 200) + "px";
            note.style.top = (20 + Math.random() * 120) + "px";

            note.addEventListener("mousedown", function (e) {
              activeNote = note;
              offsetX = e.clientX - note.offsetLeft;
              offsetY = e.clientY - note.offsetTop;
            });

            board.appendChild(note);
            noteInput.value = "";
          });

          board.addEventListener("mousemove", function (e) {
            if (!activeNote) return;
            const boardRect = board.getBoundingClientRect();
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            newLeft = Math.max(0, Math.min(newLeft, boardRect.width - activeNote.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, boardRect.height - activeNote.offsetHeight));
            activeNote.style.left = newLeft + "px";
            activeNote.style.top = newTop + "px";
          });

          document.addEventListener("mouseup", function () {
            activeNote = null;
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your board",
          instructions: "Customize the title and subtitle for your comfort board.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Comfort Board</h1>\n<p>Add a comforting note, then drag it wherever feels right.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Customize the writing prompt",
          instructions: "Change what the input says before you type a note.",
          tip: "Tip: Change only the words inside placeholder.",
          starterCode: `<input id="noteInput" type="text" placeholder="Write something kind..." />`,
          apply(code, state) {
            state.html = state.html.replace(/<input id="noteInput".*?>/s, code);
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the button says when you add a note to the board.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="addNoteBtn">Add to Board</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="addNoteBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Choose your note color",
          instructions: "Pick a color for the notes on your board.",
          tip: "Tip: You can use simple color names or codes.",
          starterCode: `background: #fbeec3;`,
          apply(code, state) {
            const colorMatch = code.match(/background:\s*(.*);/);
            let color = colorMatch ? colorMatch[1].trim() : "#fbeec3";
            if (!color) color = "#fbeec3";
            state.css = state.css.replace(/(\.comfort-note\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
          }
        },
        {
          title: "Finish your build",
          instructions: "Add a couple of notes and drag them around the board.",
          tip: "Tip: You built real drag-and-drop inside the website.",
          starterCode: `Your comfort board is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },

    /* ============================================================
       UNMOTIVATED — Habit Streak Tracker (4th build, Intermediate)
       ============================================================ */
    "habit-streak-tracker": {
      mood: "unmotivated",
      difficulty: "intermediate",
      requiredPlan: "free",
      title: "Habit Streak Tracker",
      description: "Build a tracker that counts consecutive days for a habit and resets if you miss a day.",
      steps: [
        "Create the HTML layout",
        "Add the streak counting logic",
        "Add the miss-a-day reset logic",
        "Customize your habit name",
        "Reflect after building"
      ],
      initialState: {
        html: `
          <section class="streak-app">
            <h1>Habit Streak</h1>
            <p>Track one habit, one day at a time.</p>
            <p id="habitName">Morning walk</p>
            <div id="streakCount">0</div>
            <p class="streak-label">day streak</p>
            <button id="checkInBtn">Check In Today</button>
            <p id="streakMessage"></p>
          </section>
        `,
        css: `
          body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
          .streak-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
          h1 { color: #2b2b2b; }
          p { color: #6f6a64; }
          #habitName { font-weight: 600; color: #4a4740; }
          #streakCount { font-size: 52px; margin: 12px 0; color: #6fae8c; font-weight: 700; }
          .streak-label { margin-top: -12px; }
          button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
          #streakMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 20px; }
        `,
        js: `
          let streak = 0;
          let lastCheckInDay = null;
          const streakCount = document.getElementById("streakCount");
          const checkInBtn = document.getElementById("checkInBtn");
          const streakMessage = document.getElementById("streakMessage");

          function todayKey() {
            return new Date().toDateString();
          }

          function dayDiff(a, b) {
            const oneDay = 24 * 60 * 60 * 1000;
            return Math.round((new Date(a) - new Date(b)) / oneDay);
          }

          checkInBtn.addEventListener("click", function () {
            const today = todayKey();

            if (lastCheckInDay === today) {
              streakMessage.textContent = "Already checked in today.";
              return;
            }

            if (lastCheckInDay === null) {
              streak = 1;
            } else {
              const diff = dayDiff(today, lastCheckInDay);
              if (diff === 1) {
                streak++;
              } else {
                streak = 1;
                streakMessage.textContent = "Streak reset — starting fresh today.";
              }
            }

            lastCheckInDay = today;
            streakCount.textContent = streak;

            if (streak > 1) {
              streakMessage.textContent = streak + " days in a row.";
            }
          });
        `
      },
      guidedSteps: [
        {
          title: "Name your tracker",
          instructions: "Customize the title and subtitle for your streak tracker.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<h1>Habit Streak</h1>\n<p>Track one habit, one day at a time.</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
          }
        },
        {
          title: "Name your habit",
          instructions: "Change the habit you're tracking.",
          tip: "Tip: Only change the words between the tags.",
          starterCode: `<p id="habitName">Morning walk</p>`,
          apply(code, state) {
            state.html = state.html.replace(/<p id="habitName">.*?<\/p>/s, code);
          }
        },
        {
          title: "Understand the streak logic",
          instructions: "This build compares today's date to your last check-in date. If it's exactly one day later, your streak grows. If you skip a day, it resets to 1. Try changing what happens on reset — for example, keep half the streak instead of resetting to zero.",
          tip: "Tip: Look for the 'else' block inside the click handler — that's where a missed day is handled.",
          starterCode: `if (diff === 1) {\n  streak++;\n} else {\n  streak = 1;\n  streakMessage.textContent = "Streak reset — starting fresh today.";\n}`,
          apply(code, state) {
            state.js = state.js.replace(
              /if \(diff === 1\) \{\s*streak\+\+;\s*\} else \{\s*streak = 1;\s*streakMessage\.textContent = "Streak reset — starting fresh today\.";\s*\}/,
              code
            );
          }
        },
        {
          title: "Customize your button",
          instructions: "Change what the check-in button says.",
          tip: "Tip: Only change the words inside the button.",
          starterCode: `<button id="checkInBtn">Check In Today</button>`,
          apply(code, state) {
            state.html = state.html.replace(/<button id="checkInBtn">.*?<\/button>/s, code);
          }
        },
        {
          title: "Finish your build",
          instructions: "Click Check In. In a real day-to-day use, this would only let you check in once every 24 hours.",
          tip: "Tip: You built real streak logic — the same idea apps like Duolingo use.",
          starterCode: `Your habit streak tracker is ready.\n\nClick "Go to Reflection" when you're done.`,
          apply() {}
        }
      ]
    },

  "worry-postponement-box": {
    mood: "anxious",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Worry Postponement Box",
    description: "Set a worry aside on purpose, and come back to it once some time has passed.",
    steps: [
      "Create the HTML layout",
      "Add the postponement logic",
      "Set how long each worry stays postponed",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="postpone-app">
          <h1>Worry Postponement Box</h1>
          <p>Set a worry aside. Revisit it later, on purpose.</p>
          <input id="worryText" type="text" placeholder="Type a worry..." />
          <button id="postponeBtn">Postpone It</button>
          <ul id="postponeList"></ul>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .postpone-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        ul { margin-top: 20px; padding: 0; list-style: none; text-align: left; }
        li { margin-top: 8px; padding: 10px 12px; background: #eef2f6; border-radius: 10px; font-size: 14px; color: #4a4740; }
      `,
      js: `
        const worryText = document.getElementById("worryText");
        const postponeBtn = document.getElementById("postponeBtn");
        const postponeList = document.getElementById("postponeList");
        const revisitDelaySeconds = 15;
        const items = [];

        function render() {
          postponeList.innerHTML = "";
          items.forEach(function (item) {
            const li = document.createElement("li");
            const remaining = Math.max(0, Math.ceil((item.readyAt - Date.now()) / 1000));
            if (remaining <= 0) {
              li.textContent = "✓ Ready to revisit: " + item.text;
            } else {
              li.textContent = item.text + " (ready in " + remaining + "s)";
            }
            postponeList.appendChild(li);
          });
        }

        postponeBtn.addEventListener("click", function () {
          const value = worryText.value;
          if (value.trim() === "") return;
          items.push({ text: value, readyAt: Date.now() + revisitDelaySeconds * 1000 });
          worryText.value = "";
          render();
        });

        setInterval(render, 1000);
        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your postponement box",
        instructions: "Customize the title and subtitle for your worry box.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Worry Postponement Box</h1>\n<p>Set a worry aside. Revisit it later, on purpose.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how long each worry stays postponed",
        instructions: "Choose how many seconds pass before a worry is ready to revisit.",
        tip: "Tip: Only change the number.",
        starterCode: `const revisitDelaySeconds = 15;`,
        apply(code, state) {
          const match = code.match(/const revisitDelaySeconds = (\d+);/);
          const seconds = match ? match[1] : "15";
          state.js = state.js.replace(/const revisitDelaySeconds = \d+;/, `const revisitDelaySeconds = ${seconds};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you set a worry aside.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="postponeBtn">Postpone It</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="postponeBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Postpone a worry and watch it count down to ready.",
        tip: "Tip: You built real scheduled timers — each worry runs on its own clock.",
        starterCode: `Your postponement box is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Anchor Shape (Beginner)
     Mechanic: CSS shape-morph via clip-path on a button click
     ============================================================ */
  "anchor-shape-morph": {
    mood: "anxious",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Anchor Shape",
    description: "Build a shape you can shift into as a visual anchor when things feel scattered.",
    steps: [
      "Create the HTML layout",
      "Style your anchor shape",
      "Add the morph logic",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="anchor-app">
          <h1>Anchor Shape</h1>
          <p>Click to shift into your anchor shape.</p>
          <div class="anchor-shape" id="anchorShape"></div>
          <button id="morphBtn">Become My Anchor</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .anchor-app { text-align: center; padding: 40px; }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .anchor-shape { width: 140px; height: 140px; margin: 30px auto; background: #8fb0d3; clip-path: circle(50%); transition: clip-path 1s ease, background 1s ease; }
        .anchor-shape.morphed { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); background: #c8a96a; }
        button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const shape = document.getElementById("anchorShape");
        const btn = document.getElementById("morphBtn");
        btn.addEventListener("click", function () {
          shape.classList.toggle("morphed");
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your anchor tool",
        instructions: "Customize the title and subtitle for your anchor shape.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Anchor Shape</h1>\n<p>Click to shift into your anchor shape.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Choose your starting color",
        instructions: "Pick a color for your shape before it morphs.",
        tip: "Tip: You can use simple color names or codes.",
        starterCode: `background: #8fb0d3;`,
        apply(code, state) {
          const colorMatch = code.match(/background:\s*(.*);/);
          let color = colorMatch ? colorMatch[1].trim() : "#8fb0d3";
          if (!color) color = "#8fb0d3";
          state.css = state.css.replace(/(\.anchor-shape\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you morph your shape.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="morphBtn">Become My Anchor</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="morphBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click the button a couple of times and watch your shape shift.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your anchor shape is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Steady Hands (Advanced)
     Mechanic: pointer-tracking accuracy scoring against a target line
     ============================================================ */
  "steady-hands-trace": {
    mood: "anxious",
    difficulty: "advanced",
    requiredPlan: "free",
    title: "Steady Hands",
    description: "Build a tracing tool that measures how steady your hand is against a straight line.",
    steps: [
      "Create the SVG tracing area",
      "Add mouse tracking logic",
      "Score your steadiness",
      "Adjust your steadiness thresholds",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="steady-app">
          <h1>Steady Hands</h1>
          <p>Click and drag across the line, as steadily as you can.</p>
          <svg id="traceArea" viewBox="0 0 400 160">
            <line x1="20" y1="80" x2="380" y2="80" stroke="#d6cec2" stroke-width="2" />
          </svg>
          <p id="traceResult">Click and drag across the line.</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .steady-app { width: min(440px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        svg { width: 100%; height: 160px; margin-top: 16px; background: #f8f0e4; border-radius: 12px; cursor: crosshair; }
        #traceResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const svg = document.getElementById("traceArea");
        const result = document.getElementById("traceResult");
        let tracing = false;
        let deviations = [];
        const targetY = 80;

        svg.addEventListener("mousedown", function () {
          tracing = true;
          deviations = [];
        });

        svg.addEventListener("mousemove", function (e) {
          if (!tracing) return;
          const rect = svg.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 400;
          const y = ((e.clientY - rect.top) / rect.height) * 160;
          deviations.push(Math.abs(y - targetY));

          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", x);
          dot.setAttribute("cy", y);
          dot.setAttribute("r", "2");
          dot.setAttribute("fill", "#c8a96a");
          svg.appendChild(dot);
        });

        document.addEventListener("mouseup", function () {
          if (!tracing) return;
          tracing = false;
          if (deviations.length === 0) return;

          const avg = deviations.reduce(function (a, b) { return a + b; }, 0) / deviations.length;

          let rating;
          if (avg < 5) {
            rating = "Very steady.";
          } else if (avg < 15) {
            rating = "Pretty steady.";
          } else {
            rating = "A little shaky — that's okay.";
          }

          result.textContent = "Average deviation: " + avg.toFixed(1) + "px. " + rating;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tracing tool",
        instructions: "Customize the title and subtitle for your steady hands tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Steady Hands</h1>\n<p>Click and drag across the line, as steadily as you can.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Understand the tracking logic",
        instructions: "Every mouse move while dragging measures how far off the target line you are, and drops a dot to mark it. This is the same idea behind a lot of drawing and precision tools.",
        tip: "Tip: `deviations` collects every distance reading during your drag.",
        starterCode: `const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");\ndot.setAttribute("cx", x);\ndot.setAttribute("cy", y);\ndot.setAttribute("r", "2");\ndot.setAttribute("fill", "#c8a96a");`,
        apply(code, state) {
          state.js = state.js.replace(
            /const dot = document\.createElementNS\("http:\/\/www\.w3\.org\/2000\/svg", "circle"\);\s*dot\.setAttribute\("cx", x\);\s*dot\.setAttribute\("cy", y\);\s*dot\.setAttribute\("r", "2"\);\s*dot\.setAttribute\("fill", "#c8a96a"\);/,
            code
          );
        }
      },
      {
        title: "Adjust your steadiness thresholds",
        instructions: "These numbers decide what counts as 'very steady' versus 'shaky.' Try loosening or tightening them.",
        tip: "Tip: A bigger number after 'avg <' makes the tool more forgiving.",
        starterCode: `if (avg < 5) {\n  rating = "Very steady.";\n} else if (avg < 15) {\n  rating = "Pretty steady.";\n} else {\n  rating = "A little shaky — that's okay.";\n}`,
        apply(code, state) {
          state.js = state.js.replace(
            /if \(avg < 5\) \{\s*rating = "Very steady\.";\s*\} else if \(avg < 15\) \{\s*rating = "Pretty steady\.";\s*\} else \{\s*rating = "A little shaky — that's okay\.";\s*\}/,
            code
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Trace the line a few times and see your steadiness score.",
        tip: "Tip: You built real pointer-tracking logic — the same idea behind drawing apps.",
        starterCode: `Your steady hands tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Anxiety Thermometer (Intermediate)
     Mechanic: repeated slider readings build a session bar chart
     ============================================================ */
  "anxiety-thermometer-log": {
    mood: "anxious",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Anxiety Thermometer",
    description: "Build a tool that logs how intense things feel right now, and watch your session build a little history.",
    steps: [
      "Create the HTML layout",
      "Add the logging logic",
      "Choose your bar color",
      "Customize your button",
      "Reflect on your readings"
    ],
    initialState: {
      html: `
        <section class="thermo-app">
          <h1>Anxiety Thermometer</h1>
          <p>Log how intense things feel right now.</p>
          <input type="range" id="thermoSlider" min="0" max="10" value="5" />
          <p id="thermoValue">5</p>
          <button id="logThermoBtn">Log Reading</button>
          <div class="thermo-history" id="thermoHistory"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .thermo-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input[type="range"] { width: 100%; margin-top: 14px; }
        #thermoValue { margin-top: 8px; font-size: 24px; font-weight: 600; color: #4a4740; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        .thermo-history { display: flex; align-items: flex-end; gap: 6px; height: 100px; margin-top: 20px; }
        .thermo-bar { width: 18px; background: #c0563c; border-radius: 4px 4px 0 0; }
      `,
      js: `
        const thermoSlider = document.getElementById("thermoSlider");
        const thermoValue = document.getElementById("thermoValue");
        const logThermoBtn = document.getElementById("logThermoBtn");
        const thermoHistory = document.getElementById("thermoHistory");

        thermoSlider.addEventListener("input", function () {
          thermoValue.textContent = thermoSlider.value;
        });

        logThermoBtn.addEventListener("click", function () {
          const bar = document.createElement("div");
          bar.className = "thermo-bar";
          bar.style.height = (Number(thermoSlider.value) * 10) + "%";
          thermoHistory.appendChild(bar);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your thermometer",
        instructions: "Customize the title and subtitle for your anxiety thermometer.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Anxiety Thermometer</h1>\n<p>Log how intense things feel right now.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Choose your bar color",
        instructions: "Pick a color for each logged reading.",
        tip: "Tip: You can use simple color names or codes.",
        starterCode: `background: #c0563c;`,
        apply(code, state) {
          const colorMatch = code.match(/background:\s*(.*);/);
          let color = colorMatch ? colorMatch[1].trim() : "#c0563c";
          if (!color) color = "#c0563c";
          state.css = state.css.replace(/(\.thermo-bar\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you log a reading.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="logThermoBtn">Log Reading</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="logThermoBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Log a few readings and watch your session history build up.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your thermometer is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Safe Place Builder (Beginner)
     Mechanic: checkboxes drive a single live-composed scene
     ============================================================ */
  "safe-place-builder": {
    mood: "anxious",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Safe Place Builder",
    description: "Build a small calming scene you can add water and trees to, just by checking boxes.",
    steps: [
      "Create the HTML layout",
      "Style the scene",
      "Add the toggle logic",
      "Choose your sky color",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="safe-place-app">
          <h1>Safe Place Builder</h1>
          <p>Toggle elements to build your calm scene.</p>
          <div class="scene" id="scene">
            <div class="sky"></div>
            <div class="water hidden-el" id="waterEl"></div>
            <div class="trees hidden-el" id="treesEl"></div>
          </div>
          <label><input type="checkbox" id="toggleWater" /> Add water</label>
          <label><input type="checkbox" id="toggleTrees" /> Add trees</label>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .safe-place-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .scene { position: relative; height: 160px; border-radius: 16px; overflow: hidden; margin-top: 16px; background: #cfe3e0; }
        .sky { position: absolute; inset: 0; background: linear-gradient(#cfe3e0, #eef2f6); }
        .water { position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: #8fb0d3; }
        .trees { position: absolute; bottom: 0; left: 20px; width: 30px; height: 60px; background: #6fae8c; border-radius: 50% 50% 0 0; }
        .hidden-el { display: none; }
        label { display: block; margin-top: 12px; text-align: left; font-size: 14px; color: #4a4740; }
      `,
      js: `
        const toggleWater = document.getElementById("toggleWater");
        const waterEl = document.getElementById("waterEl");
        const toggleTrees = document.getElementById("toggleTrees");
        const treesEl = document.getElementById("treesEl");

        toggleWater.addEventListener("change", function () {
          waterEl.classList.toggle("hidden-el", !toggleWater.checked);
        });

        toggleTrees.addEventListener("change", function () {
          treesEl.classList.toggle("hidden-el", !toggleTrees.checked);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your safe place",
        instructions: "Customize the title and subtitle for your scene builder.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Safe Place Builder</h1>\n<p>Toggle elements to build your calm scene.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Choose your sky",
        instructions: "Pick two colors for your sky gradient.",
        tip: "Tip: Keep the format 'linear-gradient(color1, color2)'.",
        starterCode: `background: linear-gradient(#cfe3e0, #eef2f6);`,
        apply(code, state) {
          const match = code.match(/background:\s*(.*);/);
          const value = match ? match[1].trim() : "linear-gradient(#cfe3e0, #eef2f6)";
          state.css = state.css.replace(/(\.sky\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${value}$3`);
        }
      },
      {
        title: "Customize your labels",
        instructions: "Change what each checkbox label says.",
        tip: "Tip: Only change the words after each checkbox tag.",
        starterCode: `<label><input type="checkbox" id="toggleWater" /> Add water</label>\n<label><input type="checkbox" id="toggleTrees" /> Add trees</label>`,
        apply(code, state) {
          state.html = state.html.replace(
            /<label><input type="checkbox" id="toggleWater" \/> Add water<\/label>\s*<label><input type="checkbox" id="toggleTrees" \/> Add trees<\/label>/s,
            code
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Check both boxes and watch your scene come together.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your safe place is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Box Breathing (Intermediate)
     Mechanic: auto-cycling 4-phase state machine, not a manual toggle
     ============================================================ */
  "box-breathing-counter": {
    mood: "anxious",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Box Breathing",
    description: "Build a guided cycle through inhale, hold, exhale, hold — four seconds each.",
    steps: [
      "Create the HTML layout",
      "Add the phase cycling logic",
      "Set how long each phase lasts",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="box-breath-app">
          <h1>Box Breathing</h1>
          <p>Follow along: inhale, hold, exhale, hold.</p>
          <div class="phase-row" id="phaseRow">
            <div class="phase-box">Inhale</div>
            <div class="phase-box">Hold</div>
            <div class="phase-box">Exhale</div>
            <div class="phase-box">Hold</div>
          </div>
          <p id="phaseTimer">4</p>
          <button id="boxStartBtn">Start</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .box-breath-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .phase-row { display: flex; gap: 10px; justify-content: center; margin-top: 20px; }
        .phase-box { flex: 1; padding: 14px 0; background: #eef2f6; border-radius: 10px; font-size: 13px; color: #6f6a64; }
        .phase-box.active { background: #8fb0d3; color: white; font-weight: 600; }
        #phaseTimer { margin-top: 14px; font-size: 32px; font-weight: 600; color: #4a4740; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const phaseBoxes = document.querySelectorAll(".phase-box");
        const phaseTimer = document.getElementById("phaseTimer");
        const startBtn = document.getElementById("boxStartBtn");
        const phaseSeconds = 4;
        let phaseIndex = 0;
        let countdown = phaseSeconds;
        let interval;

        function highlightPhase() {
          phaseBoxes.forEach(function (box, i) {
            box.classList.toggle("active", i === phaseIndex);
          });
        }

        function tick() {
          countdown--;
          if (countdown <= 0) {
            phaseIndex = (phaseIndex + 1) % phaseBoxes.length;
            countdown = phaseSeconds;
            highlightPhase();
          }
          phaseTimer.textContent = countdown;
        }

        startBtn.addEventListener("click", function () {
          clearInterval(interval);
          phaseIndex = 0;
          countdown = phaseSeconds;
          highlightPhase();
          phaseTimer.textContent = countdown;
          interval = setInterval(tick, 1000);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your breathing cycle",
        instructions: "Customize the title and subtitle for your box breathing tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Box Breathing</h1>\n<p>Follow along: inhale, hold, exhale, hold.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how long each phase lasts",
        instructions: "Choose how many seconds each phase (inhale, hold, exhale, hold) runs for.",
        tip: "Tip: Only change the number.",
        starterCode: `const phaseSeconds = 4;`,
        apply(code, state) {
          const match = code.match(/const phaseSeconds = (\d+);/);
          const seconds = match ? match[1] : "4";
          state.js = state.js.replace(/const phaseSeconds = \d+;/, `const phaseSeconds = ${seconds};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you start the cycle.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="boxStartBtn">Start</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="boxStartBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Start the cycle and follow along for a full loop.",
        tip: "Tip: You built a real repeating state machine — the same idea behind a lot of guided apps.",
        starterCode: `Your box breathing tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — What If, Reframed (Beginner)
     Mechanic: click-to-flip card reveal
     ============================================================ */
  "whatif-flip-cards": {
    mood: "anxious",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "What If, Reframed",
    description: "Build a set of cards that reveal a gentler perspective when you click them.",
    steps: [
      "Create the HTML layout",
      "Write your own worry/reframe pairs",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="flip-app">
          <h1>What If, Reframed</h1>
          <p>Click a card to see a gentler perspective.</p>
          <div class="flip-grid" id="flipGrid"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .flip-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .flip-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
        .flip-card { padding: 14px; background: #f8f0e4; border-radius: 12px; cursor: pointer; text-align: left; font-size: 14px; color: #4a4740; }
      `,
      js: `
        const pairs = [
          { worry: "What if I mess this up?", reframe: "Even messy attempts still teach you something." },
          { worry: "What if they judge me?", reframe: "Most people are focused on themselves, not you." },
          { worry: "What if it's too late?", reframe: "Starting late still counts as starting." }
        ];

        const grid = document.getElementById("flipGrid");

        pairs.forEach(function (pair) {
          const card = document.createElement("div");
          card.className = "flip-card";
          card.textContent = pair.worry;
          let flipped = false;

          card.addEventListener("click", function () {
            flipped = !flipped;
            card.textContent = flipped ? pair.reframe : pair.worry;
          });

          grid.appendChild(card);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your reframe tool",
        instructions: "Customize the title and subtitle for your flip cards.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>What If, Reframed</h1>\n<p>Click a card to see a gentler perspective.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own worry/reframe pairs",
        instructions: "Replace these with what-ifs and reframes that feel true to you. Keep the same structure for each pair.",
        tip: "Tip: Only change the text inside the quotes, keep three pairs.",
        starterCode: `{ worry: "What if I mess this up?", reframe: "Even messy attempts still teach you something." },\n{ worry: "What if they judge me?", reframe: "Most people are focused on themselves, not you." },\n{ worry: "What if it's too late?", reframe: "Starting late still counts as starting." }`,
        apply(code, state) {
          state.js = state.js.replace(
            /const pairs = \[[\s\S]*?\];/,
            `const pairs = [\n          ${code}\n        ];`
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Click each card and read the reframe underneath.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your flip cards are ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — How Big Does It Feel? (Beginner)
     Mechanic: continuous live binding (no submit button)
     ============================================================ */
  "live-worry-scale": {
    mood: "anxious",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "How Big Does It Feel?",
    description: "Build a slider that resizes a shape in real time as you drag it.",
    steps: [
      "Create the HTML layout",
      "Style the circle",
      "Add the live resizing logic",
      "Adjust the size formula",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="live-scale-app">
          <h1>How Big Does It Feel?</h1>
          <p>Drag the slider — watch the circle grow or shrink with it.</p>
          <div class="scale-circle" id="scaleCircle"></div>
          <input type="range" id="scaleSlider" min="1" max="10" value="5" />
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .live-scale-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .scale-circle { width: 60px; height: 60px; margin: 20px auto; border-radius: 50%; background: #c0563c; transition: width 0.2s ease, height 0.2s ease; }
        input[type="range"] { width: 100%; margin-top: 12px; }
      `,
      js: `
        const circle = document.getElementById("scaleCircle");
        const slider = document.getElementById("scaleSlider");

        function updateSize() {
          const size = 30 + Number(slider.value) * 12;
          circle.style.width = size + "px";
          circle.style.height = size + "px";
        }

        slider.addEventListener("input", updateSize);
        updateSize();
      `
    },
    guidedSteps: [
      {
        title: "Name your scale",
        instructions: "Customize the title and subtitle for your live scale.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>How Big Does It Feel?</h1>\n<p>Drag the slider — watch the circle grow or shrink with it.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Choose your circle color",
        instructions: "Pick a color for the circle.",
        tip: "Tip: You can use simple color names or codes.",
        starterCode: `background: #c0563c;`,
        apply(code, state) {
          const colorMatch = code.match(/background:\s*(.*);/);
          let color = colorMatch ? colorMatch[1].trim() : "#c0563c";
          if (!color) color = "#c0563c";
          state.css = state.css.replace(/(\.scale-circle\s*{[\s\S]*?background:\s*)(.*?)(;)/, `$1${color}$3`);
        }
      },
      {
        title: "Adjust the size formula",
        instructions: "This formula decides how big the circle gets for each slider value. Try changing the numbers.",
        tip: "Tip: A bigger multiplier makes the circle grow faster as you drag.",
        starterCode: `const size = 30 + Number(slider.value) * 12;`,
        apply(code, state) {
          state.js = state.js.replace(/const size = .*?;/, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Drag the slider and watch the circle respond instantly.",
        tip: "Tip: You built real-time live binding — no button needed.",
        starterCode: `Your live scale is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Calm Routine Builder (Intermediate)
     Mechanic: user-curated, reorderable list played back sequentially
     ============================================================ */
  "calm-routine-builder": {
    mood: "anxious",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Calm Routine Builder",
    description: "Build a short routine of calming steps, put them in order, then walk through it one at a time.",
    steps: [
      "Create the HTML layout",
      "Add the reordering logic",
      "Customize the input prompt",
      "Customize your start button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="routine-app">
          <h1>Calm Routine Builder</h1>
          <p>Add a few calming steps, put them in order, then walk through them.</p>
          <input id="routineInput" type="text" placeholder="Add a calming step..." />
          <button id="addRoutineBtn">Add Step</button>
          <ul id="routineList"></ul>
          <button id="startRoutineBtn">Next Step</button>
          <p id="routineStatus"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .routine-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        ul { margin-top: 16px; padding: 0; list-style: none; text-align: left; }
        li { margin-top: 8px; padding: 10px; background: #f8f0e4; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
        li button { width: auto; margin: 0 0 0 6px; padding: 6px 10px; font-size: 12px; }
        #routineStatus { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const routineInput = document.getElementById("routineInput");
        const addRoutineBtn = document.getElementById("addRoutineBtn");
        const routineList = document.getElementById("routineList");
        const startRoutineBtn = document.getElementById("startRoutineBtn");
        const routineStatus = document.getElementById("routineStatus");

        let steps = [];
        let currentIndex = 0;

        function renderList() {
          routineList.innerHTML = "";
          steps.forEach(function (step, index) {
            const li = document.createElement("li");
            const label = document.createElement("span");
            label.textContent = step;

            const upBtn = document.createElement("button");
            upBtn.textContent = "↑";
            upBtn.addEventListener("click", function () {
              if (index === 0) return;
              const temp = steps[index - 1];
              steps[index - 1] = steps[index];
              steps[index] = temp;
              renderList();
            });

            const downBtn = document.createElement("button");
            downBtn.textContent = "↓";
            downBtn.addEventListener("click", function () {
              if (index === steps.length - 1) return;
              const temp = steps[index + 1];
              steps[index + 1] = steps[index];
              steps[index] = temp;
              renderList();
            });

            li.appendChild(label);
            li.appendChild(upBtn);
            li.appendChild(downBtn);
            routineList.appendChild(li);
          });
        }

        addRoutineBtn.addEventListener("click", function () {
          const value = routineInput.value;
          if (value.trim() === "") return;
          steps.push(value);
          routineInput.value = "";
          renderList();
        });

        startRoutineBtn.addEventListener("click", function () {
          if (steps.length === 0) {
            routineStatus.textContent = "Add a few steps first.";
            return;
          }
          if (currentIndex >= steps.length) currentIndex = 0;
          routineStatus.textContent = steps[currentIndex];
          currentIndex++;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your routine",
        instructions: "Customize the title and subtitle for your calm routine builder.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Calm Routine Builder</h1>\n<p>Add a few calming steps, put them in order, then walk through them.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you add a step.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="routineInput" type="text" placeholder="Add a calming step..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="routineInput".*?>/s, code);
        }
      },
      {
        title: "Customize your buttons",
        instructions: "Change what the add and start buttons say.",
        tip: "Tip: Only change the words inside each button.",
        starterCode: `<button id="addRoutineBtn">Add Step</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="addRoutineBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Add a few steps, reorder them, then click Next Step through your routine.",
        tip: "Tip: You built real list reordering — the same idea behind drag-and-drop task apps.",
        starterCode: `Your calm routine is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANXIOUS — Hold to Release (Intermediate)
     Mechanic: press-and-hold timing, not a single click
     ============================================================ */
  "hold-to-release": {
    mood: "anxious",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Hold to Release",
    description: "Build a button that asks you to press and hold steadily before it lets go.",
    steps: [
      "Create the HTML layout",
      "Add the hold-timing logic",
      "Set how long you need to hold",
      "Customize your success message",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="hold-app">
          <h1>Hold to Release</h1>
          <p>Press and hold the button. Let it fill before you let go.</p>
          <button id="holdBtn">Press and Hold</button>
          <div class="hold-track"><div class="hold-fill" id="holdFill"></div></div>
          <p id="holdMessage"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .hold-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        button { width: 100%; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        .hold-track { width: 100%; height: 14px; background: #eee2cf; border-radius: 999px; overflow: hidden; margin-top: 16px; }
        .hold-fill { height: 100%; width: 0%; background: #6fae8c; }
        #holdMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const holdBtn = document.getElementById("holdBtn");
        const holdFill = document.getElementById("holdFill");
        const holdMessage = document.getElementById("holdMessage");
        const holdDurationMs = 3000;
        let holdInterval;
        let startTime;

        function startHold() {
          startTime = Date.now();
          clearInterval(holdInterval);
          holdInterval = setInterval(function () {
            const elapsed = Date.now() - startTime;
            const pct = Math.min(100, (elapsed / holdDurationMs) * 100);
            holdFill.style.width = pct + "%";
            if (elapsed >= holdDurationMs) {
              clearInterval(holdInterval);
              holdMessage.textContent = "Released. Nicely done.";
            }
          }, 50);
        }

        function cancelHold() {
          clearInterval(holdInterval);
          holdFill.style.width = "0%";
          holdMessage.textContent = "Let go too soon — try again when ready.";
        }

        holdBtn.addEventListener("mousedown", startHold);
        holdBtn.addEventListener("mouseup", function () {
          const elapsed = Date.now() - startTime;
          if (elapsed < holdDurationMs) cancelHold();
        });
        holdBtn.addEventListener("mouseleave", function () {
          const elapsed = Date.now() - startTime;
          if (elapsed < holdDurationMs) cancelHold();
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your hold tool",
        instructions: "Customize the title and subtitle for your hold-to-release tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Hold to Release</h1>\n<p>Press and hold the button. Let it fill before you let go.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how long you need to hold",
        instructions: "Choose how many milliseconds you need to hold for (3000 = 3 seconds).",
        tip: "Tip: Only change the number.",
        starterCode: `const holdDurationMs = 3000;`,
        apply(code, state) {
          const match = code.match(/const holdDurationMs = (\d+);/);
          const ms = match ? match[1] : "3000";
          state.js = state.js.replace(/const holdDurationMs = \d+;/, `const holdDurationMs = ${ms};`);
        }
      },
      {
        title: "Customize your success message",
        instructions: "Change what shows up once you've held long enough.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `holdMessage.textContent = "Released. Nicely done.";`,
        apply(code, state) {
          state.js = state.js.replace(/holdMessage\.textContent = "Released\. Nicely done\.";/, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Press and hold the button until it fills completely.",
        tip: "Tip: You built real press-and-hold timing — the same idea behind long-press gestures.",
        starterCode: `Your hold-to-release tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  "loop-breaker": {
    mood: "overthinking",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Loop Breaker",
    description: "Build a tool that notices when you keep circling back to the exact same thought.",
    steps: [
      "Create the HTML layout",
      "Add the repetition detection logic",
      "Set how many repeats count as a loop",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="loopbreak-app">
          <h1>Loop Breaker</h1>
          <p>Type the thought you keep circling back to.</p>
          <input id="loopInput" type="text" placeholder="Type your thought..." />
          <button id="loopSubmitBtn">Submit</button>
          <p id="loopMessage"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .loopbreak-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #loopMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const loopInput = document.getElementById("loopInput");
        const loopSubmitBtn = document.getElementById("loopSubmitBtn");
        const loopMessage = document.getElementById("loopMessage");
        const loopThreshold = 3;
        let history = [];

        loopSubmitBtn.addEventListener("click", function () {
          const value = loopInput.value.trim();
          if (value === "") return;
          history.push(value.toLowerCase());
          loopInput.value = "";

          const recent = history.slice(-loopThreshold);
          const isLooping = recent.length === loopThreshold &&
            recent.every(function (item) { return item === recent[0]; });

          if (isLooping) {
            loopMessage.textContent = "You've circled back to this " + loopThreshold + " times in a row. Maybe it's time to set it down for a bit.";
          } else {
            loopMessage.textContent = "Noted: " + value;
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your loop breaker",
        instructions: "Customize the title and subtitle for your loop breaker.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Loop Breaker</h1>\n<p>Type the thought you keep circling back to.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how many repeats count as a loop",
        instructions: "Choose how many times in a row a thought needs to repeat before it counts as looping.",
        tip: "Tip: Only change the number.",
        starterCode: `const loopThreshold = 3;`,
        apply(code, state) {
          const match = code.match(/const loopThreshold = (\d+);/);
          const count = match ? match[1] : "3";
          state.js = state.js.replace(/const loopThreshold = \d+;/, `const loopThreshold = ${count};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you submit a thought.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="loopSubmitBtn">Submit</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="loopSubmitBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Type the same thought a few times in a row and see it get noticed.",
        tip: "Tip: You built real pattern detection — comparing entries against each other.",
        starterCode: `Your loop breaker is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Base Rate Check (Intermediate)
     Mechanic: two-slider comparison with a computed gap on submit
     ============================================================ */
  "base-rate-check": {
    mood: "overthinking",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Base Rate Check",
    description: "Build a tool that compares your feared prediction against what typically happens.",
    steps: [
      "Create the HTML layout",
      "Add the comparison logic",
      "Adjust the gap thresholds",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="baserate-app">
          <h1>Base Rate Check</h1>
          <p>Compare what you fear against what usually happens.</p>
          <label>My predicted chance (%)<input type="range" id="predictedSlider" min="0" max="100" value="50" /></label>
          <label>Typical base rate (%)<input type="range" id="baseRateSlider" min="0" max="100" value="10" /></label>
          <button id="compareBtn">Compare</button>
          <p id="baseRateResult"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .baserate-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        label { display: block; margin-top: 16px; text-align: left; font-size: 14px; color: #4a4740; }
        input[type="range"] { width: 100%; margin-top: 6px; }
        button { width: 100%; margin-top: 18px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #baseRateResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const predictedSlider = document.getElementById("predictedSlider");
        const baseRateSlider = document.getElementById("baseRateSlider");
        const compareBtn = document.getElementById("compareBtn");
        const result = document.getElementById("baseRateResult");

        compareBtn.addEventListener("click", function () {
          const predicted = Number(predictedSlider.value);
          const baseRate = Number(baseRateSlider.value);
          const gap = predicted - baseRate;

          let message;
          if (gap > 30) {
            message = "Your prediction is much higher than the typical base rate — worth double-checking the evidence.";
          } else if (gap > 0) {
            message = "Your prediction is a bit higher than the base rate, which is pretty normal.";
          } else {
            message = "Your prediction is right around or below the base rate.";
          }

          result.textContent = "Gap: " + gap + " points. " + message;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tool",
        instructions: "Customize the title and subtitle for your base rate check.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Base Rate Check</h1>\n<p>Compare what you fear against what usually happens.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust the gap thresholds",
        instructions: "These numbers decide how the gap between your prediction and reality gets described. Try changing them.",
        tip: "Tip: A smaller number after 'gap >' makes the tool flag smaller gaps.",
        starterCode: `if (gap > 30) {\n  message = "Your prediction is much higher than the typical base rate — worth double-checking the evidence.";\n} else if (gap > 0) {\n  message = "Your prediction is a bit higher than the base rate, which is pretty normal.";\n} else {\n  message = "Your prediction is right around or below the base rate.";\n}`,
        apply(code, state) {
          state.js = state.js.replace(
            /if \(gap > 30\) \{\s*message = "Your prediction is much higher than the typical base rate — worth double-checking the evidence\.";\s*\} else if \(gap > 0\) \{\s*message = "Your prediction is a bit higher than the base rate, which is pretty normal\.";\s*\} else \{\s*message = "Your prediction is right around or below the base rate\.";\s*\}/,
            code
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you compare your numbers.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="compareBtn">Compare</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="compareBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Slide both bars to a real fear you have, and compare.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your base rate check is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Elimination Bracket (Advanced)
     Mechanic: pairwise tournament elimination, not a simple list
     ============================================================ */
  "elimination-bracket": {
    mood: "overthinking",
    difficulty: "advanced",
    requiredPlan: "free",
    title: "Elimination Bracket",
    description: "Build a tournament-style tool that narrows a list of options down to one, one head-to-head choice at a time.",
    steps: [
      "Create the HTML layout",
      "Add options to your bracket",
      "Understand the elimination logic",
      "Customize your buttons",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="bracket-app">
          <h1>Elimination Bracket</h1>
          <p>Add your options, then pick the one that matters more, round by round.</p>
          <input id="optionInput" type="text" placeholder="Add an option..." />
          <button id="addOptionBtn">Add Option</button>
          <ul id="optionList"></ul>
          <button id="startBracketBtn">Start Comparing</button>
          <div id="bracketArea"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .bracket-app { width: min(440px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        ul { margin-top: 14px; padding: 0; list-style: none; text-align: left; }
        li { margin-top: 6px; padding: 8px 10px; background: #f8f0e4; border-radius: 8px; font-size: 13px; }
        #bracketArea { margin-top: 18px; }
        #bracketArea button { width: 48%; margin: 4px 1%; display: inline-block; }
      `,
      js: `
        const optionInput = document.getElementById("optionInput");
        const addOptionBtn = document.getElementById("addOptionBtn");
        const optionList = document.getElementById("optionList");
        const startBracketBtn = document.getElementById("startBracketBtn");
        const bracketArea = document.getElementById("bracketArea");

        let options = [];
        let queue = [];

        function renderOptions() {
          optionList.innerHTML = "";
          options.forEach(function (opt) {
            const li = document.createElement("li");
            li.textContent = opt;
            optionList.appendChild(li);
          });
        }

        addOptionBtn.addEventListener("click", function () {
          const value = optionInput.value;
          if (value.trim() === "") return;
          options.push(value);
          optionInput.value = "";
          renderOptions();
        });

        function showNextPair() {
          if (queue.length < 2) {
            if (queue.length === 1) {
              bracketArea.innerHTML = "<p>Winner: " + queue[0] + "</p>";
            } else {
              bracketArea.innerHTML = "<p>Add at least two options to compare.</p>";
            }
            return;
          }

          const a = queue[0];
          const b = queue[1];
          bracketArea.innerHTML = "";

          const prompt = document.createElement("p");
          prompt.textContent = "Which matters more?";
          bracketArea.appendChild(prompt);

          const btnA = document.createElement("button");
          btnA.textContent = a;
          const btnB = document.createElement("button");
          btnB.textContent = b;

          function pick(winner) {
            queue = queue.slice(2);
            queue.push(winner);
            showNextPair();
          }

          btnA.addEventListener("click", function () { pick(a); });
          btnB.addEventListener("click", function () { pick(b); });

          bracketArea.appendChild(btnA);
          bracketArea.appendChild(btnB);
        }

        startBracketBtn.addEventListener("click", function () {
          queue = options.slice();
          showNextPair();
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your bracket",
        instructions: "Customize the title and subtitle for your elimination bracket.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Elimination Bracket</h1>\n<p>Add your options, then pick the one that matters more, round by round.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you add an option.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="optionInput" type="text" placeholder="Add an option..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="optionInput".*?>/s, code);
        }
      },
      {
        title: "Understand the elimination logic",
        instructions: "Each time you pick a winner, it gets added back to the end of the line, and the next two in line face off. Try changing where the winner goes back to.",
        tip: "Tip: `queue.push(winner)` puts the winner at the back. `queue.unshift(winner)` would put it at the front instead.",
        starterCode: `queue = queue.slice(2);\nqueue.push(winner);`,
        apply(code, state) {
          state.js = state.js.replace(
            /queue = queue\.slice\(2\);\s*queue\.push\(winner\);/,
            code
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Add three or four options and work through the bracket to a winner.",
        tip: "Tip: You built a real tournament elimination algorithm — the same idea behind bracket-style voting.",
        starterCode: `Your bracket is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Confidence Decay (Intermediate)
     Mechanic: meter that auto-drains over time, opposite of a fill-on-hold
     ============================================================ */
  "confidence-decay-meter": {
    mood: "overthinking",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Confidence Decay",
    description: "Build a meter that fades over time unless you actively reaffirm it.",
    steps: [
      "Create the HTML layout",
      "Add the decay logic",
      "Set how fast confidence decays",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="decay-app">
          <h1>Confidence Decay</h1>
          <p>Confidence fades if you don't reaffirm it. Click to top it back up.</p>
          <div class="decay-track"><div class="decay-fill" id="decayFill"></div></div>
          <button id="reaffirmBtn">Still Confident</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .decay-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .decay-track { width: 100%; height: 16px; background: #eee2cf; border-radius: 999px; overflow: hidden; margin-top: 16px; }
        .decay-fill { height: 100%; width: 100%; background: #6fae8c; transition: width 0.3s linear; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        let confidence = 100;
        const decayRatePerSecond = 5;
        const decayFill = document.getElementById("decayFill");
        const reaffirmBtn = document.getElementById("reaffirmBtn");

        function render() {
          decayFill.style.width = confidence + "%";
        }

        setInterval(function () {
          confidence = Math.max(0, confidence - decayRatePerSecond);
          render();
        }, 1000);

        reaffirmBtn.addEventListener("click", function () {
          confidence = 100;
          render();
        });

        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your meter",
        instructions: "Customize the title and subtitle for your confidence decay meter.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Confidence Decay</h1>\n<p>Confidence fades if you don't reaffirm it. Click to top it back up.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how fast confidence decays",
        instructions: "Choose how many percentage points drain away each second.",
        tip: "Tip: Only change the number.",
        starterCode: `const decayRatePerSecond = 5;`,
        apply(code, state) {
          const match = code.match(/const decayRatePerSecond = (\d+);/);
          const rate = match ? match[1] : "5";
          state.js = state.js.replace(/const decayRatePerSecond = \d+;/, `const decayRatePerSecond = ${rate};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you reaffirm your confidence.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="reaffirmBtn">Still Confident</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="reaffirmBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Watch the meter drain, then click to top it back up.",
        tip: "Tip: You built an automatically-draining timer — the opposite of a fill-on-hold mechanic.",
        starterCode: `Your confidence meter is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Situation Lens (Beginner)
     Mechanic: sequential template interpolation of typed text
     ============================================================ */
  "situation-lens-shuffler": {
    mood: "overthinking",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Situation Lens",
    description: "Build a tool that reframes what you type through a few different mental lenses.",
    steps: [
      "Create the HTML layout",
      "Add the lens logic",
      "Write your own lens",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="lens-app">
          <h1>Situation Lens</h1>
          <p>Type what's on your mind, then view it through a few different lenses.</p>
          <input id="situationInput" type="text" placeholder="Describe the situation..." />
          <button id="lensNextBtn">See Next Lens</button>
          <p id="lensOutput"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .lens-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #lensOutput { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const situationInput = document.getElementById("situationInput");
        const lensNextBtn = document.getElementById("lensNextBtn");
        const lensOutput = document.getElementById("lensOutput");

        const lenses = [
          function (s) { return "Curious lens: What would you ask a friend about \\"" + s + "\\"?"; },
          function (s) { return "Practical lens: What's one small next step for \\"" + s + "\\"?"; },
          function (s) { return "Future-self lens: Will \\"" + s + "\\" matter in five years?"; }
        ];
        let lensIndex = 0;

        lensNextBtn.addEventListener("click", function () {
          const situation = situationInput.value.trim();
          if (situation === "") {
            lensOutput.textContent = "Type a situation first.";
            return;
          }
          lensOutput.textContent = lenses[lensIndex % lenses.length](situation);
          lensIndex++;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your lens tool",
        instructions: "Customize the title and subtitle for your situation lens.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Situation Lens</h1>\n<p>Type what's on your mind, then view it through a few different lenses.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you type a situation.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="situationInput" type="text" placeholder="Describe the situation..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="situationInput".*?>/s, code);
        }
      },
      {
        title: "Write your own first lens",
        instructions: "Replace the curious lens with a lens phrase that feels useful to you. Keep the function structure exactly the same.",
        tip: "Tip: Only change the words inside the quotes, keep the \\\" and + signs.",
        starterCode: `function (s) { return "Curious lens: What would you ask a friend about \\"" + s + "\\"?"; }`,
        apply(code, state) {
          state.js = state.js.replace(
            /function \(s\) \{ return "Curious lens: What would you ask a friend about \\"" \+ s \+ "\\"\?"; \}/,
            code
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Type a real situation and click through all three lenses.",
        tip: "Tip: You built real template interpolation — plugging your own text into pre-written sentences.",
        starterCode: `Your situation lens is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Mental Tabs (Beginner)
     Mechanic: gated removal — must provide input before an item can close
     ============================================================ */
  "mental-tabs-closer": {
    mood: "overthinking",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Mental Tabs",
    description: "Build a wall of open thoughts that can only close once you name a resolution.",
    steps: [
      "Create the HTML layout",
      "Style your tabs",
      "Add the gated closing logic",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="tabs-app">
          <h1>Mental Tabs</h1>
          <p>Add the thoughts taking up space. Close a tab by naming one resolution first.</p>
          <input id="tabInput" type="text" placeholder="Type an open thought..." />
          <button id="addTabBtn">Open Tab</button>
          <div id="tabList"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .tabs-app { width: min(440px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #tabList { margin-top: 16px; text-align: left; }
        .tab-chip { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; margin: 6px 6px 0 0; background: #eef2f6; border-radius: 999px; font-size: 13px; }
        .tab-chip button { width: auto; margin: 0; padding: 4px 10px; font-size: 12px; }
      `,
      js: `
        const tabInput = document.getElementById("tabInput");
        const addTabBtn = document.getElementById("addTabBtn");
        const tabList = document.getElementById("tabList");

        addTabBtn.addEventListener("click", function () {
          const value = tabInput.value;
          if (value.trim() === "") return;

          const chip = document.createElement("span");
          chip.className = "tab-chip";
          const label = document.createElement("span");
          label.textContent = value;

          const closeBtn = document.createElement("button");
          closeBtn.textContent = "Close";
          closeBtn.addEventListener("click", function () {
            const resolution = prompt("What's one resolution before closing this tab?");
            if (resolution && resolution.trim() !== "") {
              chip.remove();
            }
          });

          chip.appendChild(label);
          chip.appendChild(closeBtn);
          tabList.appendChild(chip);
          tabInput.value = "";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tabs tool",
        instructions: "Customize the title and subtitle for your mental tabs.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Mental Tabs</h1>\n<p>Add the thoughts taking up space. Close a tab by naming one resolution first.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you open a tab.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="tabInput" type="text" placeholder="Type an open thought..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="tabInput".*?>/s, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you open a new tab.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="addTabBtn">Open Tab</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="addTabBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Open a couple of tabs, then try closing one — notice it asks for a resolution first.",
        tip: "Tip: You built gated removal — the tab can't disappear without you giving it something first.",
        starterCode: `Your mental tabs are ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Certainty Contract (Intermediate)
     Mechanic: two-phase config-then-compare, not a single-shot form
     ============================================================ */
  "certainty-contract": {
    mood: "overthinking",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Certainty Contract",
    description: "Build a tool that locks in how certain you need to be, then checks your real decision against it.",
    steps: [
      "Create the HTML layout",
      "Add the contract-locking logic",
      "Add the comparison logic",
      "Customize your buttons",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="certainty-app">
          <h1>Certainty Contract</h1>
          <p>Decide upfront how certain you need to be. Then hold yourself to it.</p>
          <label>My certainty threshold (%)<input type="range" id="thresholdSlider" min="0" max="100" value="70" /></label>
          <button id="lockThresholdBtn">Lock It In</button>
          <div id="decisionSection" class="hidden-el">
            <label>My current certainty (%)<input type="range" id="currentSlider" min="0" max="100" value="50" /></label>
            <button id="checkCertaintyBtn">Check Against My Contract</button>
            <p id="certaintyResult"></p>
          </div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .certainty-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        label { display: block; margin-top: 16px; text-align: left; font-size: 14px; color: #4a4740; }
        input[type="range"] { width: 100%; margin-top: 6px; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        .hidden-el { display: none; }
        #certaintyResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const thresholdSlider = document.getElementById("thresholdSlider");
        const lockThresholdBtn = document.getElementById("lockThresholdBtn");
        const decisionSection = document.getElementById("decisionSection");
        const currentSlider = document.getElementById("currentSlider");
        const checkCertaintyBtn = document.getElementById("checkCertaintyBtn");
        const result = document.getElementById("certaintyResult");

        let lockedThreshold = null;

        lockThresholdBtn.addEventListener("click", function () {
          lockedThreshold = Number(thresholdSlider.value);
          decisionSection.classList.remove("hidden-el");
        });

        checkCertaintyBtn.addEventListener("click", function () {
          if (lockedThreshold === null) return;
          const current = Number(currentSlider.value);

          if (current >= lockedThreshold) {
            result.textContent = "You've met your own bar (" + lockedThreshold + "%). Time to act.";
          } else {
            result.textContent = "You're at " + current + "%, below your bar of " + lockedThreshold + "%. That's okay — wait or gather more info.";
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your contract",
        instructions: "Customize the title and subtitle for your certainty contract.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Certainty Contract</h1>\n<p>Decide upfront how certain you need to be. Then hold yourself to it.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your lock button",
        instructions: "Change what the button says when you lock in your threshold.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="lockThresholdBtn">Lock It In</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="lockThresholdBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Customize your check button",
        instructions: "Change what the button says when you check your certainty.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="checkCertaintyBtn">Check Against My Contract</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="checkCertaintyBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Lock in a threshold, then check a real decision against it.",
        tip: "Tip: You built a two-phase tool — one input locks in a rule, the other checks against it later.",
        starterCode: `Your certainty contract is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Quick Categorize (Beginner)
     Mechanic: keyboard-driven categorization, not click/select
     ============================================================ */
  "keyboard-shortcut-categorizer": {
    mood: "overthinking",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Quick Categorize",
    description: "Build a tool that sorts your thoughts with a single keypress instead of clicking.",
    steps: [
      "Create the HTML layout",
      "Add the keyboard shortcut logic",
      "Customize your categories",
      "Customize the input prompt",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="keycat-app">
          <h1>Quick Categorize</h1>
          <p>Type a thought, then press 1 (Worry), 2 (Task), or 3 (Fact) to sort it.</p>
          <input id="keycatInput" type="text" placeholder="Type a thought, then press 1, 2, or 3..." />
          <ul id="keycatList"></ul>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .keycat-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        ul { margin-top: 16px; padding: 0; list-style: none; text-align: left; }
        li { margin-top: 8px; padding: 10px 12px; background: #f8f0e4; border-radius: 10px; font-size: 14px; }
      `,
      js: `
        const keycatInput = document.getElementById("keycatInput");
        const keycatList = document.getElementById("keycatList");
        const categories = { "1": "Worry", "2": "Task", "3": "Fact" };

        keycatInput.addEventListener("keydown", function (e) {
          if (categories[e.key] && keycatInput.value.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = categories[e.key] + ": " + keycatInput.value;
            keycatList.appendChild(li);
            keycatInput.value = "";
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your categorizer",
        instructions: "Customize the title and subtitle for your quick categorize tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Quick Categorize</h1>\n<p>Type a thought, then press 1 (Worry), 2 (Task), or 3 (Fact) to sort it.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your categories",
        instructions: "Change what each number key sorts a thought into.",
        tip: "Tip: Keep the number keys the same, only change the category words.",
        starterCode: `const categories = { "1": "Worry", "2": "Task", "3": "Fact" };`,
        apply(code, state) {
          state.js = state.js.replace(/const categories = \{[\s\S]*?\};/, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you type a thought.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="keycatInput" type="text" placeholder="Type a thought, then press 1, 2, or 3..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="keycatInput".*?>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Type a thought and press 1, 2, or 3 to sort it — no clicking needed.",
        tip: "Tip: You built real keyboard-shortcut handling.",
        starterCode: `Your categorizer is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Zoom Out (Beginner)
     Mechanic: progressive visual scale-up cycling through fixed labels
     ============================================================ */
  "spiral-zoom-out": {
    mood: "overthinking",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Zoom Out",
    description: "Build a tool that visually zooms out through wider and wider timeframes with each click.",
    steps: [
      "Create the HTML layout",
      "Add the zoom cycling logic",
      "Write your own zoom levels",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="zoom-app">
          <h1>Zoom Out</h1>
          <p>Click to zoom out and gain a little perspective.</p>
          <div class="zoom-circle" id="zoomCircle"></div>
          <p id="zoomLabel">This moment</p>
          <button id="zoomOutBtn">Zoom Out</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .zoom-app { text-align: center; padding: 40px; }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .zoom-circle { width: 60px; height: 60px; margin: 20px auto; border-radius: 50%; background: #8fb0d3; transition: width 0.4s ease, height 0.4s ease; }
        button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const zoomLevels = ["This moment", "This week", "This month", "This year", "Five years from now"];
        let zoomIndex = 0;
        const zoomCircle = document.getElementById("zoomCircle");
        const zoomLabel = document.getElementById("zoomLabel");
        const zoomOutBtn = document.getElementById("zoomOutBtn");

        function render() {
          const size = 60 + zoomIndex * 40;
          zoomCircle.style.width = size + "px";
          zoomCircle.style.height = size + "px";
          zoomLabel.textContent = zoomLevels[zoomIndex];
        }

        zoomOutBtn.addEventListener("click", function () {
          if (zoomIndex < zoomLevels.length - 1) {
            zoomIndex++;
            render();
          } else {
            zoomOutBtn.textContent = "Fully zoomed out";
          }
        });

        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your zoom tool",
        instructions: "Customize the title and subtitle for your zoom out tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Zoom Out</h1>\n<p>Click to zoom out and gain a little perspective.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own zoom levels",
        instructions: "Replace these with timeframes that feel meaningful to you. Keep the quotation marks and commas.",
        tip: "Tip: Only change the words inside the quotes, keep all five.",
        starterCode: `"This moment", "This week", "This month", "This year", "Five years from now"`,
        apply(code, state) {
          state.js = state.js.replace(
            /const zoomLevels = \[.*?\];/s,
            `const zoomLevels = [${code}];`
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you zoom out.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="zoomOutBtn">Zoom Out</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="zoomOutBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click through all five zoom levels and watch the circle grow.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your zoom tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     OVERTHINKING — Time Cost (Beginner)
     Mechanic: running numeric accumulator across submissions
     ============================================================ */
  "time-cost-accumulator": {
    mood: "overthinking",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Overthinking Time Cost",
    description: "Build a tracker that adds up how many minutes you've spent turning something over.",
    steps: [
      "Create the HTML layout",
      "Add the running total logic",
      "Customize your input prompt",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="timecost-app">
          <h1>Overthinking Time Cost</h1>
          <p>Log how many minutes you've spent on this, and watch it add up.</p>
          <input id="minutesInput" type="number" min="1" placeholder="Minutes just now..." />
          <button id="logMinutesBtn">Log It</button>
          <p id="totalMinutes">Total: 0 minutes</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .timecost-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #totalMinutes { margin-top: 14px; font-weight: 600; color: #4f6f91; }
      `,
      js: `
        const minutesInput = document.getElementById("minutesInput");
        const logMinutesBtn = document.getElementById("logMinutesBtn");
        const totalMinutesEl = document.getElementById("totalMinutes");
        let totalMinutes = 0;

        logMinutesBtn.addEventListener("click", function () {
          const value = Number(minutesInput.value);
          if (!value || value <= 0) return;
          totalMinutes += value;
          totalMinutesEl.textContent = "Total: " + totalMinutes + " minutes";
          minutesInput.value = "";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tracker",
        instructions: "Customize the title and subtitle for your time cost tracker.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Overthinking Time Cost</h1>\n<p>Log how many minutes you've spent on this, and watch it add up.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you log minutes.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="minutesInput" type="number" min="1" placeholder="Minutes just now..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="minutesInput".*?>/s, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you log time.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="logMinutesBtn">Log It</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="logMinutesBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Log a few minutes and watch your running total grow.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your time cost tracker is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  "task-breakdown-chunker": {
    mood: "unmotivated",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Task Breakdown",
    description: "Build a tool that turns one big, overwhelming task into a few tiny starter steps.",
    steps: [
      "Create the HTML layout",
      "Add the breakdown logic",
      "Write your own starter template",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="chunker-app">
          <h1>Task Breakdown</h1>
          <p>Type a task that feels too big, and break it into tiny steps.</p>
          <input id="bigTaskInput" type="text" placeholder="Type a big task..." />
          <button id="breakDownBtn">Break It Down</button>
          <ul id="chunkList"></ul>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .chunker-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        ul { margin-top: 16px; padding: 0; list-style: none; text-align: left; }
        li { margin-top: 8px; padding: 10px 12px; background: #f8f0e4; border-radius: 10px; font-size: 14px; }
      `,
      js: `
        const bigTaskInput = document.getElementById("bigTaskInput");
        const breakDownBtn = document.getElementById("breakDownBtn");
        const chunkList = document.getElementById("chunkList");

        const templates = [
          function (t) { return "Open whatever you need for: " + t; },
          function (t) { return "Set a 2-minute timer and just start: " + t; },
          function (t) { return "Do the smallest possible piece of: " + t; }
        ];

        breakDownBtn.addEventListener("click", function () {
          const task = bigTaskInput.value.trim();
          if (task === "") return;

          chunkList.innerHTML = "";
          templates.forEach(function (template) {
            const li = document.createElement("li");
            li.textContent = template(task);
            chunkList.appendChild(li);
          });
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your breakdown tool",
        instructions: "Customize the title and subtitle for your task breakdown tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Task Breakdown</h1>\n<p>Type a task that feels too big, and break it into tiny steps.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own first template",
        instructions: "Replace the first suggestion with a starter phrase that works for you. Keep the function structure exactly the same.",
        tip: "Tip: Only change the words inside the quotes, keep the + signs.",
        starterCode: `function (t) { return "Open whatever you need for: " + t; }`,
        apply(code, state) {
          state.js = state.js.replace(
            /function \(t\) \{ return "Open whatever you need for: " \+ t; \}/,
            code
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you break down a task.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="breakDownBtn">Break It Down</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="breakDownBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Type a real overwhelming task and see it broken into small starter steps.",
        tip: "Tip: You built real template generation — one input producing several outputs.",
        starterCode: `Your breakdown tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Momentum Ball (Intermediate)
     Mechanic: combined accumulate-on-click + auto-decay-over-time
     ============================================================ */
  "momentum-ball": {
    mood: "unmotivated",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Momentum Ball",
    description: "Build a ball that speeds up with every small action, and slowly loses speed if you stop.",
    steps: [
      "Create the HTML layout",
      "Add the speed logic",
      "Set how fast momentum decays",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="momentumball-app">
          <h1>Momentum Ball</h1>
          <p>Every small action adds speed. Idle time slows it down.</p>
          <div class="ball-track"><div class="ball" id="momentumBall"></div></div>
          <button id="didSomethingBtn">I Did Something</button>
          <p id="speedLabel">Speed: 0</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .momentumball-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .ball-track { position: relative; height: 20px; background: #eee2cf; border-radius: 999px; margin-top: 16px; overflow: hidden; }
        .ball { position: absolute; top: 1px; left: 1px; width: 18px; height: 18px; border-radius: 50%; background: #6fae8c; transition: left 0.3s ease; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #speedLabel { margin-top: 12px; font-weight: 500; color: #4f6f91; }
      `,
      js: `
        let speed = 0;
        const maxSpeed = 10;
        const decayIntervalMs = 2000;
        const ball = document.getElementById("momentumBall");
        const speedLabel = document.getElementById("speedLabel");
        const track = document.querySelector(".ball-track");
        const didSomethingBtn = document.getElementById("didSomethingBtn");

        function render() {
          speedLabel.textContent = "Speed: " + speed;
          const trackWidth = track.clientWidth - 20;
          const position = (speed / maxSpeed) * trackWidth;
          ball.style.left = position + "px";
        }

        didSomethingBtn.addEventListener("click", function () {
          speed = Math.min(maxSpeed, speed + 1);
          render();
        });

        setInterval(function () {
          speed = Math.max(0, speed - 1);
          render();
        }, decayIntervalMs);

        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your momentum ball",
        instructions: "Customize the title and subtitle for your momentum ball.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Momentum Ball</h1>\n<p>Every small action adds speed. Idle time slows it down.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how fast momentum decays",
        instructions: "Choose how many milliseconds pass between each speed decrease when you're idle.",
        tip: "Tip: Only change the number. A bigger number means slower decay.",
        starterCode: `const decayIntervalMs = 2000;`,
        apply(code, state) {
          const match = code.match(/const decayIntervalMs = (\d+);/);
          const ms = match ? match[1] : "2000";
          state.js = state.js.replace(/const decayIntervalMs = \d+;/, `const decayIntervalMs = ${ms};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you log an action.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="didSomethingBtn">I Did Something</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="didSomethingBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click a few times, then watch the ball slow down if you stop.",
        tip: "Tip: You built two opposing forces working together — one adds, one decays.",
        starterCode: `Your momentum ball is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Excuse Buster (Intermediate)
     Mechanic: keyword matching against a list of known patterns
     ============================================================ */
  "excuse-buster": {
    mood: "unmotivated",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Excuse Buster",
    description: "Build a tool that recognizes common excuses and gives you a real response back.",
    steps: [
      "Create the HTML layout",
      "Add the matching logic",
      "Write your own excuse patterns",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="excuse-app">
          <h1>Excuse Buster</h1>
          <p>Type your excuse. Let's see what's really going on.</p>
          <input id="excuseInput" type="text" placeholder="Type your excuse..." />
          <button id="bustBtn">Bust It</button>
          <p id="excuseResult"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .excuse-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #excuseResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const excuseInput = document.getElementById("excuseInput");
        const bustBtn = document.getElementById("bustBtn");
        const result = document.getElementById("excuseResult");

        const patterns = [
          { keyword: "tired", response: "Tired counts. Can you do just 2 minutes anyway?" },
          { keyword: "later", response: "Later has a way of becoming never. What about right now, small?" },
          { keyword: "perfect", response: "It doesn't need to be perfect. It just needs to exist." }
        ];

        bustBtn.addEventListener("click", function () {
          const value = excuseInput.value.toLowerCase();
          if (value.trim() === "") return;

          const match = patterns.find(function (p) { return value.indexOf(p.keyword) !== -1; });
          result.textContent = match ? match.response : "Whatever the excuse is, one tiny step still counts.";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your buster",
        instructions: "Customize the title and subtitle for your excuse buster.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Excuse Buster</h1>\n<p>Type your excuse. Let's see what's really going on.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own excuse patterns",
        instructions: "Replace these with excuses you actually hear yourself say, and how you'd want to respond.",
        tip: "Tip: Keep the same structure — keyword, then response.",
        starterCode: `{ keyword: "tired", response: "Tired counts. Can you do just 2 minutes anyway?" },\n{ keyword: "later", response: "Later has a way of becoming never. What about right now, small?" },\n{ keyword: "perfect", response: "It doesn't need to be perfect. It just needs to exist." }`,
        apply(code, state) {
          state.js = state.js.replace(
            /const patterns = \[[\s\S]*?\];/,
            `const patterns = [\n          ${code}\n        ];`
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you bust an excuse.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="bustBtn">Bust It</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="bustBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Type one of your real excuses and see what comes back.",
        tip: "Tip: You built real keyword matching — the same idea behind simple chatbots.",
        starterCode: `Your excuse buster is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — 5-Second Launch (Beginner)
     Mechanic: short auto-countdown that ends in a state-changing trigger
     ============================================================ */
  "five-second-launch": {
    mood: "unmotivated",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "5-Second Launch",
    description: "Build a countdown that pushes you into action before you can talk yourself out of it.",
    steps: [
      "Create the HTML layout",
      "Add the countdown logic",
      "Set your countdown length",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="launch-app">
          <h1>5-Second Launch</h1>
          <p>Count down, then go — before you can talk yourself out of it.</p>
          <div id="launchCount">5</div>
          <button id="launchBtn">Start Countdown</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .launch-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        #launchCount { font-size: 64px; margin: 20px 0; font-weight: 700; color: #6f97c1; }
        button { width: 100%; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        button.launched { background: #6fae8c; }
      `,
      js: `
        const launchCount = document.getElementById("launchCount");
        const launchBtn = document.getElementById("launchBtn");
        const startNumber = 5;
        let interval;

        launchBtn.addEventListener("click", function () {
          let count = startNumber;
          launchCount.textContent = count;
          launchBtn.disabled = true;
          clearInterval(interval);

          interval = setInterval(function () {
            count--;
            if (count <= 0) {
              clearInterval(interval);
              launchCount.textContent = "GO";
              launchBtn.textContent = "Go!";
              launchBtn.classList.add("launched");
              launchBtn.disabled = false;
            } else {
              launchCount.textContent = count;
            }
          }, 1000);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your launch tool",
        instructions: "Customize the title and subtitle for your 5-second launch.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>5-Second Launch</h1>\n<p>Count down, then go — before you can talk yourself out of it.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set your countdown length",
        instructions: "Choose what number the countdown starts from.",
        tip: "Tip: Only change the number.",
        starterCode: `const startNumber = 5;`,
        apply(code, state) {
          const match = code.match(/const startNumber = (\d+);/);
          const number = match ? match[1] : "5";
          state.js = state.js.replace(/const startNumber = \d+;/, `const startNumber = ${number};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says before you start the countdown.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="launchBtn">Start Countdown</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="launchBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Start the countdown and notice the moment it hits GO.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your launch tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Task Roulette (Intermediate)
     Mechanic: CSS rotation animation landing on a random item
     ============================================================ */
  "task-roulette-wheel": {
    mood: "unmotivated",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Task Roulette",
    description: "Build a spinning wheel that picks one of your tasks for you, so you don't have to decide.",
    steps: [
      "Create the HTML layout",
      "Add your tasks",
      "Add the spin logic",
      "Adjust how many times it spins",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="wheel-app">
          <h1>Task Roulette</h1>
          <p>Add a few tasks, then spin to pick one.</p>
          <input id="wheelTaskInput" type="text" placeholder="Add a task..." />
          <button id="addWheelTaskBtn">Add Task</button>
          <div class="wheel" id="wheel"></div>
          <button id="spinBtn">Spin</button>
          <p id="wheelResult"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .wheel-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        .wheel { width: 140px; height: 140px; margin: 20px auto; border-radius: 50%; background: conic-gradient(#8fb0d3, #c8a96a, #6fae8c, #c0563c); transition: transform 3s cubic-bezier(.17,.67,.32,1.28); }
        #wheelResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const wheelTaskInput = document.getElementById("wheelTaskInput");
        const addWheelTaskBtn = document.getElementById("addWheelTaskBtn");
        const wheel = document.getElementById("wheel");
        const spinBtn = document.getElementById("spinBtn");
        const result = document.getElementById("wheelResult");

        let tasks = [];
        let rotation = 0;

        addWheelTaskBtn.addEventListener("click", function () {
          const value = wheelTaskInput.value;
          if (value.trim() === "") return;
          tasks.push(value);
          wheelTaskInput.value = "";
        });

        spinBtn.addEventListener("click", function () {
          if (tasks.length === 0) {
            result.textContent = "Add a few tasks first.";
            return;
          }

          const spins = 4;
          rotation += spins * 360 + Math.floor(Math.random() * 360);
          wheel.style.transform = "rotate(" + rotation + "deg)";

          setTimeout(function () {
            const chosen = tasks[Math.floor(Math.random() * tasks.length)];
            result.textContent = "Your task: " + chosen;
          }, 3000);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your roulette",
        instructions: "Customize the title and subtitle for your task roulette.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Task Roulette</h1>\n<p>Add a few tasks, then spin to pick one.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you add a task.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="wheelTaskInput" type="text" placeholder="Add a task..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="wheelTaskInput".*?>/s, code);
        }
      },
      {
        title: "Adjust how many times it spins",
        instructions: "Choose how many full rotations happen before the wheel stops.",
        tip: "Tip: Only change the number.",
        starterCode: `const spins = 4;`,
        apply(code, state) {
          const match = code.match(/const spins = (\d+);/);
          const count = match ? match[1] : "4";
          state.js = state.js.replace(/const spins = \d+;/, `const spins = ${count};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Add three or four tasks and give the wheel a spin.",
        tip: "Tip: You built a real spinning animation using CSS rotation.",
        starterCode: `Your task roulette is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Minimum Effort Contract (Beginner)
     Mechanic: a config slider plus a simple tally counter
     ============================================================ */
  "minimum-effort-contract": {
    mood: "unmotivated",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Minimum Effort Contract",
    description: "Build a tool that lets you set the smallest version of showing up, and tally each time you do it.",
    steps: [
      "Create the HTML layout",
      "Style your contract",
      "Add the tally logic",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="minimum-app">
          <h1>Minimum Effort Contract</h1>
          <p>Set the smallest version of showing up. Just log it when you do.</p>
          <label>My minimum effort level<input type="range" id="minEffortSlider" min="1" max="10" value="2" /></label>
          <button id="logMinimumBtn">I Did the Minimum</button>
          <p id="minimumCount">Times shown up: 0</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .minimum-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        label { display: block; margin-top: 16px; text-align: left; font-size: 14px; color: #4a4740; }
        input[type="range"] { width: 100%; margin-top: 6px; }
        button { width: 100%; margin-top: 18px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #minimumCount { margin-top: 14px; font-weight: 600; color: #4f6f91; }
      `,
      js: `
        const logMinimumBtn = document.getElementById("logMinimumBtn");
        const minimumCount = document.getElementById("minimumCount");
        let count = 0;

        logMinimumBtn.addEventListener("click", function () {
          count++;
          minimumCount.textContent = "Times shown up: " + count;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your contract",
        instructions: "Customize the title and subtitle for your minimum effort contract.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Minimum Effort Contract</h1>\n<p>Set the smallest version of showing up. Just log it when you do.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your slider label",
        instructions: "Change what the slider label says.",
        tip: "Tip: Keep the input tag exactly as it is, only change the words before it.",
        starterCode: `<label>My minimum effort level<input type="range" id="minEffortSlider" min="1" max="10" value="2" /></label>`,
        apply(code, state) {
          state.html = state.html.replace(/<label>.*?minEffortSlider.*?<\/label>/s, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you log showing up.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="logMinimumBtn">I Did the Minimum</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="logMinimumBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Set your minimum, then log a few times you've shown up.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your contract is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Domino Chain (Advanced)
     Mechanic: one click triggers a chained waterfall of timed events
     ============================================================ */
  "domino-chain": {
    mood: "unmotivated",
    difficulty: "advanced",
    requiredPlan: "free",
    title: "Domino Chain",
    description: "Build a row of dominoes where clicking the first one starts a chain reaction through all the rest.",
    steps: [
      "Create the HTML layout",
      "Style your dominoes",
      "Add the chain logic",
      "Set how fast the chain falls",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="domino-app">
          <h1>Domino Chain</h1>
          <p>Click the first domino to start the chain.</p>
          <div class="domino-row" id="dominoRow">
            <div class="domino"></div>
            <div class="domino"></div>
            <div class="domino"></div>
            <div class="domino"></div>
            <div class="domino"></div>
          </div>
          <p id="dominoMessage"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .domino-app { width: min(440px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .domino-row { display: flex; gap: 10px; justify-content: center; margin-top: 24px; align-items: flex-end; }
        .domino { width: 20px; height: 70px; background: #c8bda9; border-radius: 4px; transform-origin: bottom; transition: transform 0.4s ease, background 0.4s ease; cursor: pointer; }
        .domino.fallen { transform: rotate(70deg); background: #c0563c; }
        #dominoMessage { margin-top: 16px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const dominoes = document.querySelectorAll(".domino");
        const dominoMessage = document.getElementById("dominoMessage");
        const fallDelayMs = 300;

        function fallFrom(index) {
          if (index >= dominoes.length) {
            dominoMessage.textContent = "You started the chain. That's all it takes.";
            return;
          }
          dominoes[index].classList.add("fallen");
          setTimeout(function () { fallFrom(index + 1); }, fallDelayMs);
        }

        dominoes[0].addEventListener("click", function () {
          fallFrom(0);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your domino chain",
        instructions: "Customize the title and subtitle for your domino chain.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Domino Chain</h1>\n<p>Click the first domino to start the chain.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Understand the chain logic",
        instructions: "Each domino falls, then schedules the next one to fall a little later — that's what makes it look like a chain instead of everything falling at once.",
        tip: "Tip: `fallFrom` calls itself again for the next domino, with a short delay in between.",
        starterCode: `function fallFrom(index) {\n  if (index >= dominoes.length) {\n    dominoMessage.textContent = "You started the chain. That's all it takes.";\n    return;\n  }\n  dominoes[index].classList.add("fallen");\n  setTimeout(function () { fallFrom(index + 1); }, fallDelayMs);\n}`,
        apply(code, state) {
          state.js = state.js.replace(
            /function fallFrom\(index\) \{\s*if \(index >= dominoes\.length\) \{\s*dominoMessage\.textContent = "You started the chain\. That's all it takes\.";\s*return;\s*\}\s*dominoes\[index\]\.classList\.add\("fallen"\);\s*setTimeout\(function \(\) \{ fallFrom\(index \+ 1\); \}, fallDelayMs\);\s*\}/,
            code
          );
        }
      },
      {
        title: "Set how fast the chain falls",
        instructions: "Choose how many milliseconds pass between each domino falling.",
        tip: "Tip: Only change the number. A smaller number makes the chain fall faster.",
        starterCode: `const fallDelayMs = 300;`,
        apply(code, state) {
          const match = code.match(/const fallDelayMs = (\d+);/);
          const ms = match ? match[1] : "300";
          state.js = state.js.replace(/const fallDelayMs = \d+;/, `const fallDelayMs = ${ms};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click the first domino and watch the whole chain go.",
        tip: "Tip: You built a real chained sequence — one action triggering the next, automatically.",
        starterCode: `Your domino chain is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Tiny Task Dice (Beginner)
     Mechanic: random roll mapped to a fixed array via array index
     ============================================================ */
  "tiny-task-dice": {
    mood: "unmotivated",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Tiny Task Dice",
    description: "Build a die you can roll to get handed one tiny task at random.",
    steps: [
      "Create the HTML layout",
      "Add the rolling logic",
      "Write your own tiny tasks",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="dice-app">
          <h1>Tiny Task Dice</h1>
          <p>Roll the die. Do whatever tiny task it lands on.</p>
          <div class="die" id="die">1</div>
          <button id="rollDiceBtn">Roll</button>
          <p id="diceTask"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .dice-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .die { width: 70px; height: 70px; margin: 20px auto; display: grid; place-items: center; background: white; border: 2px solid #d6cec2; border-radius: 12px; font-size: 28px; font-weight: 700; color: #4a4740; }
        button { width: 100%; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #diceTask { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const die = document.getElementById("die");
        const rollDiceBtn = document.getElementById("rollDiceBtn");
        const diceTask = document.getElementById("diceTask");

        const tasks = [
          "Fill one glass of water.",
          "Open the document and just look at it.",
          "Stand up and stretch for 30 seconds.",
          "Write one sentence of anything.",
          "Tidy one small surface.",
          "Send one message you've been putting off."
        ];

        rollDiceBtn.addEventListener("click", function () {
          const roll = Math.floor(Math.random() * 6) + 1;
          die.textContent = roll;
          diceTask.textContent = tasks[roll - 1];
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your dice tool",
        instructions: "Customize the title and subtitle for your tiny task dice.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Tiny Task Dice</h1>\n<p>Roll the die. Do whatever tiny task it lands on.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own tiny tasks",
        instructions: "Replace these with six genuinely tiny tasks you'd actually do. Keep the quotation marks and commas, and keep all six.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `"Fill one glass of water.",\n"Open the document and just look at it.",\n"Stand up and stretch for 30 seconds.",\n"Write one sentence of anything.",\n"Tidy one small surface.",\n"Send one message you've been putting off."`,
        apply(code, state) {
          state.js = state.js.replace(
            /const tasks = \[[\s\S]*?\];/,
            `const tasks = [\n          ${code}\n        ];`
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you roll the die.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="rollDiceBtn">Roll</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="rollDiceBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Roll the die a couple of times and see what you get.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your task dice is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Accountability Ping (Intermediate)
     Mechanic: a single scheduled future notification, not a list
     ============================================================ */
  "accountability-ping": {
    mood: "unmotivated",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Accountability Ping",
    description: "Build a tool that schedules a reminder for future you, and lets it show up unprompted.",
    steps: [
      "Create the HTML layout",
      "Add the scheduling logic",
      "Set how long until the ping arrives",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="ping-app">
          <h1>Accountability Ping</h1>
          <p>Set a reminder for future you. It'll show up here, unprompted.</p>
          <input id="pingInput" type="text" placeholder="What do you want to be reminded of?" />
          <button id="schedulePingBtn">Schedule Reminder</button>
          <div id="pingBanner" class="hidden-el"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .ping-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        .hidden-el { display: none; }
        #pingBanner { margin-top: 16px; padding: 14px; background: #eaf1f8; border-radius: 12px; color: #4f6f91; font-weight: 500; }
      `,
      js: `
        const pingInput = document.getElementById("pingInput");
        const schedulePingBtn = document.getElementById("schedulePingBtn");
        const pingBanner = document.getElementById("pingBanner");
        const pingDelaySeconds = 10;

        schedulePingBtn.addEventListener("click", function () {
          const value = pingInput.value;
          if (value.trim() === "") return;

          pingInput.value = "";
          schedulePingBtn.disabled = true;
          schedulePingBtn.textContent = "Reminder scheduled...";

          setTimeout(function () {
            pingBanner.textContent = "⏰ " + value;
            pingBanner.classList.remove("hidden-el");
            schedulePingBtn.disabled = false;
            schedulePingBtn.textContent = "Schedule Reminder";
          }, pingDelaySeconds * 1000);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your ping tool",
        instructions: "Customize the title and subtitle for your accountability ping.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Accountability Ping</h1>\n<p>Set a reminder for future you. It'll show up here, unprompted.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how long until the ping arrives",
        instructions: "Choose how many seconds pass before your reminder shows up.",
        tip: "Tip: Only change the number.",
        starterCode: `const pingDelaySeconds = 10;`,
        apply(code, state) {
          const match = code.match(/const pingDelaySeconds = (\d+);/);
          const seconds = match ? match[1] : "10";
          state.js = state.js.replace(/const pingDelaySeconds = \d+;/, `const pingDelaySeconds = ${seconds};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you schedule a reminder.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="schedulePingBtn">Schedule Reminder</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="schedulePingBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Schedule a reminder and wait for it to show up on its own.",
        tip: "Tip: You built a real scheduled notification — appearing without you doing anything else.",
        starterCode: `Your ping tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     UNMOTIVATED — Energy Battery (Beginner)
     Mechanic: segmented click-to-charge meter, no auto-decay or checkboxes
     ============================================================ */
  "energy-battery-meter": {
    mood: "unmotivated",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Energy Battery",
    description: "Build a battery you charge up one click at a time, until you're ready to go.",
    steps: [
      "Create the HTML layout",
      "Add the charging logic",
      "Set how much each click adds",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="battery-app">
          <h1>Energy Battery</h1>
          <p>Click to charge up your energy, one small bit at a time.</p>
          <div class="battery-shell"><div class="battery-fill" id="batteryFill"></div></div>
          <button id="chargeBtn">Charge +1</button>
          <p id="batteryMessage"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .battery-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .battery-shell { width: 100%; height: 26px; border: 2px solid #6f6a64; border-radius: 6px; overflow: hidden; margin-top: 16px; }
        .battery-fill { height: 100%; width: 0%; background: #6fae8c; transition: width 0.3s ease; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #batteryMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        let charge = 0;
        const chargePerClick = 10;
        const batteryFill = document.getElementById("batteryFill");
        const chargeBtn = document.getElementById("chargeBtn");
        const batteryMessage = document.getElementById("batteryMessage");

        chargeBtn.addEventListener("click", function () {
          charge = Math.min(100, charge + chargePerClick);
          batteryFill.style.width = charge + "%";

          if (charge >= 100) {
            batteryMessage.textContent = "Fully charged. Ready to go.";
          } else {
            batteryMessage.textContent = charge + "% charged.";
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your battery",
        instructions: "Customize the title and subtitle for your energy battery.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Energy Battery</h1>\n<p>Click to charge up your energy, one small bit at a time.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how much each click adds",
        instructions: "Choose how many percentage points each click charges.",
        tip: "Tip: Only change the number.",
        starterCode: `const chargePerClick = 10;`,
        apply(code, state) {
          const match = code.match(/const chargePerClick = (\d+);/);
          const amount = match ? match[1] : "10";
          state.js = state.js.replace(/const chargePerClick = \d+;/, `const chargePerClick = ${amount};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you charge up.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="chargeBtn">Charge +1</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="chargeBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click a few times until your battery reaches full charge.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your energy battery is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  "self-compassion-rewriter": {
    mood: "sad",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Kinder Words",
    description: "Build a tool that takes a harsh thought about yourself and rewrites it a little kinder.",
    steps: [
      "Create the HTML layout",
      "Add the rewriting logic",
      "Write your own replacement rules",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="rewriter-app">
          <h1>Kinder Words</h1>
          <p>Type a harsh thought about yourself. Let's soften it.</p>
          <input id="harshInput" type="text" placeholder="Type the harsh thought..." />
          <button id="rewriteBtn">Rewrite It Kinder</button>
          <p id="kindOutput"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .rewriter-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #kindOutput { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const harshInput = document.getElementById("harshInput");
        const rewriteBtn = document.getElementById("rewriteBtn");
        const kindOutput = document.getElementById("kindOutput");

        const replacements = [
          { from: /stupid/gi, to: "still learning" },
          { from: /failure/gi, to: "having a hard moment" },
          { from: /worthless/gi, to: "worthy, even now" }
        ];

        rewriteBtn.addEventListener("click", function () {
          let text = harshInput.value;
          if (text.trim() === "") return;

          replacements.forEach(function (r) {
            text = text.replace(r.from, r.to);
          });

          kindOutput.textContent = text;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tool",
        instructions: "Customize the title and subtitle for your kinder words tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Kinder Words</h1>\n<p>Type a harsh thought about yourself. Let's soften it.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own replacement rules",
        instructions: "Replace these with harsh words you catch yourself using, and kinder versions to swap in.",
        tip: "Tip: Keep the /word/gi format for 'from', and put your kinder phrase in quotes for 'to'.",
        starterCode: `{ from: /stupid/gi, to: "still learning" },\n{ from: /failure/gi, to: "having a hard moment" },\n{ from: /worthless/gi, to: "worthy, even now" }`,
        apply(code, state) {
          state.js = state.js.replace(
            /const replacements = \[[\s\S]*?\];/,
            `const replacements = [\n          ${code}\n        ];`
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you rewrite a thought.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="rewriteBtn">Rewrite It Kinder</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="rewriteBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Type a real harsh thought and watch it get softened.",
        tip: "Tip: You built real text transformation — the same idea behind autocorrect and filters.",
        starterCode: `Your kinder words tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Memory Match (Intermediate)
     Mechanic: classic card-flip matching game
     ============================================================ */
  "comfort-memory-match": {
    mood: "sad",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Memory Match",
    description: "Build a matching game with a small deck of comforting symbols.",
    steps: [
      "Create the HTML layout",
      "Add the shuffle and flip logic",
      "Write your own symbols",
      "Adjust the flip-back delay",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="match-app">
          <h1>Memory Match</h1>
          <p>Flip two cards at a time to find comforting matches.</p>
          <div class="match-grid" id="matchGrid"></div>
          <p id="matchStatus">0 of 4 pairs found</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .match-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .match-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px; }
        .match-card { aspect-ratio: 1; display: grid; place-items: center; background: #8fb0d3; border-radius: 10px; font-size: 22px; color: white; cursor: pointer; }
        .match-card.revealed { background: #f8f0e4; color: #4a4740; }
        .match-card.matched { background: #6fae8c; color: white; cursor: default; }
        #matchStatus { margin-top: 14px; font-weight: 500; color: #4f6f91; }
      `,
      js: `
        const symbols = ["♡", "☀", "☘", "☁"];
        const cardValues = symbols.concat(symbols);

        for (let i = cardValues.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = cardValues[i];
          cardValues[i] = cardValues[j];
          cardValues[j] = temp;
        }

        const matchGrid = document.getElementById("matchGrid");
        const matchStatus = document.getElementById("matchStatus");
        let revealed = [];
        let matchedCount = 0;
        const flipBackDelayMs = 800;

        cardValues.forEach(function (value) {
          const card = document.createElement("div");
          card.className = "match-card";
          card.dataset.value = value;

          card.addEventListener("click", function () {
            if (card.classList.contains("revealed") || card.classList.contains("matched") || revealed.length === 2) return;

            card.classList.add("revealed");
            card.textContent = value;
            revealed.push(card);

            if (revealed.length === 2) {
              const first = revealed[0];
              const second = revealed[1];

              if (first.dataset.value === second.dataset.value) {
                first.classList.add("matched");
                second.classList.add("matched");
                matchedCount++;
                matchStatus.textContent = matchedCount + " of " + symbols.length + " pairs found";
                revealed = [];
              } else {
                setTimeout(function () {
                  first.classList.remove("revealed");
                  second.classList.remove("revealed");
                  first.textContent = "";
                  second.textContent = "";
                  revealed = [];
                }, flipBackDelayMs);
              }
            }
          });

          matchGrid.appendChild(card);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your matching game",
        instructions: "Customize the title and subtitle for your memory match game.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Memory Match</h1>\n<p>Flip two cards at a time to find comforting matches.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own symbols",
        instructions: "Replace these with four symbols or short words that feel comforting to you.",
        tip: "Tip: Only change the words inside the quotes, keep exactly four.",
        starterCode: `"♡", "☀", "☘", "☁"`,
        apply(code, state) {
          state.js = state.js.replace(/const symbols = \[.*?\];/, `const symbols = [${code}];`);
        }
      },
      {
        title: "Adjust the flip-back delay",
        instructions: "Choose how many milliseconds a non-matching pair stays visible before flipping back.",
        tip: "Tip: Only change the number.",
        starterCode: `const flipBackDelayMs = 800;`,
        apply(code, state) {
          const match = code.match(/const flipBackDelayMs = (\d+);/);
          const ms = match ? match[1] : "800";
          state.js = state.js.replace(/const flipBackDelayMs = \d+;/, `const flipBackDelayMs = ${ms};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Play through the game and find all four pairs.",
        tip: "Tip: You built a real matching game — the same logic behind classic memory games.",
        starterCode: `Your memory match game is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Emotion Weather (Beginner)
     Mechanic: dropdown selection driving a static message + display
     ============================================================ */
  "emotion-weather-report": {
    mood: "sad",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Emotion Weather",
    description: "Build a tool that gives you a gentle forecast based on today's emotional weather.",
    steps: [
      "Create the HTML layout",
      "Add the forecast logic",
      "Write your own forecasts",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="weather-app">
          <h1>Emotion Weather</h1>
          <p>Choose today's emotional weather.</p>
          <select id="weatherSelect">
            <option value="cloudy">Cloudy</option>
            <option value="rainy">Rainy</option>
            <option value="stormy">Stormy</option>
            <option value="clearing">Clearing Up</option>
          </select>
          <button id="checkWeatherBtn">Check the Forecast</button>
          <div id="weatherDisplay"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .weather-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        select { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #weatherDisplay { margin-top: 16px; padding: 16px; border-radius: 12px; background: #eef2f6; color: #4a4740; font-weight: 500; min-height: 22px; }
      `,
      js: `
        const weatherSelect = document.getElementById("weatherSelect");
        const checkWeatherBtn = document.getElementById("checkWeatherBtn");
        const weatherDisplay = document.getElementById("weatherDisplay");

        const forecasts = {
          cloudy: "Cloudy days pass. This one will too.",
          rainy: "Let it rain a little. Rain waters things too.",
          stormy: "Storms are loud but they don't last forever.",
          clearing: "Even a small clearing counts as progress."
        };

        checkWeatherBtn.addEventListener("click", function () {
          const value = weatherSelect.value;
          weatherDisplay.textContent = forecasts[value];
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your forecast tool",
        instructions: "Customize the title and subtitle for your emotion weather tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Emotion Weather</h1>\n<p>Choose today's emotional weather.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own forecasts",
        instructions: "Change what message shows up for each type of weather.",
        tip: "Tip: Keep the four weather names the same, only change the messages.",
        starterCode: `const forecasts = {\n  cloudy: "Cloudy days pass. This one will too.",\n  rainy: "Let it rain a little. Rain waters things too.",\n  stormy: "Storms are loud but they don't last forever.",\n  clearing: "Even a small clearing counts as progress."\n};`,
        apply(code, state) {
          state.js = state.js.replace(/const forecasts = \{[\s\S]*?\};/, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you check the forecast.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="checkWeatherBtn">Check the Forecast</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="checkWeatherBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Try each weather option and read its forecast.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your emotion weather tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Gentle Steps (Beginner)
     Mechanic: sequentially unlocked checklist, not a plain progress bar
     ============================================================ */
  "locked-comfort-checklist": {
    mood: "sad",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Gentle Steps",
    description: "Build a checklist where each step only unlocks once the one before it is done.",
    steps: [
      "Create the HTML layout",
      "Add the unlocking logic",
      "Write your own steps",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="locked-app">
          <h1>Gentle Steps</h1>
          <p>Each step unlocks the next. No rushing.</p>
          <ul id="lockedList">
            <li><label><input type="checkbox" class="lock-check" /> Take one slow breath</label></li>
            <li><label><input type="checkbox" class="lock-check" disabled /> Get a glass of water</label></li>
            <li><label><input type="checkbox" class="lock-check" disabled /> Sit somewhere comfortable</label></li>
          </ul>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .locked-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        ul { margin-top: 16px; padding: 0; list-style: none; text-align: left; }
        li { margin-top: 10px; padding: 12px; background: #f8f0e4; border-radius: 12px; }
        li label:has(input:disabled) { opacity: 0.5; }
      `,
      js: `
        const checks = document.querySelectorAll(".lock-check");

        checks.forEach(function (check, index) {
          check.addEventListener("change", function () {
            if (check.checked && checks[index + 1]) {
              checks[index + 1].disabled = false;
            }
          });
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your checklist",
        instructions: "Customize the title and subtitle for your gentle steps checklist.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Gentle Steps</h1>\n<p>Each step unlocks the next. No rushing.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own steps",
        instructions: "Replace these with three small, gentle things you'd actually want to do, in order.",
        tip: "Tip: Keep the checkbox tags and 'disabled' attributes exactly as they are, only change the words after each one.",
        starterCode: `<li><label><input type="checkbox" class="lock-check" /> Take one slow breath</label></li>\n<li><label><input type="checkbox" class="lock-check" disabled /> Get a glass of water</label></li>\n<li><label><input type="checkbox" class="lock-check" disabled /> Sit somewhere comfortable</label></li>`,
        apply(code, state) {
          state.html = state.html.replace(
            /<li><label><input type="checkbox" class="lock-check" \/> Take one slow breath<\/label><\/li>\s*<li><label><input type="checkbox" class="lock-check" disabled \/> Get a glass of water<\/label><\/li>\s*<li><label><input type="checkbox" class="lock-check" disabled \/> Sit somewhere comfortable<\/label><\/li>/s,
            code
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Check the first box and watch the next one unlock.",
        tip: "Tip: You built sequential unlocking — each step depends on the one before it.",
        starterCode: `Your gentle steps checklist is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Let It Out (Beginner)
     Mechanic: click counter with staged, threshold-based messages
     ============================================================ */
  "tears-counter": {
    mood: "sad",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Let It Out",
    description: "Build a simple tool that meets you gently, however many times you need it.",
    steps: [
      "Create the HTML layout",
      "Add the staged messages logic",
      "Customize your messages",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="tears-app">
          <h1>Let It Out</h1>
          <p>Click the drop each time you need to. No judgment.</p>
          <button id="dropBtn">💧</button>
          <p id="tearsMessage"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .tears-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        #dropBtn { font-size: 32px; background: none; border: none; padding: 10px; cursor: pointer; }
        #tearsMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        let tearCount = 0;
        const dropBtn = document.getElementById("dropBtn");
        const tearsMessage = document.getElementById("tearsMessage");

        dropBtn.addEventListener("click", function () {
          tearCount++;
          if (tearCount === 1) {
            tearsMessage.textContent = "That's one. Let it happen.";
          } else if (tearCount < 5) {
            tearsMessage.textContent = tearCount + " so far. You're allowed to feel this.";
          } else {
            tearsMessage.textContent = "You've let a lot out. That takes something.";
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tool",
        instructions: "Customize the title and subtitle for your let it out tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Let It Out</h1>\n<p>Click the drop each time you need to. No judgment.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your staged messages",
        instructions: "Change what shows up at each stage of clicking.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `if (tearCount === 1) {\n  tearsMessage.textContent = "That's one. Let it happen.";\n} else if (tearCount < 5) {\n  tearsMessage.textContent = tearCount + " so far. You're allowed to feel this.";\n} else {\n  tearsMessage.textContent = "You've let a lot out. That takes something.";\n}`,
        apply(code, state) {
          state.js = state.js.replace(
            /if \(tearCount === 1\) \{\s*tearsMessage\.textContent = "That's one\. Let it happen\.";\s*\} else if \(tearCount < 5\) \{\s*tearsMessage\.textContent = tearCount \+ " so far\. You're allowed to feel this\.";\s*\} else \{\s*tearsMessage\.textContent = "You've let a lot out\. That takes something\.";\s*\}/,
            code
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change the symbol or word on the button.",
        tip: "Tip: Only change what's between the button tags.",
        starterCode: `<button id="dropBtn">💧</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="dropBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click a few times and read the messages that come up.",
        tip: "Tip: You built staged, threshold-based responses.",
        starterCode: `Your tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Warm Light (Intermediate)
     Mechanic: real-time color interpolation between two colors
     ============================================================ */
  "warm-light-dimmer": {
    mood: "sad",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Warm Light",
    description: "Build a light panel that blends from cool to warm as you slide, in real time.",
    steps: [
      "Create the HTML layout",
      "Add the color blending logic",
      "Choose your cool color",
      "Choose your warm color",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="dimmer-app">
          <h1>Warm Light</h1>
          <p>Slide toward warmth.</p>
          <div class="light-box" id="lightBox"></div>
          <input type="range" id="warmthSlider" min="0" max="100" value="0" />
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .dimmer-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .light-box { width: 100%; height: 120px; border-radius: 16px; margin-top: 16px; background: #3a3f55; }
        input[type="range"] { width: 100%; margin-top: 16px; }
      `,
      js: `
        const lightBox = document.getElementById("lightBox");
        const warmthSlider = document.getElementById("warmthSlider");
        const coldColor = [58, 63, 85];
        const warmColor = [255, 183, 94];

        function interpolate(a, b, t) {
          return Math.round(a + (b - a) * t);
        }

        function updateLight() {
          const t = Number(warmthSlider.value) / 100;
          const r = interpolate(coldColor[0], warmColor[0], t);
          const g = interpolate(coldColor[1], warmColor[1], t);
          const b = interpolate(coldColor[2], warmColor[2], t);
          lightBox.style.background = "rgb(" + r + "," + g + "," + b + ")";
        }

        warmthSlider.addEventListener("input", updateLight);
        updateLight();
      `
    },
    guidedSteps: [
      {
        title: "Name your light",
        instructions: "Customize the title and subtitle for your warm light tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Warm Light</h1>\n<p>Slide toward warmth.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Choose your cool color",
        instructions: "Pick the RGB values for the cool end of the slider (three numbers, 0-255).",
        tip: "Tip: Keep the format [red, green, blue].",
        starterCode: `const coldColor = [58, 63, 85];`,
        apply(code, state) {
          state.js = state.js.replace(/const coldColor = \[.*?\];/, code);
        }
      },
      {
        title: "Choose your warm color",
        instructions: "Pick the RGB values for the warm end of the slider.",
        tip: "Tip: Keep the format [red, green, blue].",
        starterCode: `const warmColor = [255, 183, 94];`,
        apply(code, state) {
          state.js = state.js.replace(/const warmColor = \[.*?\];/, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Drag the slider slowly and watch the colors blend.",
        tip: "Tip: You built real-time color interpolation — the math behind gradients and dimmers.",
        starterCode: `Your warm light is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — A Few Gentle Pages (Beginner)
     Mechanic: paginated navigation through fixed content
     ============================================================ */
  "story-pages": {
    mood: "sad",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "A Few Gentle Pages",
    description: "Build a small paginated set of gentle reminders you can flip through.",
    steps: [
      "Create the HTML layout",
      "Add the pagination logic",
      "Write your own pages",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="pages-app">
          <h1>A Few Gentle Pages</h1>
          <p id="pageText">You are allowed to feel this, fully, without rushing it.</p>
          <p id="pageCounter">Page 1 of 3</p>
          <div class="page-nav">
            <button id="prevPageBtn">Previous</button>
            <button id="nextPageBtn">Next</button>
          </div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .pages-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        #pageText { color: #4a4740; font-size: 16px; min-height: 60px; margin-top: 16px; }
        #pageCounter { margin-top: 8px; color: #6f6a64; font-size: 13px; }
        .page-nav { display: flex; gap: 10px; margin-top: 16px; }
        .page-nav button { flex: 1; padding: 12px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const pages = [
          "You are allowed to feel this, fully, without rushing it.",
          "This feeling has an edge to it, even if you can't see it yet.",
          "You've gotten through every hard day so far. That's data, not luck."
        ];
        let pageIndex = 0;

        const pageText = document.getElementById("pageText");
        const pageCounter = document.getElementById("pageCounter");
        const prevPageBtn = document.getElementById("prevPageBtn");
        const nextPageBtn = document.getElementById("nextPageBtn");

        function render() {
          pageText.textContent = pages[pageIndex];
          pageCounter.textContent = "Page " + (pageIndex + 1) + " of " + pages.length;
          prevPageBtn.disabled = pageIndex === 0;
          nextPageBtn.disabled = pageIndex === pages.length - 1;
        }

        prevPageBtn.addEventListener("click", function () {
          if (pageIndex > 0) {
            pageIndex--;
            render();
          }
        });

        nextPageBtn.addEventListener("click", function () {
          if (pageIndex < pages.length - 1) {
            pageIndex++;
            render();
          }
        });

        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your pages",
        instructions: "Customize the title for your gentle pages tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>A Few Gentle Pages</h1>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>/s, code);
        }
      },
      {
        title: "Write your own pages",
        instructions: "Replace these with your own gentle reminders. Keep the quotation marks and commas, and keep all three.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `"You are allowed to feel this, fully, without rushing it.",\n"This feeling has an edge to it, even if you can't see it yet.",\n"You've gotten through every hard day so far. That's data, not luck."`,
        apply(code, state) {
          state.js = state.js.replace(
            /const pages = \[[\s\S]*?\];/,
            `const pages = [\n          ${code}\n        ];`
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Click through all three pages using Previous and Next.",
        tip: "Tip: You built real pagination — the same idea behind multi-page forms and articles.",
        starterCode: `Your gentle pages are ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Self Hug Timer (Intermediate)
     Mechanic: press-and-hold accumulating into a running cumulative total
     ============================================================ */
  "cumulative-hug-timer": {
    mood: "sad",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Self Hug Timer",
    description: "Build a button you hold like a hug, adding up total time across as many holds as you need.",
    steps: [
      "Create the HTML layout",
      "Add the timing logic",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="hug-app">
          <h1>Self Hug Timer</h1>
          <p>Hold the button like a hug. Every second adds to your total.</p>
          <button id="hugBtn">Hold Me</button>
          <p id="hugTotal">Total hug time: 0s</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .hug-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        button { padding: 20px 40px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; font-size: 16px; }
        #hugTotal { margin-top: 16px; font-weight: 600; color: #4f6f91; }
      `,
      js: `
        const hugBtn = document.getElementById("hugBtn");
        const hugTotal = document.getElementById("hugTotal");
        let totalSeconds = 0;
        let holdStart = null;
        let interval;

        function startHug() {
          holdStart = Date.now();
          interval = setInterval(function () {
            const elapsed = Math.floor((Date.now() - holdStart) / 1000);
            hugTotal.textContent = "Total hug time: " + (totalSeconds + elapsed) + "s";
          }, 200);
        }

        function endHug() {
          if (holdStart === null) return;
          const elapsed = Math.floor((Date.now() - holdStart) / 1000);
          totalSeconds += elapsed;
          clearInterval(interval);
          holdStart = null;
          hugTotal.textContent = "Total hug time: " + totalSeconds + "s";
        }

        hugBtn.addEventListener("mousedown", startHug);
        hugBtn.addEventListener("mouseup", endHug);
        hugBtn.addEventListener("mouseleave", endHug);
      `
    },
    guidedSteps: [
      {
        title: "Name your timer",
        instructions: "Customize the title and subtitle for your self hug timer.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Self Hug Timer</h1>\n<p>Hold the button like a hug. Every second adds to your total.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says while you hold it.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="hugBtn">Hold Me</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="hugBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Hold the button a few times across separate holds, and watch your total add up.",
        tip: "Tip: You built a running total that persists across multiple separate holds, not just one.",
        starterCode: `Your hug timer is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Comfort Object Builder (Intermediate)
     Mechanic: combining three separate selects into one templated sentence
     ============================================================ */
  "comfort-object-builder": {
    mood: "sad",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Comfort Object Builder",
    description: "Build a tool that combines a few small choices into your own imaginary comfort object.",
    steps: [
      "Create the HTML layout",
      "Add the combining logic",
      "Customize your sentence template",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="comfortobj-app">
          <h1>Comfort Object Builder</h1>
          <p>Pick a few details and build your imaginary comfort object.</p>
          <select id="colorSelect">
            <option value="soft blue">Soft blue</option>
            <option value="warm yellow">Warm yellow</option>
            <option value="deep green">Deep green</option>
          </select>
          <select id="textureSelect">
            <option value="fuzzy">Fuzzy</option>
            <option value="smooth">Smooth</option>
            <option value="weighted">Weighted</option>
          </select>
          <select id="soundSelect">
            <option value="a quiet hum">A quiet hum</option>
            <option value="soft rain">Soft rain</option>
            <option value="gentle static">Gentle static</option>
          </select>
          <button id="buildComfortBtn">Build It</button>
          <p id="comfortResult"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .comfortobj-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        select { width: 100%; margin-top: 10px; padding: 12px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #comfortResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const colorSelect = document.getElementById("colorSelect");
        const textureSelect = document.getElementById("textureSelect");
        const soundSelect = document.getElementById("soundSelect");
        const buildComfortBtn = document.getElementById("buildComfortBtn");
        const comfortResult = document.getElementById("comfortResult");

        buildComfortBtn.addEventListener("click", function () {
          const color = colorSelect.value;
          const texture = textureSelect.value;
          const sound = soundSelect.value;
          comfortResult.textContent = "Your comfort object: a " + texture + ", " + color + " thing that makes " + sound + ".";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your builder",
        instructions: "Customize the title and subtitle for your comfort object builder.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Comfort Object Builder</h1>\n<p>Pick a few details and build your imaginary comfort object.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your sentence template",
        instructions: "Change how the three choices get combined into a sentence.",
        tip: "Tip: Keep the + signs connecting the variable names (color, texture, sound).",
        starterCode: `comfortResult.textContent = "Your comfort object: a " + texture + ", " + color + " thing that makes " + sound + ".";`,
        apply(code, state) {
          state.js = state.js.replace(/comfortResult\.textContent = .*?;/s, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you build your object.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="buildComfortBtn">Build It</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="buildComfortBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Pick a combination and see your comfort object described.",
        tip: "Tip: You built a generator that combines several inputs into one output.",
        starterCode: `Your comfort object builder is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     SAD — Wave of Grief (Advanced)
     Mechanic: triggered CSS animation with escalating, self-resetting state
     ============================================================ */
  "wave-of-grief": {
    mood: "sad",
    difficulty: "advanced",
    requiredPlan: "free",
    title: "Wave of Grief",
    description: "Build a visual wave that rises and falls each time you click, then gently resets after a few waves.",
    steps: [
      "Create the HTML layout",
      "Add the wave animation logic",
      "Adjust how long each wave lasts",
      "Set how many waves before resetting",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="wave-app">
          <h1>Wave of Grief</h1>
          <p>Click to let a wave move through, then let it pass.</p>
          <div class="wave-container"><div class="wave" id="wave"></div></div>
          <button id="waveBtn">Let a Wave Come</button>
          <p id="waveMessage"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .wave-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .wave-container { height: 100px; overflow: hidden; position: relative; margin-top: 16px; background: #eef2f6; border-radius: 16px; }
        .wave { position: absolute; bottom: -20px; left: -10%; width: 120%; height: 60px; background: #8fb0d3; border-radius: 50% 50% 0 0; transform: scaleY(0); transform-origin: bottom; transition: transform 1.2s ease; }
        .wave.rising { transform: scaleY(1); }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #waveMessage { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const wave = document.getElementById("wave");
        const waveBtn = document.getElementById("waveBtn");
        const waveMessage = document.getElementById("waveMessage");
        const waveDurationMs = 1500;
        const maxWaves = 3;
        let waveCount = 0;

        waveBtn.addEventListener("click", function () {
          waveCount++;
          wave.classList.add("rising");

          setTimeout(function () {
            wave.classList.remove("rising");
          }, waveDurationMs);

          if (waveCount >= maxWaves) {
            waveMessage.textContent = "That's a few waves now. They come, and they also go.";
            waveCount = 0;
          } else {
            waveMessage.textContent = "Wave " + waveCount + " of " + maxWaves + ".";
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your wave tool",
        instructions: "Customize the title and subtitle for your wave of grief tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Wave of Grief</h1>\n<p>Click to let a wave move through, then let it pass.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust how long each wave lasts",
        instructions: "Choose how many milliseconds each wave takes to rise and fall.",
        tip: "Tip: Only change the number.",
        starterCode: `const waveDurationMs = 1500;`,
        apply(code, state) {
          const match = code.match(/const waveDurationMs = (\d+);/);
          const ms = match ? match[1] : "1500";
          state.js = state.js.replace(/const waveDurationMs = \d+;/, `const waveDurationMs = ${ms};`);
        }
      },
      {
        title: "Set how many waves before resetting",
        instructions: "Choose how many waves happen before the counter resets and gives an encouraging message.",
        tip: "Tip: Only change the number.",
        starterCode: `const maxWaves = 3;`,
        apply(code, state) {
          const match = code.match(/const maxWaves = (\d+);/);
          const count = match ? match[1] : "3";
          state.js = state.js.replace(/const maxWaves = \d+;/, `const maxWaves = ${count};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click through a few waves and watch them rise, fall, and reset.",
        tip: "Tip: You built a triggered animation with its own internal state — the wave count.",
        starterCode: `Your wave tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  "punch-counter": {
    mood: "angry",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Punch Counter",
    description: "Build a counter where each punch needs a little more patience than the last before it counts.",
    steps: [
      "Create the HTML layout",
      "Add the cooldown logic",
      "Set your base cooldown",
      "Adjust how fast the cooldown grows",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="punch-app">
          <h1>Punch Counter</h1>
          <p>Punch the bag. Each hit needs a little more patience before the next counts.</p>
          <button id="punchBtn">Punch!</button>
          <p id="punchCount">Punches: 0</p>
          <p id="punchStatus"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .punch-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        button { width: 100%; padding: 16px; border: none; border-radius: 999px; background: #c0563c; color: white; font-size: 16px; cursor: pointer; }
        #punchCount { margin-top: 14px; font-weight: 600; color: #4a4740; }
        #punchStatus { margin-top: 8px; font-size: 13px; color: #b3452f; min-height: 18px; }
      `,
      js: `
        const punchBtn = document.getElementById("punchBtn");
        const punchCount = document.getElementById("punchCount");
        const punchStatus = document.getElementById("punchStatus");
        let punches = 0;
        let lastPunchTime = 0;
        const baseCooldownMs = 500;
        const cooldownGrowthPerPunch = 100;

        punchBtn.addEventListener("click", function () {
          const now = Date.now();
          const requiredCooldown = baseCooldownMs + punches * cooldownGrowthPerPunch;

          if (now - lastPunchTime < requiredCooldown) {
            punchStatus.textContent = "Too fast — wait a beat.";
            return;
          }

          punches++;
          lastPunchTime = now;
          punchCount.textContent = "Punches: " + punches;
          punchStatus.textContent = "";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your punch counter",
        instructions: "Customize the title and subtitle for your punch counter.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Punch Counter</h1>\n<p>Punch the bag. Each hit needs a little more patience before the next counts.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set your base cooldown",
        instructions: "Choose how many milliseconds must pass before your very first punch counts again.",
        tip: "Tip: Only change the number.",
        starterCode: `const baseCooldownMs = 500;`,
        apply(code, state) {
          const match = code.match(/const baseCooldownMs = (\d+);/);
          const ms = match ? match[1] : "500";
          state.js = state.js.replace(/const baseCooldownMs = \d+;/, `const baseCooldownMs = ${ms};`);
        }
      },
      {
        title: "Adjust how fast the cooldown grows",
        instructions: "Choose how many extra milliseconds get added to the cooldown after every punch.",
        tip: "Tip: Only change the number. A bigger number makes it harder faster.",
        starterCode: `const cooldownGrowthPerPunch = 100;`,
        apply(code, state) {
          const match = code.match(/const cooldownGrowthPerPunch = (\d+);/);
          const amount = match ? match[1] : "100";
          state.js = state.js.replace(/const cooldownGrowthPerPunch = \d+;/, `const cooldownGrowthPerPunch = ${amount};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Try punching quickly and notice how the required gap grows each time.",
        tip: "Tip: You built real click-rate throttling — timestamps comparing each action to the last.",
        starterCode: `Your punch counter is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Shred It (Intermediate)
     Mechanic: text torn into pieces and scattered with animation
     ============================================================ */
  "shred-it": {
    mood: "angry",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Shred It",
    description: "Build a tool that lets you type something out, then watch it get torn apart.",
    steps: [
      "Create the HTML layout",
      "Add the shredding logic",
      "Customize the input prompt",
      "Adjust the scatter distance",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="shred-app">
          <h1>Shred It</h1>
          <p>Type it out, then tear it apart.</p>
          <input id="shredInput" type="text" placeholder="Type what's bothering you..." />
          <button id="shredBtn">Shred It</button>
          <div id="shredArea"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .shred-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c0563c; color: white; cursor: pointer; }
        #shredArea { position: relative; height: 100px; margin-top: 16px; }
        .shred-piece { position: absolute; font-size: 14px; color: #c0563c; transition: transform 1s ease, opacity 1s ease; }
      `,
      js: `
        const shredInput = document.getElementById("shredInput");
        const shredBtn = document.getElementById("shredBtn");
        const shredArea = document.getElementById("shredArea");
        const scatterDistance = 60;

        shredBtn.addEventListener("click", function () {
          const text = shredInput.value;
          if (text.trim() === "") return;

          shredArea.innerHTML = "";
          const letters = text.split("");

          letters.forEach(function (letter, index) {
            const span = document.createElement("span");
            span.className = "shred-piece";
            span.textContent = letter;
            span.style.left = (index * 12) + "px";
            span.style.top = "10px";
            shredArea.appendChild(span);

            setTimeout(function () {
              const dx = Math.random() * (scatterDistance * 2) - scatterDistance;
              const dy = scatterDistance + Math.random() * 40;
              const rotate = Math.random() * 180 - 90;
              span.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + rotate + "deg)";
              span.style.opacity = "0";
            }, 20);
          });

          shredInput.value = "";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tool",
        instructions: "Customize the title and subtitle for your shred tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Shred It</h1>\n<p>Type it out, then tear it apart.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize the input prompt",
        instructions: "Change what the input says before you type.",
        tip: "Tip: Change only the words inside placeholder.",
        starterCode: `<input id="shredInput" type="text" placeholder="Type what's bothering you..." />`,
        apply(code, state) {
          state.html = state.html.replace(/<input id="shredInput".*?>/s, code);
        }
      },
      {
        title: "Adjust the scatter distance",
        instructions: "Choose how far the shredded letters fly.",
        tip: "Tip: Only change the number. Bigger scatters further.",
        starterCode: `const scatterDistance = 60;`,
        apply(code, state) {
          const match = code.match(/const scatterDistance = (\d+);/);
          const distance = match ? match[1] : "60";
          state.js = state.js.replace(/const scatterDistance = \d+;/, `const scatterDistance = ${distance};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Type something and watch it get shredded.",
        tip: "Tip: You built a real scatter animation — each piece getting its own random destination.",
        starterCode: `Your shred tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Volume Knob (Advanced)
     Mechanic: rotary drag input using pointer-angle math
     ============================================================ */
  "volume-knob": {
    mood: "angry",
    difficulty: "advanced",
    requiredPlan: "free",
    title: "Volume Knob",
    description: "Build a rotary knob you drag around in a circle to crank up how loud you'd yell, silently.",
    steps: [
      "Create the HTML layout",
      "Add the rotation logic",
      "Understand the angle-to-value math",
      "Customize your label",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="knob-app">
          <h1>Volume Knob</h1>
          <p>Drag around the knob to crank up how loud you'd yell, silently.</p>
          <div class="knob-wrap" id="knobWrap">
            <div class="knob-dial" id="knobDial"></div>
          </div>
          <p id="knobValue">Level: 0</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .knob-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .knob-wrap { width: 120px; height: 120px; margin: 20px auto; border-radius: 50%; background: #eee2cf; position: relative; cursor: pointer; }
        .knob-dial { position: absolute; top: 8px; left: 50%; width: 4px; height: 40px; background: #c0563c; transform-origin: bottom center; transform: translateX(-50%) rotate(0deg); }
        #knobValue { margin-top: 14px; font-weight: 600; color: #4a4740; }
      `,
      js: `
        const knobWrap = document.getElementById("knobWrap");
        const knobDial = document.getElementById("knobDial");
        const knobValueEl = document.getElementById("knobValue");
        let dragging = false;
        const minAngle = -150;
        const maxAngle = 150;

        function angleToValue(angleDeg) {
          const clamped = Math.max(minAngle, Math.min(maxAngle, angleDeg));
          return Math.round(((clamped - minAngle) / (maxAngle - minAngle)) * 100);
        }

        function updateFromEvent(e) {
          const rect = knobWrap.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;
          const angleDeg = Math.atan2(dx, -dy) * (180 / Math.PI);
          const value = angleToValue(angleDeg);
          const rotateDeg = (value / 100) * (maxAngle - minAngle) + minAngle;
          knobDial.style.transform = "translateX(-50%) rotate(" + rotateDeg + "deg)";
          knobValueEl.textContent = "Level: " + value;
        }

        knobWrap.addEventListener("mousedown", function (e) {
          dragging = true;
          updateFromEvent(e);
        });
        document.addEventListener("mousemove", function (e) {
          if (dragging) updateFromEvent(e);
        });
        document.addEventListener("mouseup", function () {
          dragging = false;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your knob",
        instructions: "Customize the title and subtitle for your volume knob.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Volume Knob</h1>\n<p>Drag around the knob to crank up how loud you'd yell, silently.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Understand the angle-to-value math",
        instructions: "The knob measures the angle between your mouse and the center of the dial, then maps that angle onto a 0-100 range. Try narrowing or widening the range of motion.",
        tip: "Tip: A smaller range between minAngle and maxAngle means less rotation is needed to reach 100.",
        starterCode: `const minAngle = -150;\nconst maxAngle = 150;`,
        apply(code, state) {
          state.js = state.js.replace(
            /const minAngle = -?\d+;\s*const maxAngle = -?\d+;/,
            code
          );
        }
      },
      {
        title: "Customize your label",
        instructions: "Change what the readout says.",
        tip: "Tip: Keep the + sign connecting to the value.",
        starterCode: `knobValueEl.textContent = "Level: " + value;`,
        apply(code, state) {
          state.js = state.js.replace(/knobValueEl\.textContent = .*?;/, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Drag the knob in a full circle and watch the level respond.",
        tip: "Tip: You built real rotary input — using trigonometry to turn a mouse position into an angle.",
        starterCode: `Your volume knob is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Rage Journal (Intermediate)
     Mechanic: entries that self-delete automatically after a timeout
     ============================================================ */
  "rage-journal": {
    mood: "angry",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Rage Journal",
    description: "Build a journal where each entry disappears on its own after a little while.",
    steps: [
      "Create the HTML layout",
      "Add the self-deleting logic",
      "Set how long entries last",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="ragejournal-app">
          <h1>Rage Journal</h1>
          <p>Write it down. It'll disappear on its own soon.</p>
          <input id="rageInput" type="text" placeholder="Type it out..." />
          <button id="addRageBtn">Write It</button>
          <div id="rageEntries"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .ragejournal-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c0563c; color: white; cursor: pointer; }
        #rageEntries { margin-top: 16px; text-align: left; }
        .rage-entry { padding: 10px 12px; margin-top: 8px; background: #f0e2d6; border-radius: 10px; font-size: 14px; color: #4a4740; }
      `,
      js: `
        const rageInput = document.getElementById("rageInput");
        const addRageBtn = document.getElementById("addRageBtn");
        const rageEntries = document.getElementById("rageEntries");
        const entryLifespanSeconds = 8;

        addRageBtn.addEventListener("click", function () {
          const value = rageInput.value;
          if (value.trim() === "") return;

          const entry = document.createElement("div");
          entry.className = "rage-entry";
          entry.textContent = value;
          rageEntries.appendChild(entry);
          rageInput.value = "";

          setTimeout(function () {
            entry.style.opacity = "0";
            setTimeout(function () { entry.remove(); }, 600);
          }, entryLifespanSeconds * 1000);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your journal",
        instructions: "Customize the title and subtitle for your rage journal.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Rage Journal</h1>\n<p>Write it down. It'll disappear on its own soon.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how long entries last",
        instructions: "Choose how many seconds an entry stays before disappearing.",
        tip: "Tip: Only change the number.",
        starterCode: `const entryLifespanSeconds = 8;`,
        apply(code, state) {
          const match = code.match(/const entryLifespanSeconds = (\d+);/);
          const seconds = match ? match[1] : "8";
          state.js = state.js.replace(/const entryLifespanSeconds = \d+;/, `const entryLifespanSeconds = ${seconds};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you write an entry.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="addRageBtn">Write It</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="addRageBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Write something and watch it fade away on its own.",
        tip: "Tip: You built content that disappears automatically — no delete button needed.",
        starterCode: `Your rage journal is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Durability Wall (Intermediate)
     Mechanic: tiles that require multiple tracked hits to break
     ============================================================ */
  "durability-wall": {
    mood: "angry",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Durability Wall",
    description: "Build a wall of tiles that each take more than one hit to break, and track it per tile.",
    steps: [
      "Create the HTML layout",
      "Add the multi-hit logic",
      "Set how many tiles",
      "Set how many hits each tile takes",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="wall-app">
          <h1>Durability Wall</h1>
          <p>Some tiles take more than one hit. Keep going.</p>
          <div class="wall-grid" id="wallGrid"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .wall-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .wall-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 16px; }
        .wall-tile { aspect-ratio: 1; background: #c0563c; border-radius: 8px; cursor: pointer; display: grid; place-items: center; color: white; font-weight: 600; transition: background 0.2s ease; }
        .wall-tile.broken { background: #eee2cf; color: #c8bda9; cursor: default; }
      `,
      js: `
        const wallGrid = document.getElementById("wallGrid");
        const tileCount = 8;
        const hitsRequired = 3;

        for (let i = 0; i < tileCount; i++) {
          const tile = document.createElement("div");
          tile.className = "wall-tile";
          let hits = 0;
          tile.textContent = hitsRequired;

          tile.addEventListener("click", function () {
            if (tile.classList.contains("broken")) return;
            hits++;
            const remaining = hitsRequired - hits;
            if (remaining <= 0) {
              tile.classList.add("broken");
              tile.textContent = "";
            } else {
              tile.textContent = remaining;
            }
          });

          wallGrid.appendChild(tile);
        }
      `
    },
    guidedSteps: [
      {
        title: "Name your wall",
        instructions: "Customize the title and subtitle for your durability wall.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Durability Wall</h1>\n<p>Some tiles take more than one hit. Keep going.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how many tiles",
        instructions: "Choose how many tiles are on the wall.",
        tip: "Tip: Only change the number.",
        starterCode: `const tileCount = 8;`,
        apply(code, state) {
          const match = code.match(/const tileCount = (\d+);/);
          const count = match ? match[1] : "8";
          state.js = state.js.replace(/const tileCount = \d+;/, `const tileCount = ${count};`);
        }
      },
      {
        title: "Set how many hits each tile takes",
        instructions: "Choose how many clicks it takes to break one tile.",
        tip: "Tip: Only change the number.",
        starterCode: `const hitsRequired = 3;`,
        apply(code, state) {
          const match = code.match(/const hitsRequired = (\d+);/);
          const count = match ? match[1] : "3";
          state.js = state.js.replace(/const hitsRequired = \d+;/, `const hitsRequired = ${count};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click a tile repeatedly and watch its hit counter go down.",
        tip: "Tip: You built per-tile state tracking — each tile remembers its own hit count.",
        starterCode: `Your durability wall is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Let It Rise, Let It Fall (Beginner)
     Mechanic: a slider that automatically animates back to zero on release
     ============================================================ */
  "snapback-slider": {
    mood: "angry",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Let It Rise, Let It Fall",
    description: "Build a slider that settles back down to zero on its own once you let go.",
    steps: [
      "Create the HTML layout",
      "Add the live value logic",
      "Adjust the snap-back speed",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="snapback-app">
          <h1>Let It Rise, Let It Fall</h1>
          <p>Drag up. Let go, and watch it settle back down on its own.</p>
          <input type="range" id="snapSlider" min="0" max="100" value="0" />
          <p id="snapValue">0</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .snapback-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input[type="range"] { width: 100%; margin-top: 16px; }
        #snapValue { margin-top: 12px; font-size: 24px; font-weight: 600; color: #4a4740; }
      `,
      js: `
        const snapSlider = document.getElementById("snapSlider");
        const snapValue = document.getElementById("snapValue");
        const snapBackStep = 2;

        snapSlider.addEventListener("input", function () {
          snapValue.textContent = snapSlider.value;
        });

        function snapBack() {
          let current = Number(snapSlider.value);
          const interval = setInterval(function () {
            current = Math.max(0, current - snapBackStep);
            snapSlider.value = current;
            snapValue.textContent = current;
            if (current <= 0) clearInterval(interval);
          }, 30);
        }

        snapSlider.addEventListener("mouseup", snapBack);
        snapSlider.addEventListener("touchend", snapBack);
      `
    },
    guidedSteps: [
      {
        title: "Name your slider",
        instructions: "Customize the title and subtitle for your snap-back slider.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Let It Rise, Let It Fall</h1>\n<p>Drag up. Let go, and watch it settle back down on its own.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust the snap-back speed",
        instructions: "Choose how much the value drops on each tick as it settles back to zero.",
        tip: "Tip: A bigger number snaps back faster.",
        starterCode: `const snapBackStep = 2;`,
        apply(code, state) {
          const match = code.match(/const snapBackStep = (\d+);/);
          const step = match ? match[1] : "2";
          state.js = state.js.replace(/const snapBackStep = \d+;/, `const snapBackStep = ${step};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Drag the slider up, let go, and watch it fall back on its own.",
        tip: "Tip: You built an automatic settle-back animation using a repeating interval.",
        starterCode: `Your slider is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Silent Scream (Beginner)
     Mechanic: continuous hold-duration-driven visual growth
     ============================================================ */
  "scream-meter": {
    mood: "angry",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Silent Scream",
    description: "Build a button that grows the longer you hold it down.",
    steps: [
      "Create the HTML layout",
      "Add the growth logic",
      "Adjust how big it can get",
      "Customize your button text",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="scream-app">
          <h1>Silent Scream</h1>
          <p>Hold the button. The longer you hold, the bigger it gets.</p>
          <button id="screamBtn">AAAH</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .scream-app { text-align: center; padding: 40px; }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        #screamBtn { font-size: 20px; padding: 20px 40px; border: none; border-radius: 999px; background: #c0563c; color: white; cursor: pointer; }
      `,
      js: `
        const screamBtn = document.getElementById("screamBtn");
        const maxFontSize = 60;
        let holdStart = null;
        let raf;

        function grow() {
          if (holdStart === null) return;
          const elapsed = Date.now() - holdStart;
          const size = Math.min(maxFontSize, 20 + elapsed / 50);
          screamBtn.style.fontSize = size + "px";
          raf = requestAnimationFrame(grow);
        }

        screamBtn.addEventListener("mousedown", function () {
          holdStart = Date.now();
          grow();
        });

        function reset() {
          holdStart = null;
          cancelAnimationFrame(raf);
          screamBtn.style.fontSize = "20px";
        }

        screamBtn.addEventListener("mouseup", reset);
        screamBtn.addEventListener("mouseleave", reset);
      `
    },
    guidedSteps: [
      {
        title: "Name your scream tool",
        instructions: "Customize the title and subtitle for your scream meter.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Silent Scream</h1>\n<p>Hold the button. The longer you hold, the bigger it gets.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust how big it can get",
        instructions: "Choose the maximum font size the button can grow to.",
        tip: "Tip: Only change the number.",
        starterCode: `const maxFontSize = 60;`,
        apply(code, state) {
          const match = code.match(/const maxFontSize = (\d+);/);
          const size = match ? match[1] : "60";
          state.js = state.js.replace(/const maxFontSize = \d+;/, `const maxFontSize = ${size};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="screamBtn">AAAH</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="screamBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Hold the button down for a few seconds and watch it grow.",
        tip: "Tip: You built a continuous, real-time animation tied directly to how long you hold.",
        starterCode: `Your scream meter is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Combo Release (Intermediate)
     Mechanic: rapid-click combo streak that decays if you pause too long
     ============================================================ */
  "combo-clicker": {
    mood: "angry",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Combo Release",
    description: "Build a combo counter that keeps climbing as long as you keep clicking quickly.",
    steps: [
      "Create the HTML layout",
      "Add the combo logic",
      "Set how long you have between clicks",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="combo-app">
          <h1>Combo Release</h1>
          <p>Keep clicking quickly to build your combo. Pause too long and it resets.</p>
          <button id="comboBtn">Hit</button>
          <p id="comboCount">Combo: 0</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .combo-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        button { width: 100%; padding: 16px; border: none; border-radius: 999px; background: #c0563c; color: white; font-size: 16px; cursor: pointer; }
        #comboCount { margin-top: 14px; font-size: 24px; font-weight: 700; color: #4a4740; }
      `,
      js: `
        const comboBtn = document.getElementById("comboBtn");
        const comboCount = document.getElementById("comboCount");
        let combo = 0;
        let lastClickTime = 0;
        const comboWindowMs = 800;

        comboBtn.addEventListener("click", function () {
          const now = Date.now();
          if (now - lastClickTime > comboWindowMs) {
            combo = 1;
          } else {
            combo++;
          }
          lastClickTime = now;
          comboCount.textContent = "Combo: " + combo;
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your combo tool",
        instructions: "Customize the title and subtitle for your combo release.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Combo Release</h1>\n<p>Keep clicking quickly to build your combo. Pause too long and it resets.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how long you have between clicks",
        instructions: "Choose how many milliseconds you have before the combo resets.",
        tip: "Tip: Only change the number. A bigger number gives you more breathing room.",
        starterCode: `const comboWindowMs = 800;`,
        apply(code, state) {
          const match = code.match(/const comboWindowMs = (\d+);/);
          const ms = match ? match[1] : "800";
          state.js = state.js.replace(/const comboWindowMs = \d+;/, `const comboWindowMs = ${ms};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="comboBtn">Hit</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="comboBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click rapidly to build a combo, then pause and watch it reset.",
        tip: "Tip: You built a real streak system — the same idea behind combo counters in games.",
        starterCode: `Your combo tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Where To Channel It (Beginner)
     Mechanic: click triggers rotation to a randomly chosen labeled option
     ============================================================ */
  "anger-weather-vane": {
    mood: "angry",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Where To Channel It",
    description: "Build a spinning vane that points you toward a place to put your energy.",
    steps: [
      "Create the HTML layout",
      "Add the spin logic",
      "Write your own directions",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="vane-app">
          <h1>Where To Channel It</h1>
          <p>Click to spin the vane toward a direction for your energy.</p>
          <div class="vane-wrap"><div class="vane-arrow" id="vaneArrow">↑</div></div>
          <button id="spinVaneBtn">Spin</button>
          <p id="vaneResult"></p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .vane-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .vane-wrap { width: 100px; height: 100px; margin: 20px auto; border-radius: 50%; background: #eee2cf; display: grid; place-items: center; }
        .vane-arrow { font-size: 36px; color: #c0563c; transition: transform 1.5s ease; }
        button { width: 100%; padding: 14px; border: none; border-radius: 999px; background: #c0563c; color: white; cursor: pointer; }
        #vaneResult { margin-top: 14px; font-weight: 500; color: #4f6f91; min-height: 22px; }
      `,
      js: `
        const directions = ["Exercise", "Write it out", "Talk to someone", "Take a walk", "Blast some music"];
        const vaneArrow = document.getElementById("vaneArrow");
        const spinVaneBtn = document.getElementById("spinVaneBtn");
        const vaneResult = document.getElementById("vaneResult");
        let rotation = 0;

        spinVaneBtn.addEventListener("click", function () {
          const index = Math.floor(Math.random() * directions.length);
          const anglePerOption = 360 / directions.length;
          rotation += 720 + index * anglePerOption;
          vaneArrow.style.transform = "rotate(" + rotation + "deg)";

          setTimeout(function () {
            vaneResult.textContent = "Try: " + directions[index];
          }, 1500);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your vane",
        instructions: "Customize the title and subtitle for your weather vane.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Where To Channel It</h1>\n<p>Click to spin the vane toward a direction for your energy.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own directions",
        instructions: "Replace these with places you'd actually want to put your energy. Keep the quotation marks and commas.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `"Exercise", "Write it out", "Talk to someone", "Take a walk", "Blast some music"`,
        apply(code, state) {
          state.js = state.js.replace(/const directions = \[.*?\];/s, `const directions = [${code}];`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you spin the vane.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="spinVaneBtn">Spin</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="spinVaneBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Spin the vane a few times and see where it points.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your vane is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     ANGRY — Cool Down Grid (Beginner)
     Mechanic: single click affects a radius of neighboring tiles
     ============================================================ */
  "cooldown-grid": {
    mood: "angry",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Cool Down Grid",
    description: "Build a grid of hot tiles that cool down in a radius around wherever you click.",
    steps: [
      "Create the HTML layout",
      "Add the radius-cooling logic",
      "Set your grid size",
      "Adjust how much each click cools",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="cooldown-app">
          <h1>Cool Down Grid</h1>
          <p>Click anywhere to cool that spot and the tiles around it.</p>
          <div class="cool-grid" id="coolGrid"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .cooldown-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .cool-grid { background: #2b2b2b; padding: 8px; border-radius: 12px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin-top: 16px; }
        .cool-tile { aspect-ratio: 1; background: #c0563c; border-radius: 4px; cursor: pointer; transition: opacity 0.4s ease; }
      `,
      js: `
        const coolGrid = document.getElementById("coolGrid");
        const gridSize = 5;
        const coolAmount = 25;
        const cells = [];

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const tile = document.createElement("div");
            tile.className = "cool-tile";
            tile.dataset.heat = "100";
            tile.dataset.row = row;
            tile.dataset.col = col;
            coolGrid.appendChild(tile);
            cells.push(tile);
          }
        }

        function coolTile(tile, amount) {
          let heat = Number(tile.dataset.heat) - amount;
          heat = Math.max(0, heat);
          tile.dataset.heat = heat;
          tile.style.opacity = heat / 100;
        }

        cells.forEach(function (tile) {
          tile.addEventListener("click", function () {
            const row = Number(tile.dataset.row);
            const col = Number(tile.dataset.col);

            cells.forEach(function (other) {
              const otherRow = Number(other.dataset.row);
              const otherCol = Number(other.dataset.col);
              const distance = Math.abs(otherRow - row) + Math.abs(otherCol - col);

              if (distance <= 1) {
                coolTile(other, distance === 0 ? coolAmount * 2 : coolAmount);
              }
            });
          });
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your grid",
        instructions: "Customize the title and subtitle for your cool down grid.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Cool Down Grid</h1>\n<p>Click anywhere to cool that spot and the tiles around it.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set your grid size",
        instructions: "Choose how many tiles wide and tall the grid is.",
        tip: "Tip: Only change the number.",
        starterCode: `const gridSize = 5;`,
        apply(code, state) {
          const match = code.match(/const gridSize = (\d+);/);
          const size = match ? match[1] : "5";
          state.js = state.js.replace(/const gridSize = \d+;/, `const gridSize = ${size};`);
        }
      },
      {
        title: "Adjust how much each click cools",
        instructions: "Choose how much heat drops with each click.",
        tip: "Tip: Only change the number. A bigger number cools faster.",
        starterCode: `const coolAmount = 25;`,
        apply(code, state) {
          const match = code.match(/const coolAmount = (\d+);/);
          const amount = match ? match[1] : "25";
          state.js = state.js.replace(/const coolAmount = \d+;/, `const coolAmount = ${amount};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click around the grid and watch the cooling spread to nearby tiles.",
        tip: "Tip: You built a radius-based effect — one click reaching beyond just itself.",
        starterCode: `Your cool down grid is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  "branching-dialogue-companion": {
    mood: "lonely",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "A Quiet Chat",
    description: "Build a small branching conversation with a companion who's just checking in.",
    steps: [
      "Create the HTML layout",
      "Add the branching logic",
      "Write your own opening line",
      "Write your own follow-up",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="dialogue-app">
          <h1>A Quiet Chat</h1>
          <p id="dialogueText">Hey. I noticed you're here. How's today treating you?</p>
          <div class="dialogue-choices" id="dialogueChoices"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .dialogue-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        #dialogueText { color: #6f6a64; min-height: 48px; margin-top: 12px; }
        .dialogue-choices { display: flex; gap: 10px; margin-top: 16px; }
        .dialogue-choices button { flex: 1; padding: 12px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const nodes = {
          start: {
            text: "Hey. I noticed you're here. How's today treating you?",
            choices: [
              { label: "Rough, honestly", next: "rough" },
              { label: "Pretty okay", next: "okay" }
            ]
          },
          rough: {
            text: "That's real. You don't have to perform being fine for me.",
            choices: [
              { label: "Thanks for saying that", next: "end" }
            ]
          },
          okay: {
            text: "Good. Even small okay days count for something.",
            choices: [
              { label: "Yeah, they do", next: "end" }
            ]
          },
          end: {
            text: "I'm glad you stopped by, even just for this.",
            choices: []
          }
        };

        let currentNode = "start";
        const dialogueText = document.getElementById("dialogueText");
        const dialogueChoices = document.getElementById("dialogueChoices");

        function render() {
          const node = nodes[currentNode];
          dialogueText.textContent = node.text;
          dialogueChoices.innerHTML = "";

          node.choices.forEach(function (choice) {
            const btn = document.createElement("button");
            btn.textContent = choice.label;
            btn.addEventListener("click", function () {
              currentNode = choice.next;
              render();
            });
            dialogueChoices.appendChild(btn);
          });
        }

        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your chat",
        instructions: "Customize the title for your quiet chat tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>A Quiet Chat</h1>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>/s, code);
        }
      },
      {
        title: "Write your own opening line",
        instructions: "Change what the companion says first.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `text: "Hey. I noticed you're here. How's today treating you?",`,
        apply(code, state) {
          state.js = state.js.replace(
            /text: "Hey\. I noticed you're here\. How's today treating you\?",/,
            code
          );
        }
      },
      {
        title: "Write your own follow-up",
        instructions: "Change what the companion says if you answer 'Rough, honestly.'",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `text: "That's real. You don't have to perform being fine for me.",`,
        apply(code, state) {
          state.js = state.js.replace(
            /text: "That's real\. You don't have to perform being fine for me\.",/,
            code
          );
        }
      },
      {
        title: "Finish your build",
        instructions: "Try both branches of the conversation.",
        tip: "Tip: You built a real dialogue tree — the same idea behind branching chat scripts.",
        starterCode: `Your quiet chat is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Shared Silence (Beginner)
     Mechanic: count-up timer with synchronized pulsing presence
     ============================================================ */
  "shared-silence-timer": {
    mood: "lonely",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Shared Silence",
    description: "Build a timer with two pulsing dots — yours, and a steady companion beside it.",
    steps: [
      "Create the HTML layout",
      "Add the timer logic",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="silence-app">
          <h1>Shared Silence</h1>
          <p>Sit for a while. You're not the only pulse in the room.</p>
          <div class="pulse-row">
            <div class="pulse-dot you"></div>
            <div class="pulse-dot companion"></div>
          </div>
          <button id="startSilenceBtn">Start</button>
          <p id="silenceTime">00:00</p>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .silence-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .pulse-row { display: flex; gap: 20px; justify-content: center; margin-top: 20px; }
        .pulse-dot { width: 30px; height: 30px; border-radius: 50%; background: #8fb0d3; }
        .pulse-dot.pulsing { animation: pulseAnim 2s ease-in-out infinite; }
        @keyframes pulseAnim { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #silenceTime { margin-top: 14px; font-size: 22px; font-weight: 600; color: #4a4740; }
      `,
      js: `
        const dots = document.querySelectorAll(".pulse-dot");
        const startBtn = document.getElementById("startSilenceBtn");
        const silenceTime = document.getElementById("silenceTime");
        let seconds = 0;
        let interval;

        startBtn.addEventListener("click", function () {
          if (interval) {
            clearInterval(interval);
            interval = null;
            dots.forEach(function (d) { d.classList.remove("pulsing"); });
            startBtn.textContent = "Start";
            return;
          }

          dots.forEach(function (d) { d.classList.add("pulsing"); });
          startBtn.textContent = "Stop";

          interval = setInterval(function () {
            seconds++;
            const m = String(Math.floor(seconds / 60)).padStart(2, "0");
            const s = String(seconds % 60).padStart(2, "0");
            silenceTime.textContent = m + ":" + s;
          }, 1000);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your timer",
        instructions: "Customize the title and subtitle for your shared silence timer.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Shared Silence</h1>\n<p>Sit for a while. You're not the only pulse in the room.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you start.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="startSilenceBtn">Start</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="startSilenceBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Start the timer and let it run for a little while.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your shared silence timer is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Window Lights (Intermediate)
     Mechanic: click-toggle grid plus autonomous background events
     ============================================================ */
  "window-lights": {
    mood: "lonely",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Window Lights",
    description: "Build a row of windows you can light up, where sometimes another one lights up on its own.",
    steps: [
      "Create the HTML layout",
      "Add the toggle and auto-light logic",
      "Set how many windows",
      "Set how often one lights on its own",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="windows-app">
          <h1>Window Lights</h1>
          <p>Click a window to light it. Sometimes another one lights up on its own.</p>
          <div class="window-grid" id="windowGrid"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .windows-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .window-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-top: 16px; padding: 16px; background: #2b2b2b; border-radius: 12px; }
        .window { aspect-ratio: 1; background: #3a3f55; border-radius: 4px; cursor: pointer; transition: background 0.4s ease; }
        .window.lit { background: #f5e9c8; }
      `,
      js: `
        const windowGrid = document.getElementById("windowGrid");
        const windowCount = 15;
        const autoLightIntervalMs = 3000;
        const windows = [];

        for (let i = 0; i < windowCount; i++) {
          const win = document.createElement("div");
          win.className = "window";
          win.addEventListener("click", function () {
            win.classList.toggle("lit");
          });
          windowGrid.appendChild(win);
          windows.push(win);
        }

        setInterval(function () {
          const randomWindow = windows[Math.floor(Math.random() * windows.length)];
          randomWindow.classList.add("lit");
        }, autoLightIntervalMs);
      `
    },
    guidedSteps: [
      {
        title: "Name your windows",
        instructions: "Customize the title and subtitle for your window lights.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Window Lights</h1>\n<p>Click a window to light it. Sometimes another one lights up on its own.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how many windows",
        instructions: "Choose how many windows are in the grid.",
        tip: "Tip: Only change the number.",
        starterCode: `const windowCount = 15;`,
        apply(code, state) {
          const match = code.match(/const windowCount = (\d+);/);
          const count = match ? match[1] : "15";
          state.js = state.js.replace(/const windowCount = \d+;/, `const windowCount = ${count};`);
        }
      },
      {
        title: "Set how often one lights on its own",
        instructions: "Choose how many milliseconds pass between random windows lighting up automatically.",
        tip: "Tip: Only change the number.",
        starterCode: `const autoLightIntervalMs = 3000;`,
        apply(code, state) {
          const match = code.match(/const autoLightIntervalMs = (\d+);/);
          const ms = match ? match[1] : "3000";
          state.js = state.js.replace(/const autoLightIntervalMs = \d+;/, `const autoLightIntervalMs = ${ms};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click a few windows, then wait and watch one light up on its own.",
        tip: "Tip: You built something that acts on its own in the background, not just in response to clicks.",
        starterCode: `Your window lights are ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Walking Together (Beginner)
     Mechanic: each action auto-pairs a second, delayed companion action
     ============================================================ */
  "companion-footsteps": {
    mood: "lonely",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Walking Together",
    description: "Build a path where every step you take gets a companion step right after it.",
    steps: [
      "Create the HTML layout",
      "Add the paired-step logic",
      "Adjust the companion delay",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="footsteps-app">
          <h1>Walking Together</h1>
          <p>Take a step. A companion step appears right after yours.</p>
          <div class="footsteps-path" id="footstepsPath"></div>
          <button id="stepBtn">Take a Step</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .footsteps-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .footsteps-path { display: flex; gap: 6px; flex-wrap: wrap; min-height: 30px; margin-top: 16px; }
        .footprint { font-size: 18px; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const footstepsPath = document.getElementById("footstepsPath");
        const stepBtn = document.getElementById("stepBtn");
        const companionDelayMs = 400;

        stepBtn.addEventListener("click", function () {
          const yourStep = document.createElement("span");
          yourStep.className = "footprint";
          yourStep.textContent = "👣";
          footstepsPath.appendChild(yourStep);

          setTimeout(function () {
            const companionStep = document.createElement("span");
            companionStep.className = "footprint";
            companionStep.textContent = "🐾";
            footstepsPath.appendChild(companionStep);
          }, companionDelayMs);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your path",
        instructions: "Customize the title and subtitle for your walking together tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Walking Together</h1>\n<p>Take a step. A companion step appears right after yours.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust the companion delay",
        instructions: "Choose how many milliseconds after your step the companion step appears.",
        tip: "Tip: Only change the number.",
        starterCode: `const companionDelayMs = 400;`,
        apply(code, state) {
          const match = code.match(/const companionDelayMs = (\d+);/);
          const ms = match ? match[1] : "400";
          state.js = state.js.replace(/const companionDelayMs = \d+;/, `const companionDelayMs = ${ms};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you take a step.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="stepBtn">Take a Step</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="stepBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Take a few steps and watch the companion steps follow.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your path is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Echo Chamber (Intermediate)
     Mechanic: staggered delayed echoes of the same message, fading
     ============================================================ */
  "echo-chamber": {
    mood: "lonely",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Echo Chamber",
    description: "Build a tool that sends your words out and echoes them back to you, fading each time.",
    steps: [
      "Create the HTML layout",
      "Add the echo logic",
      "Set how many echoes play",
      "Set how far apart each echo is",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="echo-app">
          <h1>Echo Chamber</h1>
          <p>Say something. Hear it echo back to you, softer each time.</p>
          <input id="echoInput" type="text" placeholder="Say something..." />
          <button id="sendEchoBtn">Send It Out</button>
          <div id="echoLog"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .echo-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #echoLog { margin-top: 16px; text-align: left; }
        .echo-line { padding: 8px 10px; margin-top: 6px; background: #eef2f6; border-radius: 8px; color: #4a4740; }
      `,
      js: `
        const echoInput = document.getElementById("echoInput");
        const sendEchoBtn = document.getElementById("sendEchoBtn");
        const echoLog = document.getElementById("echoLog");
        const echoCount = 3;
        const echoDelayMs = 1000;

        sendEchoBtn.addEventListener("click", function () {
          const value = echoInput.value;
          if (value.trim() === "") return;

          echoLog.innerHTML = "";
          echoInput.value = "";

          for (let i = 0; i < echoCount; i++) {
            setTimeout(function () {
              const line = document.createElement("div");
              line.className = "echo-line";
              line.style.opacity = (1 - i * 0.25).toString();
              line.textContent = value;
              echoLog.appendChild(line);
            }, i * echoDelayMs);
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your echo chamber",
        instructions: "Customize the title and subtitle for your echo chamber.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Echo Chamber</h1>\n<p>Say something. Hear it echo back to you, softer each time.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Set how many echoes play",
        instructions: "Choose how many times your message echoes back.",
        tip: "Tip: Only change the number.",
        starterCode: `const echoCount = 3;`,
        apply(code, state) {
          const match = code.match(/const echoCount = (\d+);/);
          const count = match ? match[1] : "3";
          state.js = state.js.replace(/const echoCount = \d+;/, `const echoCount = ${count};`);
        }
      },
      {
        title: "Set how far apart each echo is",
        instructions: "Choose how many milliseconds pass between each echo.",
        tip: "Tip: Only change the number.",
        starterCode: `const echoDelayMs = 1000;`,
        apply(code, state) {
          const match = code.match(/const echoDelayMs = (\d+);/);
          const ms = match ? match[1] : "1000";
          state.js = state.js.replace(/const echoDelayMs = \d+;/, `const echoDelayMs = ${ms};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Send a short message out and watch it echo back a few times.",
        tip: "Tip: You built staggered timing — several delayed effects from one single action.",
        starterCode: `Your echo chamber is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Companion Plant (Beginner)
     Mechanic: one-directional, capped multi-stage growth
     ============================================================ */
  "companion-plant": {
    mood: "lonely",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Companion Plant",
    description: "Build a little plant that grows a bit more each time you visit and water it.",
    steps: [
      "Create the HTML layout",
      "Add the growth logic",
      "Write your own growth stages",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="plant-app">
          <h1>Companion Plant</h1>
          <p>Water it a little each time you visit.</p>
          <div class="plant-display" id="plantDisplay">🌱</div>
          <button id="waterBtn">Water It</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .plant-app { text-align: center; padding: 40px; }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .plant-display { font-size: 48px; margin: 20px 0; }
        button { padding: 12px 24px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const stages = ["🌱", "🌿", "🪴", "🌳"];
        let stageIndex = 0;
        const plantDisplay = document.getElementById("plantDisplay");
        const waterBtn = document.getElementById("waterBtn");

        waterBtn.addEventListener("click", function () {
          if (stageIndex < stages.length - 1) {
            stageIndex++;
            plantDisplay.textContent = stages[stageIndex];
          }

          if (stageIndex === stages.length - 1) {
            waterBtn.textContent = "Fully Grown";
            waterBtn.disabled = true;
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your plant",
        instructions: "Customize the title and subtitle for your companion plant.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Companion Plant</h1>\n<p>Water it a little each time you visit.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own growth stages",
        instructions: "Replace these with your own progression of emoji or symbols. Keep the quotation marks and commas.",
        tip: "Tip: Only change what's inside the quotes.",
        starterCode: `"🌱", "🌿", "🪴", "🌳"`,
        apply(code, state) {
          state.js = state.js.replace(/const stages = \[.*?\];/, `const stages = [${code}];`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you water your plant.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="waterBtn">Water It</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="waterBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Water your plant until it reaches its final stage.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your companion plant is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Orbit Companion (Advanced)
     Mechanic: CSS orbital animation with an adjustable radius via a CSS variable
     ============================================================ */
  "orbit-companion": {
    mood: "lonely",
    difficulty: "advanced",
    requiredPlan: "free",
    title: "Orbit Companion",
    description: "Build a small moon that orbits a center point, and bring it closer, orbit by orbit.",
    steps: [
      "Create the HTML layout",
      "Add the orbit-closing logic",
      "Adjust how much closer each click brings it",
      "Set the closest distance allowed",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="orbit-app">
          <h1>Orbit Companion</h1>
          <p>Click to bring your companion a little closer, orbit by orbit.</p>
          <div class="orbit-wrap">
            <div class="orbit-center"></div>
            <div class="orbit-moon" id="orbitMoon"></div>
          </div>
          <button id="closerBtn">Bring It Closer</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .orbit-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .orbit-wrap { position: relative; width: 220px; height: 220px; margin: 20px auto; }
        .orbit-center { position: absolute; top: 50%; left: 50%; width: 24px; height: 24px; margin: -12px; border-radius: 50%; background: #c8a96a; }
        .orbit-moon { position: absolute; top: 50%; left: 50%; width: 14px; height: 14px; margin: -7px; border-radius: 50%; background: #8fb0d3; --orbit-radius: 90px; animation: orbitSpin 6s linear infinite; }
        @keyframes orbitSpin {
          from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
        }
        button { width: 100%; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const orbitMoon = document.getElementById("orbitMoon");
        const closerBtn = document.getElementById("closerBtn");
        let radius = 90;
        const radiusStep = 15;
        const minRadius = 30;

        closerBtn.addEventListener("click", function () {
          radius = Math.max(minRadius, radius - radiusStep);
          orbitMoon.style.setProperty("--orbit-radius", radius + "px");

          if (radius <= minRadius) {
            closerBtn.textContent = "As close as it gets";
            closerBtn.disabled = true;
          }
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your orbit",
        instructions: "Customize the title and subtitle for your orbit companion.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Orbit Companion</h1>\n<p>Click to bring your companion a little closer, orbit by orbit.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust how much closer each click brings it",
        instructions: "Choose how many pixels the orbit shrinks with each click. This works by updating a CSS custom property (--orbit-radius) that the orbit animation reads from.",
        tip: "Tip: Only change the number.",
        starterCode: `const radiusStep = 15;`,
        apply(code, state) {
          const match = code.match(/const radiusStep = (\d+);/);
          const step = match ? match[1] : "15";
          state.js = state.js.replace(/const radiusStep = \d+;/, `const radiusStep = ${step};`);
        }
      },
      {
        title: "Set the closest distance allowed",
        instructions: "Choose the smallest orbit radius allowed before the button locks.",
        tip: "Tip: Only change the number.",
        starterCode: `const minRadius = 30;`,
        apply(code, state) {
          const match = code.match(/const minRadius = (\d+);/);
          const min = match ? match[1] : "30";
          state.js = state.js.replace(/const minRadius = \d+;/, `const minRadius = ${min};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click a few times and watch the orbit shrink toward the center.",
        tip: "Tip: You built a CSS animation controlled live from JavaScript, using a custom property.",
        starterCode: `Your orbit companion is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Someone's Awake (Beginner)
     Mechanic: ambient, randomly-regenerated grid, refreshed on demand
     ============================================================ */
  "someones-awake-map": {
    mood: "lonely",
    difficulty: "beginner",
    requiredPlan: "free",
    title: "Someone's Awake",
    description: "Build a little grid representing other people who happen to be awake right now too.",
    steps: [
      "Create the HTML layout",
      "Add the random generation logic",
      "Adjust how many are awake",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="awake-app">
          <h1>Someone's Awake</h1>
          <p>Somewhere out there, other people are up too. Refresh to see a new snapshot.</p>
          <div class="awake-grid" id="awakeGrid"></div>
          <button id="refreshAwakeBtn">Refresh</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .awake-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .awake-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; margin-top: 16px; }
        .awake-dot { aspect-ratio: 1; border-radius: 50%; background: #eee2cf; }
        .awake-dot.on { background: #f5e9c8; }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const awakeGrid = document.getElementById("awakeGrid");
        const refreshAwakeBtn = document.getElementById("refreshAwakeBtn");
        const dotCount = 32;
        const awakeChance = 0.3;

        function render() {
          awakeGrid.innerHTML = "";
          for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement("div");
            dot.className = "awake-dot" + (Math.random() < awakeChance ? " on" : "");
            awakeGrid.appendChild(dot);
          }
        }

        refreshAwakeBtn.addEventListener("click", render);
        render();
      `
    },
    guidedSteps: [
      {
        title: "Name your map",
        instructions: "Customize the title and subtitle for your someone's awake tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Someone's Awake</h1>\n<p>Somewhere out there, other people are up too. Refresh to see a new snapshot.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust how many are awake",
        instructions: "Choose roughly what fraction of dots light up on each refresh (0 to 1).",
        tip: "Tip: A bigger decimal means more dots light up.",
        starterCode: `const awakeChance = 0.3;`,
        apply(code, state) {
          const match = code.match(/const awakeChance = ([\d.]+);/);
          const chance = match ? match[1] : "0.3";
          state.js = state.js.replace(/const awakeChance = [\d.]+;/, `const awakeChance = ${chance};`);
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says when you refresh.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="refreshAwakeBtn">Refresh</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="refreshAwakeBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Click refresh a few times and watch the pattern change.",
        tip: "Tip: You built this inside the website — no outside editor needed.",
        starterCode: `Your map is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Breathe Together (Intermediate)
     Mechanic: two independently phase-offset synchronized animations
     ============================================================ */
  "companion-breathing-sync": {
    mood: "lonely",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Breathe Together",
    description: "Build two pulsing circles — yours and a companion's — breathing in gentle offset from each other.",
    steps: [
      "Create the HTML layout",
      "Add the toggle logic",
      "Adjust the companion's offset",
      "Customize your button",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="syncbreath-app">
          <h1>Breathe Together</h1>
          <p>Toggle on, and breathe along with a companion rhythm, just offset from yours.</p>
          <div class="sync-row">
            <div class="sync-circle you" id="syncYou"></div>
            <div class="sync-circle companion" id="syncCompanion"></div>
          </div>
          <button id="syncToggleBtn">Start Together</button>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .syncbreath-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        .sync-row { display: flex; gap: 24px; justify-content: center; margin-top: 20px; }
        .sync-circle { width: 60px; height: 60px; border-radius: 50%; background: #8fb0d3; }
        .sync-circle.pulsing { animation: syncPulse 4s ease-in-out infinite; }
        .sync-circle.companion.pulsing { animation-delay: 2s; }
        @keyframes syncPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
        button { width: 100%; margin-top: 16px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
      `,
      js: `
        const syncYou = document.getElementById("syncYou");
        const syncCompanion = document.getElementById("syncCompanion");
        const syncToggleBtn = document.getElementById("syncToggleBtn");
        let syncing = false;

        syncToggleBtn.addEventListener("click", function () {
          syncing = !syncing;
          syncYou.classList.toggle("pulsing", syncing);
          syncCompanion.classList.toggle("pulsing", syncing);
          syncToggleBtn.textContent = syncing ? "Stop" : "Start Together";
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your tool",
        instructions: "Customize the title and subtitle for your breathe together tool.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Breathe Together</h1>\n<p>Toggle on, and breathe along with a companion rhythm, just offset from yours.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Adjust the companion's offset",
        instructions: "Choose how many seconds behind yours the companion circle pulses.",
        tip: "Tip: Only change the number before 's'.",
        starterCode: `.sync-circle.companion.pulsing { animation-delay: 2s; }`,
        apply(code, state) {
          state.css = state.css.replace(
            /\.sync-circle\.companion\.pulsing \{ animation-delay: 2s; \}/,
            code
          );
        }
      },
      {
        title: "Customize your button",
        instructions: "Change what the button says before you start.",
        tip: "Tip: Only change the words inside the button.",
        starterCode: `<button id="syncToggleBtn">Start Together</button>`,
        apply(code, state) {
          state.html = state.html.replace(/<button id="syncToggleBtn">.*?<\/button>/s, code);
        }
      },
      {
        title: "Finish your build",
        instructions: "Toggle it on and watch the two circles breathe in gentle offset.",
        tip: "Tip: You built two independently timed animations working together.",
        starterCode: `Your breathing tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  },

  /* ============================================================
     LONELY — Compliment Ping-Pong (Intermediate)
     Mechanic: two-way delayed exchange building a shared log
     ============================================================ */
  "compliment-ping-pong": {
    mood: "lonely",
    difficulty: "intermediate",
    requiredPlan: "free",
    title: "Compliment Ping-Pong",
    description: "Build a back-and-forth exchange where every kind word you send gets one back.",
    steps: [
      "Create the HTML layout",
      "Add the exchange logic",
      "Write your own replies",
      "Set the reply delay",
      "Reflect after building"
    ],
    initialState: {
      html: `
        <section class="pingpong-app">
          <h1>Compliment Ping-Pong</h1>
          <p>Send one out. One comes back soon after.</p>
          <input id="complimentInput" type="text" placeholder="Send a kind word..." />
          <button id="sendComplimentBtn">Send</button>
          <div id="complimentLog"></div>
        </section>
      `,
      css: `
        body { font-family: Arial, sans-serif; background: #f5f1eb; display: grid; place-items: center; min-height: 100vh; margin: 0; }
        .pingpong-app { width: min(420px, 90%); text-align: center; padding: 40px; background: white; border-radius: 24px; box-shadow: 0 18px 45px rgba(83, 68, 50, 0.10); }
        h1 { color: #2b2b2b; }
        p { color: #6f6a64; }
        input { width: 100%; margin-top: 12px; padding: 14px; border: 1px solid #d6cec2; border-radius: 12px; }
        button { width: 100%; margin-top: 14px; padding: 14px; border: none; border-radius: 999px; background: #c8a96a; color: white; cursor: pointer; }
        #complimentLog { margin-top: 16px; text-align: left; }
        .compliment-line { padding: 8px 10px; margin-top: 6px; border-radius: 8px; font-size: 14px; }
        .compliment-line.mine { background: #f8f0e4; }
        .compliment-line.theirs { background: #eef2f6; }
      `,
      js: `
        const complimentInput = document.getElementById("complimentInput");
        const sendComplimentBtn = document.getElementById("sendComplimentBtn");
        const complimentLog = document.getElementById("complimentLog");
        const replyDelayMs = 1500;

        const replies = [
          "That was kind. Here's one back: you're doing better than you think.",
          "Right back at you: your effort today counts for something.",
          "Same to you: you're allowed to take up space here."
        ];

        sendComplimentBtn.addEventListener("click", function () {
          const value = complimentInput.value;
          if (value.trim() === "") return;

          const mine = document.createElement("div");
          mine.className = "compliment-line mine";
          mine.textContent = value;
          complimentLog.appendChild(mine);
          complimentInput.value = "";

          setTimeout(function () {
            const reply = replies[Math.floor(Math.random() * replies.length)];
            const theirs = document.createElement("div");
            theirs.className = "compliment-line theirs";
            theirs.textContent = reply;
            complimentLog.appendChild(theirs);
          }, replyDelayMs);
        });
      `
    },
    guidedSteps: [
      {
        title: "Name your exchange",
        instructions: "Customize the title and subtitle for your compliment ping-pong.",
        tip: "Tip: Only change the words between the tags.",
        starterCode: `<h1>Compliment Ping-Pong</h1>\n<p>Send one out. One comes back soon after.</p>`,
        apply(code, state) {
          state.html = state.html.replace(/<h1>.*?<\/h1>\s*<p>.*?<\/p>/s, code);
        }
      },
      {
        title: "Write your own replies",
        instructions: "Replace these with kind replies you'd want to receive back. Keep the quotation marks and commas.",
        tip: "Tip: Only change the words inside the quotes.",
        starterCode: `"That was kind. Here's one back: you're doing better than you think.",\n"Right back at you: your effort today counts for something.",\n"Same to you: you're allowed to take up space here."`,
        apply(code, state) {
          state.js = state.js.replace(
            /const replies = \[[\s\S]*?\];/,
            `const replies = [\n          ${code}\n        ];`
          );
        }
      },
      {
        title: "Set the reply delay",
        instructions: "Choose how many milliseconds pass before the reply arrives.",
        tip: "Tip: Only change the number.",
        starterCode: `const replyDelayMs = 1500;`,
        apply(code, state) {
          const match = code.match(/const replyDelayMs = (\d+);/);
          const ms = match ? match[1] : "1500";
          state.js = state.js.replace(/const replyDelayMs = \d+;/, `const replyDelayMs = ${ms};`);
        }
      },
      {
        title: "Finish your build",
        instructions: "Send a kind word and wait for one to come back.",
        tip: "Tip: You built a two-way delayed exchange, not just a one-directional message.",
        starterCode: `Your ping-pong tool is ready.\n\nClick "Go to Reflection" when you're done.`,
        apply() {}
      }
    ]
  }

  
  };