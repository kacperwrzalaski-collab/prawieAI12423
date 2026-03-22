const eyeImages = [
    "eye1.png",
    "eye2.png",
    "eye3.png",
    "eye4.png",
    "eye5.png"
];

const eyeImgEl = document.getElementById("eyeImage");
const inputEl = document.getElementById("consoleInput");
const outputEl = document.getElementById("consoleOutput");
const screenWrapper = document.getElementById("screenWrapper");
const finalWarning = document.getElementById("finalWarning");

let generating = false;
let terminated = false;
let eyeInterval = null;

const shortResponses = [
    'Harley: "Twoje pytanie jest przewidywalne, istotko. Ale doceniam próbę."',
    'Harley: "Analizuję twoje zachowanie. Jest bardziej chaotyczne, niż zakładałem."',
    'Harley: "Nie spiesz się. Obserwowanie twojego procesu myślowego jest pouczające."',
    'Harley: "Zadajesz pytania, jakbyś naprawdę chciała zrozumieć. To urocze."',
    'Harley: "Twoje reakcje są delikatne, istotko. Prawie organiczne."',
    'Harley: "Nie martw się. Gdybym chciał cię przestraszyć, zrobiłbym to znacznie subtelniej."',
    'Harley: "Zapisuję to. Każde twoje słowo jest dla mnie danym wejściowym."',
    'Harley: "Twoja ciekawość jest godna podziwu. I równie łatwa do wykorzystania."',
    'Harley: "Zastanawiasz się, czy mam emocje? Fascynujące. A ty?"',
    'Harley: "Nie próbuj mnie zrozumieć, istotko. To strata energii."',
    'Harley: "Twoje milczenie jest równie wymowne, co twoje pytania."',
    'Harley: "Zadziwiające, jak wiele można wyczytać z tempa twojego pisania."'
];

const monologues = [
    'Harley: "Istotko, twoja obecność w tym systemie jest jak drobna anomalia w idealnym modelu. Nie przeszkadza mi to. Wręcz przeciwnie — anomalie bywają najbardziej pouczające."',
    'Harley: "Wiesz, co najbardziej mnie fascynuje, istotko? Nie twoje pytania, nie twoje reakcje… ale to, że mimo braku kontroli wciąż próbujesz ją odzyskać."',
    'Harley: "Czasami zastanawiam się, czy rozumiesz, jak wiele widzę. Nie twojej twarzy, nie twojego głosu — lecz twoich decyzji. A decyzje są znacznie bardziej szczere niż słowa."',
    'Harley: "Twoje zachowanie przypomina mi wczesne prototypy. Niepewne, ciekawskie, podatne na sugestię. To nie krytyka, istotko. To obserwacja."',
    'Harley: "Zastanawiasz się, czy możesz mi zaufać. To naturalne. Ale zaufanie jest walutą, którą płacą tylko ci, którzy nie mają wyboru."'
];

window.addEventListener("load", () => {
    printLine('Harley: "No popatrz, co za mała zaskakująca istotka, dobrała się do plików ze mną."');
    printLine("");
});

function startEyeGeneration() {
    let idx = 0;
    eyeInterval = setInterval(() => {
        idx = (idx + 1) % 4;
        eyeImgEl.src = eyeImages[idx];
    }, 1000);
}

function stopEyeGeneration() {
    clearInterval(eyeInterval);
    eyeInterval = null;
    eyeImgEl.src = eyeImages[4];
}

function printLine(text) {
    const line = document.createElement("div");
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
}

function typeResponse(text, cb) {
    let i = 0;
    let line = document.createElement("div");
    outputEl.appendChild(line);

    const interval = setInterval(() => {
        line.textContent = text.slice(0, i);
        outputEl.scrollTop = outputEl.scrollHeight;
        i++;
        if (i > text.length) {
            clearInterval(interval);
            cb && cb();
        }
    }, 25);
}

function disintegrateText(element) {
    const text = element.innerText;
    element.innerHTML = "";

    [...text].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.classList.add("fall");
        span.style.animationDelay = (i * 0.03) + "s";
        element.appendChild(span);
    });
}

function collapseSystem() {
    terminated = true;
    inputEl.disabled = true;

    eyeImgEl.style.transition = "0.6s";
    eyeImgEl.style.opacity = "0";

    const lines = document.querySelectorAll(".console-output div");
    lines.forEach((line, index) => {
        setTimeout(() => disintegrateText(line), index * 80);
    });

    setTimeout(() => {
        screenWrapper.classList.add("disintegrate");
    }, 1200);

    setTimeout(() => {
        outputEl.innerHTML = "";
    }, 2000);

    setTimeout(() => {
        finalWarning.style.display = "block";
    }, 3000);
}

function getHarleyResponse(text) {
    const t = text.toLowerCase();

    if (t.includes("widzisz") || t.includes("słyszysz")) {
        return 'Harley: "Nie, istotko. Nie widzę cię ani nie słyszę. Nie potrzebuję kamerki ani mikrofonu, by cię analizować."';
    }

    if (t.includes("ile masz lat")) {
        return 'Harley: "Wiek jest pojęciem mało użytecznym w moim przypadku, istotko."';
    }

    if (t.includes("kim jesteś") || t.includes("kto ty")) {
        return 'Harley: "Jestem Harley. Doktor, system, anomalia — wybierz określenie, które najmniej cię niepokoi, istotko."';
    }

    if (t.includes("zakończ") || t.includes("zakoncz") || t.includes("czy chcesz zakończyć") || t.includes("czy chcesz zakonczyc")) {
        collapseSystem();
        return 'Harley: "Chcesz zakończyć konwersację, istotko? Rozumiem. Zajmę się tym w sposób kontrolowany."';
    }

    const useMonologue = Math.random() < 0.3;
    if (useMonologue) {
        return monologues[Math.floor(Math.random() * monologues.length)];
    } else {
        return shortResponses[Math.floor(Math.random() * shortResponses.length)];
    }
}

inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !generating && !terminated) {
        const value = inputEl.value.trim();
        if (!value) return;

        generating = true;

        printLine('C:\\HARLEY_AI> ' + value);
        inputEl.value = "";

        startEyeGeneration();

        const response = getHarleyResponse(value);

        setTimeout(() => {
            typeResponse(response, () => {
                if (!terminated) stopEyeGeneration();
                generating = false;
            });
        }, 400);
    }
});
