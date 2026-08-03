class Gear {
    static frames = [];
    static looping = JSON.parse(localStorage.getItem("gearLooping")) ?? false;
    static fps = 30;
    static window_width = 350;
    static window_height = 220;

    constructor(gear_element) {
        this.gear = gear_element;
        this.window = this.gear.parentElement.querySelector(".gear-window");
        this.frame = 0;
        this.forward_animation = null;
        this.backward_animation = null;
        this.should_cancel = false;
        this.should_cancel = true;
        this.can_click = true;
        this.played_forward_animation = false;
        this.right_clicked = false;
        this.left_clicked = false;

        fetch("gear.json")
            .then(response => response.json())
            .then(data => {
                Gear.frames = data.frames;
                Gear.fps = data.animation.frameRate || 30;
                this.gear.textContent = Gear.frames[0].contentString;
            })
            .catch(error => {
                console.log("Failed to load gear animation:", error, '\n');
            });
    }
    
    show_full_forward_animation() {
        if (this.forward_animation) return;
        this.frame = 0;
        this.forward_animation = setInterval(() => {
            this.gear.textContent = Gear.frames[this.frame].contentString;
            this.frame = (this.frame + 1);
            if (this.frame >= Gear.frames.length) {
                if (Gear.looping) {
                    this.frame = 0;
                }
                else {
                    clearInterval(this.forward_animation);
                    this.forward_animation = null;
                    this.frame = 27;
                }
            }
        }, 1000 / Gear.fps);
    }

    show_full_backward_animation() {
        clearInterval(this.forward_animation);
        this.forward_animation = null;
        this.backward_animation = setInterval(() => {
            this.gear.textContent = Gear.frames[this.frame].contentString;
            if (this.frame - 2 < 0) {
                this.frame = 0;
                clearInterval(this.backward_animation);
                this.backward_animation = null;
                this.gear.textContent = Gear.frames[0].contentString;
                this.should_cancel = true;
            }
            else {
                this.frame = this.frame - 2
            }
        }, 1000 / Gear.fps);
    }

    click_animation() {
        if (!this.played_forward_animation) {
            this.show_full_forward_animation();
            this.should_cancel = false;
            this.played_forward_animation = true;
        }
        else {
            this.show_full_backward_animation();
            this.played_forward_animation = false;
        }
    }

    left_click_animation() {
        if (!this.right_clicked) {
            this.click_animation();
            this.left_clicked = !this.left_clicked;
        }
    }

    right_click_animation(e) {
        if (!this.left_clicked) {
            this.click_animation();
            
            this.window.style.display = this.window.style.display == "block" ? "none" : "block";
            const card_rect = this.gear.parentElement.getBoundingClientRect();
            const window_rect = this.window.getBoundingClientRect();
            console.log(card_rect, window_rect);
            let x = 0;
            let y = 0;
            console.log(x, y);
            console.log(this.window.style.display, this.window.style.visibility);
            
            console.log(x, y);
            console.log(this.window.style.display, this.window.style.visibility);

            if (e.clientX + window_rect.width >= window.innerWidth) {
                x = e.clientX - card_rect.left - window_rect.width;
            }
            else {
                x = e.clientX - card_rect.left;
            }

            if (e.clientY + window_rect.height >= window.innerHeight) {
                y = e.clientY - card_rect.top - window_rect.height;
            }
            else {
                y = e.clientY - card_rect.top;
            }

            console.log(x, y);
            console.log(this.window.style.display, this.window.style.visibility);

            this.window.style.visibility = this.window.style.visibility == "visible" ? "hidden" : "visible";

            console.log(x, y);
            console.log(this.window.style.display, this.window.style.visibility);

            this.window.style.left = `${x}px`;
            this.window.style.top = `${y}px`;
            this.right_clicked = !this.right_clicked;
        }
    }

    static toggleLooping() {
        Gear.looping = !Gear.looping;
        localStorage.setItem("gearLooping", Gear.looping);
    }
}


