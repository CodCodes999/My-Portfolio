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

    right_click_animation(e) { /* TODO: make a copy button which copies the link of the project into clipboard */
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

const gears = [];
const logo = document.getElementById("logo");

logo.addEventListener("click", () => {
    window.location.href = logo.dataset.page;
    Gear.toggleLooping();
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

const text = "HELLO WORLD!";
const textElement = document.getElementById("text");

let i = 0;
function type() {
    if (i >= text.length) return;

    textElement.textContent += text[i++];
    setTimeout(type, 300 + Math.random() * 120);
}

type();