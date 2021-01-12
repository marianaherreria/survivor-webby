window.addEventListener("click", addfrostys);

let width = window.innerWidth;
let height = window.innerHeight;

const body = document.body;
const elWrapper = document.querySelector(".frosty-wrapper");

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const frostys = [];
const radius = 20;

const Cd = 0.47; // Dimensionless
const rho = 1.22; // kg / m^3
const A = (Math.PI * radius * radius) / 10000; // m^2
const ag = 9.81; // m / s^2
const frameRate = 1 / 60;

function createfrosty(e) /* create a frosty */ {
    const vx = getRandomArbitrary(-10, 10); // x velocity
    const vy = getRandomArbitrary(-10, 1); // y velocity

    const el = document.createElement("div");
    el.className = "frosty";

    elWrapper.append(el);

    const lifetime = getRandomArbitrary(2000, 3000);

    el.style.setProperty("--lifetime", lifetime);

    const frosty = {
        el,
        absolutePosition: { x: width / 2, y: 0 },
        position: { x: e.pageX, y: e.pageY },
        velocity: { x: vx, y: vy },
        mass: 0.1, //kg
        radius: el.offsetWidth, // 1px = 1cm

        lifetime,

        animating: true,

        remove() {
            this.animating = false;
            this.el.parentNode.removeChild(this.el);
        },

        animate() {
            const frosty = this;
            let Fx =
                (-0.5 *
                    Cd *
                    A *
                    rho *
                    frosty.velocity.x *
                    frosty.velocity.x *
                    frosty.velocity.x) /
                Math.abs(frosty.velocity.x);
            let Fy =
                (-0.5 *
                    Cd *
                    A *
                    rho *
                    frosty.velocity.y *
                    frosty.velocity.y *
                    frosty.velocity.y) /
                Math.abs(frosty.velocity.y);

            Fx = isNaN(Fx) ? 0 : Fx;
            Fy = isNaN(Fy) ? 0 : Fy;

            // Calculate acceleration ( F = ma )
            var ax = Fx / frosty.mass;
            var ay = ag + Fy / frosty.mass;
            // Integrate to get velocity
            frosty.velocity.x += ax * frameRate;
            frosty.velocity.y += ay * frameRate;

            // Integrate to get position
            frosty.position.x += frosty.velocity.x * frameRate * 100;
            frosty.position.y += frosty.velocity.y * frameRate * 100;

            frosty.checkBounds();
            frosty.update();
        },

        checkBounds() {
            if (frosty.position.y + frosty.radius / 2 > height) {
                frosty.remove();
            }
            if (frosty.position.x > width) {
                frosty.remove();
            }
            if (frosty.position.x + frosty.radius < 0) {
                frosty.remove();
            }
        },

        update() {
            const relX = this.position.x - this.absolutePosition.x;
            const relY = this.position.y - this.absolutePosition.y;

            this.el.style.setProperty("--x", relX);
            this.el.style.setProperty("--y", relY);
            this.el.style.setProperty("--direction", this.direction);
        },
    };

    return frosty;
}

function animationLoop() {
    var i = frostys.length;
    while (i--) {
        frostys[i].animate();

        if (!frostys[i].animating) {
            frostys.splice(i, 1);
        }
    }

    requestAnimationFrame(animationLoop);
}

animationLoop();

function addfrostys(e) {
    if (frostys.length > 40) {
        return;
    }
    //cancelAnimationFrame(frame);
    for (let i = 0; i < 20; i++) {
        frostys.push(createfrosty(e));
    }
}