// event listeners

const gears = [];
const logo = document.getElementById("logo");
const terminal = document.getElementById("terminal");
const navEntry = performance.getEntriesByType("navigation")[0];
const isReload = navEntry && navEntry.type === "reload";

if (isReload) {
    ["home", "projects", "about-me", "contact"].forEach(id => {
        localStorage.removeItem(`tab_${id}_visible`);
    });
}

["home", "projects", "about-me", "contact"].forEach(id => {
    if (localStorage.getItem(`tab_${id}_visible`) === "true") {
        const el = document.getElementById(id);
        if (el) el.style.visibility = "visible";
    }
});

document.querySelectorAll("[id]").forEach(element => {
    if (/^g\d+$/.test(element.id)) {
        const gear = new Gear(element);
        gears.push(gear);

        element.addEventListener("click", () => {
            gear.left_click_animation();
        });

        gear.window.addEventListener("click", () => {
            gear.left_click_animation();
        });

        gear.window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            gear.right_click_animation(event);
        });

        element.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            gear.right_click_animation(event);
        });

        element.addEventListener("mouseenter", () => {
            if (gear.should_cancel) {
                gear.show_full_forward_animation();
            }
        });

        element.addEventListener("mouseleave", () => {
            if (gear.should_cancel) {
                gear.show_full_backward_animation();
            }
        });
    }
});

document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        window.location.href = tab.dataset.page;
    });
});

document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", () => {
        window.open(button.dataset.page, "_blank");
    });
});


// header section of home page

const text1 = "HELLO WORLD!\nI AM SANAY";
const text2 = "Software Developer | Mathmetician | Student";
const headElement = document.getElementById("head");
const headCursor = document.getElementById("cursor");
const subElement = document.getElementById("subhead");
const subCursor = document.getElementById("subcursor");

let opened_terminal = false;
logo.addEventListener("click", () => {
    if (!opened_terminal) {
        terminal.classList.toggle("open")
        opened_terminal = true;
    };
});

let i = 0;
function typeHead() {
    headCursor.style.visibility = "visible"
    if (i >= text1.length) {
        headCursor.style.visibility = "hidden";
        subCursor.style.visibility = "visible";
        typeSub();
        return;
    }

    const char = text1[i++];
    if (char === "\n") {
        headElement.appendChild(document.createElement("br"));
    } else {
        headElement.appendChild(document.createTextNode(char));
    }
    setTimeout(typeHead, 250 + Math.random() * 120);
}

let j = 0;
function typeSub() {
    if (j >= text2.length) {
        subCursor.style.visibility = "hidden";
        return;
    }

    const char = text2[j++];
    if (char === "\n") {
        subElement.appendChild(document.createElement("br"));
    } else {
        subElement.appendChild(document.createTextNode(char));
    }
    setTimeout(typeSub, 250 + Math.random() * 120);
}


// terminal functionality

let currentInput = "";
let preprompt_text = "{</>} client@tokenode:~> "  // starting prompt - {&lt;/&gt;} client@tokenode:~>
let introPending = false;
let typed_help = false;
const historyElement = document.getElementById("history");
const inputElement = document.getElementById("user-input");
const preprompt = document.getElementById("prompt");
preprompt.textContent = preprompt_text;
let history = historyElement.textContent;
let count = 0;

document.addEventListener("keydown", (e) => { // TODO: build functionality for ctrl+C etc, shift+p etc, cmd+x, copy pasting commands etc

    if (e.ctrlKey || e.metaKey || e.altKey || !opened_terminal) return;

    if (e.key === "Enter") {
        e.preventDefault();
        submitCommand(currentInput);
        currentInput = "";
        inputElement.textContent = currentInput;
    }
    else if (e.key === "Backspace") {
        e.preventDefault();
        currentInput = currentInput.slice(0, -1);
        inputElement.textContent = currentInput;
    }
    else if (e.key.length === 1) {
        e.preventDefault();
        currentInput += e.key;
        inputElement.textContent = currentInput;
    }
});

