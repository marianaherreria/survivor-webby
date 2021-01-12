window.addEventListener("click", addBlossoms);

let width = window.innerWidth;
let height = winndow.innerHeight;

const body = document.body;
const elWrapper = document.querySelector(".blossom-wrapper");

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const blossoms = [];
const radius = 20;

const Cd = 0.47; // Dimensionless
const rho = 1.22; // kg / m^3
const A = (Math.PI * radius * radius) / 10000; // m^2
const ag = 9.81; // m / s^2
const frameRate = 1 / 60;

function createblossom(e) /* create a blossom */ {
    const vx = getRandomArbitrary(-10, 10); // x velocity
    const vy = getRandomArbitrary(-10, 1); // y velocity

    const el = document.createElement("div");
    el.className = "blossom";

    elWrapper.append(el);

    const lifetime = getRandomArbitrary(2000, 3000);

    el.style.setProperty("--lifetime", lifetime);

    const blossom = {
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
            const blossom = this;
            let Fx =
                (-0.5 *
                    Cd *
                    A *
                    rho *
                    blossom.velocity.x *
                    blossom.velocity.x *
                    blossom.velocity.x) /
                Math.abs(blossom.velocity.x);
            let Fy =
                (-0.5 *
                    Cd *
                    A *
                    rho *
                    blossom.velocity.y *
                    blossom.velocity.y *
                    blossom.velocity.y) /
                Math.abs(blossom.velocity.y);

            Fx = isNaN(Fx) ? 0 : Fx;
            Fy = isNaN(Fy) ? 0 : Fy;

            // Calculate acceleration ( F = ma )
            var ax = Fx / blossom.mass;
            var ay = ag + Fy / blossom.mass;
            // Integrate to get velocity
            blossom.velocity.x += ax * frameRate;
            blossom.velocity.y += ay * frameRate;

            // Integrate to get position
            blossom.position.x += blossom.velocity.x * frameRate * 100;
            blossom.position.y += blossom.velocity.y * frameRate * 100;

            blossom.checkBounds();
            blossom.update();
        },

        checkBounds() {
            if (blossom.position.y + blossom.radius / 2 > height) {
                blossom.remove();
            }
            if (blossom.position.x > width) {
                blossom.remove();
            }
            if (blossom.position.x + blossom.radius < 0) {
                blossom.remove();
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

    return blossom;
}

function animationLoop() {
    var i = blossoms.length;
    while (i--) {
        blossoms[i].animate();

        if (!blossoms[i].animating) {
            blossoms.splice(i, 1);
        }
    }

    requestAnimationFrame(animationLoop);
}

animationLoop();

function addBlossoms(e) {
    if (blossoms.length > 40) {
        return;
    }
    //cancelAnimationFrame(frame);
    for (let i = 0; i < 20; i++) {
        blossoms.push(createblossom(e));
    }
}