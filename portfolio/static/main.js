(function () {
    "use strict";

    var html = document.documentElement;
    var page = document.querySelector(".page");
    var $ = function (sel) { return document.querySelector(sel); };

    // ---------------------------------------------------------------- estrellas
    function placeStars() {
        var holder = $("[data-stars]");
        if (!page || !holder) return;

        var box = page.getBoundingClientRect(), W = box.width, H = box.height, pad = 14;
        var obs = Array.prototype.slice.call(page.querySelectorAll("h1,h2,h3,p,a,button,article,[data-ob]"))
            .filter(function (el) { return !el.closest("[data-stars]"); })
            .map(function (el) {
                var b = el.getBoundingClientRect();
                return { l: b.left - box.left - pad, t: b.top - box.top - pad, r: b.right - box.left + pad, b: b.bottom - box.top + pad };
            });

        var hero = $("#inicio");
        if (hero) {
            var hb = hero.getBoundingClientRect();
            obs.push({ l: W * 0.4, t: 0, r: W, b: hb.bottom - box.top + 20 });
            obs.push({ l: 0, t: hb.bottom - box.top - W * 0.12, r: W, b: hb.bottom - box.top + 20 });
        }

        var seed = 7;
        var rnd = function () { return (seed = (seed * 9301 + 49297) % 233280) / 233280; };
        var hit = function (list, x, y) {
            return list.some(function (o) { return x + 14 > o.l && x < o.r && y + 14 > o.t && y < o.b; });
        };

        var N = 50, pts = [];
        for (var d = Math.sqrt(W * H / N) * 0.8; pts.length < N && d > 20; d *= 0.9) {
            for (var n = 0; n < 3000 && pts.length < N; n++) {
                var x = 8 + rnd() * (W - 24), y = 8 + rnd() * (H - 24);
                if (hit(obs, x, y)) continue;
                if (pts.every(function (p) { return Math.hypot(p.x - x, p.y - y) >= d; })) pts.push({ x: x, y: y });
            }
        }

        // en modo claro se agregan estrellas extra a la izquierda del hero
        if (hero && html.getAttribute("data-theme") === "light") {
            var h2 = hero.getBoundingClientRect();
            var top = h2.top - box.top + 90, bot = h2.bottom - box.top - W * 0.12, right = W * 0.4;
            var near = Array.prototype.slice.call(hero.querySelectorAll("h1,p,a,[data-ob]")).map(function (el) {
                var b = el.getBoundingClientRect();
                return { l: b.left - box.left - 6, t: b.top - box.top - 6, r: b.right - box.left + 6, b: b.bottom - box.top + 6 };
            });
            var extra = [];
            for (var m = 0; m < 4000 && extra.length < 16; m++) {
                var ex = 8 + rnd() * (right - 24), ey = top + rnd() * (bot - top);
                if (hit(near, ex, ey)) continue;
                if (pts.concat(extra).every(function (p) { return Math.hypot(p.x - ex, p.y - ey) >= 46; })) extra.push({ x: ex, y: ey });
            }
            pts = pts.concat(extra);
        }

        holder.innerHTML = "";
        pts.forEach(function (p) {
            var s = document.createElement("span");
            s.className = "star";
            s.textContent = "✦";
            s.style.left = p.x + "px";
            s.style.top = p.y + "px";
            s.style.fontSize = (6 + rnd() * 8) + "px";
            s.style.animationDuration = (2 + rnd() * 3).toFixed(2) + "s";
            s.style.animationDelay = (-rnd() * 5).toFixed(2) + "s";
            holder.appendChild(s);
        });
    }

    // ---------------------------------------------------------------- tema
    var toggle = $("#themeToggle");
    function syncThemeIcon() {
        if (toggle) toggle.textContent = html.getAttribute("data-theme") === "light" ? "☀" : "☾";
    }
    syncThemeIcon();
    if (toggle) {
        toggle.addEventListener("click", function () {
            var next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
            html.setAttribute("data-theme", next);
            try { localStorage.setItem("tema", next); } catch (e) {}
            syncThemeIcon();
            requestAnimationFrame(placeStars);
        });
    }

    // ---------------------------------------------------------------- proyectos: entrada al hacer scroll
    var cards = document.querySelectorAll(".section--projects .project-card");
    if (cards.length) {
        if (!("IntersectionObserver" in window)) {
            cards.forEach(function (c) { c.classList.add("is-shown"); });
        } else {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    // aparece al entrar; se oculta de nuevo solo al salir por abajo
                    var on = e.isIntersecting ? true : e.boundingClientRect.top > 0 ? false : null;
                    if (on !== null) e.target.classList.toggle("is-shown", on);
                });
            }, { threshold: 0 });
            cards.forEach(function (c) { io.observe(c); });
        }
    }

    // ---------------------------------------------------------------- stack: abanico de cartas
    var TECHS = [
        ["HTML", "html5/html5-original", "front", "todos mis proyectos web", "estructura de las páginas"],
        ["CSS", "css3/css3-original", "front", "PlayCode y este portafolio", "estilos y diseño responsive"],
        ["JavaScript", "javascript/javascript-original", "lang", "PlayCode", "interacción en el navegador"],
        ["TypeScript", "typescript/typescript-original", "lang", "proyectos de práctica", "tipado y código más seguro"],
        ["Python", "python/python-original", "lang", "Django y scripts", "lógica y automatización"],
        ["Django", "django/django-plain", "back", "este portafolio", "backend y panel de admin", true],
        ["Node", "nodejs/nodejs-original", "back", "APIs de práctica", "servidores con JavaScript"],
        ["React", "react/react-original", "front", "PlayCode", "interfaces por componentes"],
        ["SQLite", "sqlite/sqlite-original", "db", "proyectos con Django", "base de datos liviana"],
        ["MySQL", "mysql/mysql-original", "db", "trabajos de la tecnicatura", "bases de datos relacionales", true],
        ["PostgreSQL", "postgresql/postgresql-original", "db", "proyectos con Django", "datos en producción"],
        ["Git", "git/git-original", "tool", "todos mis proyectos", "control de versiones"],
        ["GitHub", "github/github-original", "tool", "PlayCode, en equipo", "colaboración y repositorios", true],
        ["VS Code", "vscode/vscode-original", "tool", "todo el día", "editor de código"]
    ];
    var ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"];
    var DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/";

    var fan = $("#fan"), fanInner = $("#fanCards"), flip = $("#flip"), flipInner = $("#flipInner");
    if (fan && fanInner && flip && flipInner) {
        var n = TECHS.length, spread = 90;
        var sel = 5, hover = null, flipped = true, tx = 0, ty = 0, fanScale = 1, flipTimer;
        var els = [];

        var paint = function (el, t) {
            el.style.setProperty("--c", "var(--c-" + t[2] + ")");
            el.style.setProperty("--s", "var(--s-" + t[2] + ")");
            el.style.setProperty("--g", "var(--g-" + t[2] + ")");
        };
        var setIcon = function (el, t) {
            el.style.backgroundImage = "url(" + DEVICON + t[1] + ".svg)";
            el.classList.toggle("is-darkicon", !!t[5]);
        };

        TECHS.forEach(function (t, i) {
            var b = document.createElement("button");
            b.type = "button";
            b.className = "fan-card";
            b.setAttribute("aria-label", t[0]);
            b.style.setProperty("--rot", (-spread / 2 + spread * i / (n - 1)) + "deg");
            b.style.setProperty("--z", i);
            paint(b, t);
            b.innerHTML =
                '<span class="fan-card-face">' +
                '<span class="fan-card-inner">' +
                '<span class="fan-num">' + ROMANS[i] + '</span>' +
                '<span class="fan-icon"><span class="icon"></span></span>' +
                '<span class="fan-name">' + t[0] + '</span>' +
                '</span>' +
                '<span class="fan-star fan-star--a">✦</span>' +
                '<span class="fan-star fan-star--b">✦</span>' +
                '</span>';
            setIcon(b.querySelector(".icon"), t);
            fanInner.appendChild(b);
            els.push(b);
        });

        var renderFan = function () {
            els.forEach(function (el, i) {
                el.classList.toggle("is-hover", hover === i);
                el.classList.toggle("is-sel", sel === i);
            });
        };
        var renderPanel = function () {
            var t = TECHS[sel];
            $("#flipNum").textContent = ROMANS[sel];
            setIcon($("#flipIcon"), t);
            $("#flipName").textContent = t[0];
            $("#flipBackName").textContent = t[0];
            $("#flipUsed").textContent = t[3];
            $("#flipPower").textContent = t[4];
            flipInner.querySelectorAll(".flip-face").forEach(function (f) { paint(f, t); });
            flipInner.style.transform = "rotateX(" + tx + "deg) rotateY(" + (ty + (flipped ? 180 : 0)) + "deg)";
            flipInner.style.boxShadow = (-ty * 1.2) + "px " + (14 + tx) + "px 30px rgba(20,10,50,.35)";
        };
        var select = function (i) {
            clearTimeout(flipTimer);
            sel = i;
            flipped = false;
            renderFan();
            renderPanel();
            flipTimer = setTimeout(function () { flipped = true; renderPanel(); }, 1000);
        };

        // las cartas están en pointer-events:none; se detecta la carta por geometría
        var pick = function (ev) {
            var box = fan.getBoundingClientRect();
            var top = 340 - 150 - 136, oy = top + 136 * 3.8;
            var dx = (ev.clientX - box.left - box.width / 2) / fanScale;
            var dy = oy - (ev.clientY - box.top) / fanScale;
            var dist = Math.hypot(dx, dy), R0 = 136 * 3.8;
            if (dist < R0 - 136 - 4 || dist > R0 + 44) return null;
            var ang = Math.atan2(dx, dy) * 180 / Math.PI;
            var i = Math.round((ang + spread / 2) / (spread / (n - 1)));
            return i >= 0 && i < n && Math.abs(ang - (-spread / 2 + spread * i / (n - 1))) < 8 ? i : null;
        };
        fan.addEventListener("mousemove", function (ev) {
            var i = pick(ev);
            if (i !== hover) { hover = i; renderFan(); }
        });
        fan.addEventListener("mouseleave", function () { hover = null; renderFan(); });
        fan.addEventListener("click", function (ev) {
            var i = pick(ev);
            if (i !== null) select(i);
        });
        els.forEach(function (el, i) {
            // teclado: Enter/Espacio sobre una carta enfocada
            el.addEventListener("keydown", function (ev) {
                if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); select(i); }
            });
        });

        flip.addEventListener("mousemove", function (ev) {
            var b = flip.getBoundingClientRect();
            tx = -((ev.clientY - b.top) / b.height - .5) * 22;
            ty = ((ev.clientX - b.left) / b.width - .5) * 22;
            renderPanel();
        });
        flip.addEventListener("mouseleave", function () { tx = 0; ty = 0; renderPanel(); });

        var fit = function () {
            var s = Math.min(1, fan.getBoundingClientRect().width / 840);
            if (Math.abs(s - fanScale) > 0.005) {
                fanScale = s;
                fanInner.style.setProperty("--fan-scale", s);
                fan.style.height = 340 * s + "px";
                placeStars();
            }
        };
        fit();
        renderFan();
        renderPanel();
        window.addEventListener("resize", fit);
    }

    // ---------------------------------------------------------------- contacto
    var stage = $("#contactStage");
    if (stage) {
        // teclado decorativo
        var kb = $("#keyboard");
        if (kb) {
            [15, 15, 14, [1.4, 1, 1, 6, 1, 1, 1.4]].forEach(function (row, r) {
                var rowEl = document.createElement("div");
                rowEl.className = "kb-row";
                var flexes = Array.isArray(row) ? row : new Array(row).fill(1);
                flexes.forEach(function (f, k) {
                    var key = document.createElement("span");
                    key.className = "kb-key";
                    key.style.flex = f;
                    key.style.animationDuration = (3 + ((r * 7 + k * 3) % 30) / 10).toFixed(2) + "s";
                    key.style.animationDelay = "-" + (((r * 5 + k * 11) % 40) / 10).toFixed(2) + "s";
                    rowEl.appendChild(key);
                });
                kb.appendChild(rowEl);
            });
        }
        // cuadrícula de contribuciones decorativa
        var gh = $("#ghGrid");
        if (gh) {
            var s2 = 11, rnd2 = function () { return (s2 = (s2 * 9301 + 49297) % 233280) / 233280; };
            for (var c = 0; c < 64; c++) {
                var cell = document.createElement("i");
                var v = rnd2();
                if (v > .85) cell.className = "l4";
                else if (v > .7) cell.className = "l3";
                else if (v > .5) cell.className = "l2";
                else if (v > .3) cell.className = "l1";
                cell.style.animationDuration = (4.8 + rnd2() * 1.2).toFixed(2) + "s";
                cell.style.animationDelay = "-" + (rnd2() * 4).toFixed(2) + "s";
                gh.appendChild(cell);
            }
        }

        // las pantallas "se encienden" al entrar en vista
        if ("IntersectionObserver" in window) {
            new IntersectionObserver(function (entries) {
                var e = entries[0];
                var on = e.isIntersecting ? true : e.boundingClientRect.top > 0 ? false : null;
                if (on !== null) stage.classList.toggle("is-on", on);
            }, { threshold: 0.25 }).observe(stage);
        } else {
            stage.classList.add("is-on");
        }

        // evita el doble envío; el POST lo procesa la vista `contact`
        var form = $("#contactForm"), submit = $("#contactSubmit"), sending = $("#contactSending");
        var busy = false, slowTimer;
        if (form && submit && sending) {
            form.addEventListener("submit", function (ev) {
                if (busy) { ev.preventDefault(); return; }   // nunca dos envíos del mismo mensaje
                busy = true;
                submit.disabled = true;
                submit.classList.add("is-sending");
                submit.textContent = "Enviando…";
                form.setAttribute("aria-busy", "true");
                // readOnly (no disabled): los campos deshabilitados no se envían
                form.querySelectorAll("input, textarea").forEach(function (f) { f.readOnly = true; });
                sending.hidden = false;
                sending.textContent = "Enviando tu mensaje…";
                // si el correo tarda, el estado sigue visible hasta que llega la respuesta
                slowTimer = setTimeout(function () {
                    sending.textContent = "Sigue enviando… puede tardar unos segundos.";
                }, 4000);
            });
            // al volver con "Atrás", el formulario no debe quedar en "Enviando…"
            window.addEventListener("pageshow", function () {
                busy = false;
                clearTimeout(slowTimer);
                submit.disabled = false;
                submit.classList.remove("is-sending");
                submit.textContent = "Enviar mensaje";
                form.removeAttribute("aria-busy");
                form.querySelectorAll("input, textarea").forEach(function (f) { f.readOnly = false; });
                sending.hidden = true;
            });
        }
        // si volvimos con un mensaje (éxito/error), mostrar la sección de contacto
        if (stage.querySelector(".contact-status:not(#contactSending)")) {
            stage.classList.add("is-on");
            stage.scrollIntoView({ block: "center" });
        }
    }

    // ---------------------------------------------------------------- barra: se oculta al bajar, reaparece al subir
    var header = $(".site-header");
    if (header) {
        var HIDE_AFTER = 80;                       // px de scroll antes de poder ocultarse
        var lastY = window.scrollY, ticking = false;
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        // con el menú abierto o el foco del teclado dentro de la barra, no se oculta
        var pinned = function () {
            var f = document.activeElement;
            return !!header.querySelector('[aria-expanded="true"]') ||
                   !!(f && header.contains(f) && f.matches(":focus-visible"));
        };
        var update = function () {
            ticking = false;
            var y = Math.max(0, window.scrollY), dy = y - lastY;
            lastY = y;
            if (reduceMotion.matches || y <= HIDE_AFTER || pinned()) {
                header.classList.remove("is-hidden");
            } else if (dy > 0) {
                header.classList.add("is-hidden");       // bajando
            } else if (dy < 0) {
                header.classList.remove("is-hidden");    // subiendo, aunque sea un poco
            }
        };
        window.addEventListener("scroll", function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        reduceMotion.addEventListener("change", update);

        // altura real de la barra para el margen de los saltos
        var measure = function () {
            var nav = header.firstElementChild;
            document.documentElement.style.setProperty("--nav-clear", (nav.offsetTop + nav.offsetHeight + 12) + "px");
        };
        measure();
        window.addEventListener("resize", measure);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    }

    // ---------------------------------------------------------------- inicio
    var resizeTimer;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(placeStars, 150);
    });
    placeStars();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeStars);
})();