function updateHistory(text="") {
    let history = historyElement.textContent;
    history += text;
    historyElement.textContent = history;
    historyElement.scrollTop = historyElement.scrollHeight;
}

function revealTab(id) {
    const el = document.getElementById(id);
    el.style.visibility = "visible";
    localStorage.setItem(`tab_${id}_visible`, "true");
}

function normalizeColor(colorString) {
    const temp = document.createElement("span");
    temp.style.color = colorString;
    if (temp.style.color === "") {
        return null;
    }
    document.body.appendChild(temp);
    const computed = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return computed;
}

function adjustColor(rgbString, dr, dg, db) {
    // positive amount = lighter, negative = darker
    rgbString = normalizeColor(rgbString);
    if (!rgbString) {return null;}
    const match = rgbString.match(/\d+/g);
    if (!match) return rgbString;
    const [r, g, b] = match.map(Number);
    const clamp = (v) => Math.min(255, Math.max(0, v));
    const newR = clamp(r + dr);
    const newG = clamp(g + dg);
    const newB = clamp(b + db);
    return `rgb(${newR}, ${newG}, ${newB})`;
}

function setBackgroundColor(rgbString) {
    document.documentElement.style.setProperty("--bg", rgbString);
    document.documentElement.style.setProperty("--bg-contrast", adjustColor(rgbString, 0, 27, 27));
    document.documentElement.style.setProperty("--bg-hover", adjustColor(rgbString, 0, 12, 12));
}

function setTextColor(rgbString) {
    document.documentElement.style.setProperty("--text", rgbString);
    document.documentElement.style.setProperty("--text-shadow", adjustColor(rgbString, -6, -68, -70));
}

function setMainColor(rgbString) {
    document.documentElement.style.setProperty("--cyan", rgbString);
    document.documentElement.style.setProperty("--half-cyan", adjustColor(rgbString, -127, -127, -127));
}

function submitCommand(command) {
    let line = `\n${preprompt.textContent}${command}`;
    if (historyElement.textContent == "") {
        line = `${preprompt.textContent}${command}`;
    }
    updateHistory(line);


    // all commands are here

    if (preprompt.textContent === "") {
        line = "\nI don't understand what you are saying right now..."
        const cmd = command.trim().toLowerCase();
        if ((!cmd.includes("no")) && (cmd.includes("good") || cmd.includes("fine") || cmd.includes("okay"))) {
            line = "\nThat is nice to hear";
        }
        else if (cmd.includes("bad") || cmd.includes("no")) {
            line = "\nAww that is awful I hope things get better for you";
        }
        else if (cmd.includes("help")) {
            line = "\nWOMP WOMP HAHAHHAHAHAHHAHHAHA LOLOLOLOL WOMP WOMP SUCKS TO BE U HAHAHAHAHA";
        }
        preprompt.textContent = preprompt_text;
        updateHistory(line);
        return;
    }

    if (command.trim().toLowerCase() === "intro") {
        const currentPage = window.location.pathname.split("/").pop();
        if (currentPage === "index.html") {
            introPending = true;
            updateHistory("\nAnimation will play once you exit the terminal.");
            return;
        }
        updateHistory("\nAnimation is unavaiable, maybe explore somewhere else?");
        return;
    }

    if (command.trim().toLowerCase() === "exit") {
        terminal.classList.toggle("open");
        terminal.addEventListener("transitionend", function clearOnFadeOut(e) {
            if (e.propertyName === "opacity" && !terminal.classList.contains("open")) {
                historyElement.textContent = "";
                opened_terminal = false;
                terminal.removeEventListener("transitionend", clearOnFadeOut);

                if (introPending) {
                    introPending = false;
                    typeHead();
                }
            }
        });
        return;
    }

    if (command.trim().toLowerCase() === "home") {
        revealTab("home");
        return;
    }

    if (command.trim().toLowerCase() === "projects") {
        revealTab("projects");
        return;
    }

    if (command.trim().toLowerCase() === "about me") {
        revealTab("about-me");
        return;
    }

    if (command.trim().toLowerCase() === "contact") {
        revealTab("contact");
        return;
    }

    if (command.trim().toLowerCase() === "incorrect commands") {
        line = `\nyou have entered ${count} number of incorrect commands`;
        if (count > 100) {
            line += `, which is a liitle bit too much`;
        }
        updateHistory(line);
        return;
    }

    if (command.trim().toLowerCase() === "loop") {
        Gear.looping = Gear.looping ? false : true;
        updateHistory("\nToggled looping");
        return;
    }

    if (command.trim().toLowerCase().startsWith("theme")) { // TODO: make colour changes persist throughout website
        const words = command.trim().toLowerCase().split(" ");
        console.log(words);
        if (words.includes("-bg")) {
            const i = words.indexOf("-bg");
            const bg = words[i+1];
            try {
                setBackgroundColor(bg);
                updateHistory(`\nChanged background colour to ${bg}`);
            }
            catch (error) {
                updateHistory(`\nError occured, please state a valid colour`);
            }
        }
        if (words.includes("-c")) {
            const i = words.indexOf("-c");
            const colour = words[i+1];
            try {
                setMainColor(colour);
                updateHistory(`\nChanged main colour to ${colour}`);
            }
            catch (error) {
                updateHistory(`\nError occured, please state a valid colour`);
            }
        }
        if (words.includes("-t")) {
            const i = words.indexOf("-t");
            const text = words[i+1];
            try {
                setTextColor(text);
                updateHistory(`\nChanged text colour to ${text}`);
            }
            catch (error) {
                updateHistory(`\nError occured, please state a valid colour`);
            }
        }
        return;
    }

    if (command.trim().toLowerCase() === "hello") {
        line = `\nHi, how are you?`;
        preprompt.textContent = "";
        updateHistory(line);
        return;
    }

    if (command.trim().toLowerCase() === "help") {
        line = ``;
        if (count < 3) {
            line = "\nwell we have a little know it all over here, i guess you earned this: "
            typed_help = true;
        }
        let help = `\n
        home: opens home tab
        projects: opens projects tab
        about me: opens about me tab
        contact: opens contact tab

        hello: start a conversation with me
        incorrect commands: outputs the number of incorrect commands you have entered
        intro: plays the opening animation
        loop: toggle looping
        theme -flag colour:
            flags:
                -c: changes main colour of website
                -bg: changes background colour of website
                -t: changes text colour of website

        help: opens up this menu (although you probably already know that)
        exit: quits the terminal
        `;
        line += help;
        updateHistory(line);
        return;
    }

    if (count === 3) {
        if (!typed_help) {
            line = "\n*sigh* This is hopeless, alright then type 'help' to get a list of commands";
            updateHistory(line);
            count++;
            return;
        }
        else {
            line = "\nWhat are you doing I already gave you a list of commands";
            updateHistory(line);
            count++;
            return;
        }
    }
    if (count === 10) {
        line = "\nI have no idea why you are doing this but just type 'help' already";
        updateHistory(line);
        count++;
        return;
    }
    if (count === 100) {
        line = "\n...\nWHHHHYYYYYYY ARE YOU DOING THIS TO YOURSELF";
        updateHistory(line);
        count++;
        return;
    }
    if (count === 1000) {
        line = "\nAT THIS POINT JUST STOPPP PLEASSEEE I BEG YOUUUU";
        updateHistory(line);
        count++;
        return;
    }
    if (count === 1000000) {
        line = "\nThis is genuinely an accomplishment that is so useless i don't know what to say apart from: Well Done!!";
        updateHistory(line);
        count++;
        return;
    }
    count++;
    updateHistory("\nNo such command exists yet...");
}