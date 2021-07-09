const canvas = document.querySelector("canvas");
canvas.height = 550;
canvas.width = 550;
const context = canvas.getContext("2d");
// Rope settings...
let density = 50;
let elevation = 54;
let anchorStart = 64.5;
let anchorEnd = 414;
const particleRadius = 4;
const step = (anchorEnd - anchorStart) / (density + 1);

// Spring system settings...
let gravity = 0.17;
const mass = 7;
const stiffness = 1.7;
const springRestLength = step;
const dampingCoef = 0.155;

// Time settings...
let now = 0;
let then = 0;
let delta = 0;
const setDelta = () => {
	now = Date.now();
	delta = (now - then) / 16.7;
	then = now;
};
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener("mousemove", (e) => {
	mouse.x = e.x;
	mouse.y = e.y;
});
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	get magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	get direction() {
		if (head instanceof Vector) {
		}
	}
	add(vector) {
		if (vector instanceof Vector) {
			this.x += vector.x;
			this.y += vector.y;
		}
	}
	sub(vector) {
		if (vector instanceof Vector) {
			this.x -= vector.x;
			this.y -= vector.y;
		}
	}
	substract(scalar1, scalar2) {
		this.x -= scalar1;
		this.y -= scalar2;
	}
	multiply(scalar1, scalar2) {
		this.x *= scalar1;
		this.y *= scalar2;
	}
	multiply(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}
	divide(scalar) {
		if (scalar > 0) {
			this.x = this.x / scalar;
			this.y = this.y / scalar;
		}
	}
	static sub(forceDirection, attachedForce) {
		if (forceDirection instanceof Vector && attachedForce instanceof Vector) {
			const x = forceDirection.x - attachedForce.x;
			const y = forceDirection.y - attachedForce.y;
			return new Vector(x, y);
		}
	}
	copy() {
		return new Vector(this.x, this.y);
	}
	reset() {
		this.x *= 0;
		this.y *= 0;
	}
	normalize() {
		if (this.magnitude > 0) {
			this.x = this.x / this.magnitude;
			this.y = this.y / this.magnitude;
		}
	}
	limit(scalar) {
		this.x = (this.x * scalar) / this.magnitude;
		this.y = (this.y * scalar) / this.magnitude;
	}
}
let gravityForce = new Vector(0, gravity * mass);
class Point {
	constructor(x, y) {
		this.location = new Vector(x, y);
		this.acceleration = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		this.mass = mass;
		this.color = "rgb(15, 6, 33)";
		this.radius = particleRadius;
	}
	applyForce(force) {
		if (force instanceof Vector) {
			let newForce = force.copy();
			newForce.divide(this.mass);
			this.acceleration.add(newForce);
		}
	}
	draw() {
		context.beginPath();
		context.arc(
			this.location.x,
			this.location.y,
			this.radius,
			0,
			Math.PI * 2,
			false
		);
		context.fillStyle = this.color;
		context.fill();
	}
	update() {
		// Update Velocity...
		//this.velocity.multiply(delta);
		this.velocity.add(this.acceleration);
		// Move Point...
		this.location.add(this.velocity);
		this.acceleration.reset();
		// Draw...
		this.draw();
	}
}
class Spring {
	constructor(stiffness, dampingCoef, restLength) {
		this.stiffness = stiffness;
		this.restLength = restLength;
		this.dampingCoef = dampingCoef;
		this.beginAttach = new Vector(0, 0);
		this.endAttach = new Vector(0, 0);
	}
	calculateSpringForce(point, reverseDir) {
		let springForce;
		// Calculate spring force direction...
		if (reverseDir) {
			springForce = Vector.sub(this.beginAttach, this.endAttach);
		} else {
			springForce = Vector.sub(this.endAttach, this.beginAttach);
		}
		// Calculate the stretch...
		let stretch = springForce.magnitude - this.restLength;
		// Set the magnitude to 1 while maintaining the direction to get a unit vector...
		springForce.normalize();
		// Calculating the current spring force and applying it to the unit vector...
		springForce.multiply(-this.stiffness * stretch);
		// Damping the spring force...
		springForce.substract(
			this.dampingCoef * point.velocity.x,
			this.dampingCoef * point.velocity.y
		);
		return springForce;
	}
	draw() {
		context.beginPath();
		context.moveTo(this.beginAttach.x, this.beginAttach.y);
		context.lineTo(this.endAttach.x, this.endAttach.y);
		context.strokeStyle = "rgb(15, 6, 33)";
		context.lineWidth = 8;
		context.stroke();
	}
	connectTo(startPoint, endPoint, applyToStart, applyToEnd) {
		this.beginAttach = startPoint.location;
		this.endAttach = endPoint.location;
		if (applyToStart && applyToEnd) {
			startPoint.applyForce(this.calculateSpringForce(startPoint, true));
			endPoint.applyForce(this.calculateSpringForce(endPoint));
		} else if (!applyToStart && applyToEnd) {
			// Error
			endPoint.applyForce(this.calculateSpringForce(endPoint));
		} else if (applyToStart && !applyToEnd) {
			startPoint.applyForce(this.calculateSpringForce(startPoint, true));
		}
	}
	update() {
		this.draw();
	}
}
class Rope {
	constructor(density, stiffness, dampingCoef, restLength, anchor1, anchor2) {
		this.density = density;
		this.stiffness = stiffness;
		this.dampingCoef = dampingCoef;
		this.anchor1 = anchor1;
		this.anchor2 = anchor2;
		this.particles = [];
		this.springs = [];
		this.gravity = gravity;
		this.gravityForce = new Vector(0, this.gravity * mass);
		this.restLength = restLength;
	}
	init() {
		let currentPosition;
		let step;
		if (this.anchor1 && this.anchor2) {
			step =
				(this.anchor2.location.x - this.anchor1.location.x) /
				(this.density + 1);
			currentPosition = this.anchor1.location.x + step;
			for (let i = 0; i <= this.density; i++) {
				if (i < this.density) {
					this.particles.push(new Point(currentPosition, elevation));
				}
				this.springs.push(
					new Spring(this.stiffness, this.dampingCoef, this.restLength)
				);
				currentPosition += step;
			}
		} else if (this.anchor1) {
			step = 15;
			currentPosition = this.anchor1.location.y + step;
			for (let i = 0; i <= this.density; i++) {
				if (i < this.density) {
					this.particles.push(
						new Point(this.anchor1.location.x, currentPosition)
					);
				}
				this.springs.push(
					new Spring(this.stiffness, this.dampingCoef, this.restLength)
				);
				currentPosition += step;
			}
		}
	}
	update(applyToStar, applyToEnd) {
		if (this.anchor1 && this.anchor2) {
			for (let i = 0; i <= this.particles.length; i++) {
				if (i === 0) {
					this.springs[i].connectTo(
						this.anchor1,
						this.particles[i],
						applyToStar,
						true
					);
				} else if (i === this.particles.length) {
					this.springs[i].connectTo(
						this.particles[i - 1],
						this.anchor2,
						true,
						applyToEnd
					);
				} else {
					this.springs[i].connectTo(
						this.particles[i - 1],
						this.particles[i],
						true,
						true
					);
				}
				this.springs[i].update();
				if (i < this.particles.length) {
					this.particles[i].applyForce(this.gravityForce);
					this.particles[i].update();
				}
			}
		} else if (this.anchor1) {
			for (let i = 0; i < this.particles.length; i++) {
				if (i === 0) {
					this.springs[i].connectTo(
						this.anchor1,
						this.particles[i],
						applyToStar,
						true
					);
				} else {
					this.springs[i].connectTo(
						this.particles[i - 1],
						this.particles[i],
						true,
						true
					);
				}
				this.springs[i].update();
				this.particles[i].applyForce(this.gravityForce);
				this.particles[i].update();
			}
		}
	}
}
// Setup...
let animateVictim = false;
const gallows = new Image();
const victim = new Image();
const roller = new Image();
const anchor1 = new Point(anchorStart + 10, elevation + 5);
const anchor2 = new Point(anchorEnd + 37, elevation + 15);
const anchor3 = new Point(anchorEnd + 60, elevation + 310);
const anchor4 = new Point(anchorEnd + 37, elevation + 15);
let victimAnchor = new Point(anchor1.location.x, 300);
victimAnchor.mass = 65;
let ropeMid = new Rope(
	density,
	stiffness,
	dampingCoef,
	springRestLength,
	anchor1,
	anchor2
);
let ropeLeft = new Rope(23, 1.5, 0.3, 1, anchor1, victimAnchor);
let ropeRight = new Rope(30, 1.5, 0.4, 1, anchor4, anchor3);
let gallowsLoaded = false;
let victimLoaded = false;
let rollerLoaded = false;
ropeMid.init();
ropeLeft.init();
ropeRight.init();
gallows.onload = () => {
	gallowsLoaded = true;
};
victim.onload = () => {
	victimLoaded = true;
};
roller.onload = () => {
	rollerLoaded = true;
};
gallows.src = "/images/gallows.png";
victim.src = "/images/victim.png";
roller.src = "/images/roller.png";
let requestId;
const angle = {
	rotation: 0,
};
const rollerAnimation = gsap.to(angle, {
	rotation: 360,
	duration: 2,
	repeat: -1,
	ease: "none",
});
rollerAnimation.pause().progress(0);
const loop = () => {
	requestId = undefined;
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (gallowsLoaded && victimLoaded && rollerLoaded) {
		ropeMid.gravityForce = new Vector(0, ropeMid.gravity * mass);
		ropeMid.update();
		ropeLeft.update(false, animateVictim);
		ropeRight.update();
		victimAnchor.update();
		context.drawImage(gallows, -200, 0, canvas.width + 400, canvas.height);
		context.drawImage(
			victim,
			victimAnchor.location.x - 48,
			victimAnchor.location.y,
			100,
			250
		);
		context.save();
		context.translate(anchor3.location.x + 25, anchor3.location.y + 10);
		context.rotate((angle.rotation * Math.PI) / 180);
		context.drawImage(
			roller,
			-(roller.width / 2) + 11,
			-(roller.height / 2) + 5,
			90,
			90
		);
		context.restore();
	}
	animateRope();
};
// Animation...
const animateRope = () => {
	if (!requestId) {
		requestId = requestAnimationFrame(loop);
	}
};
const stopAnimate = () => {
	if (requestId) {
		cancelAnimationFrame(requestId);
		requestId = undefined;
	}
};
animateRope();
setTimeout(() => (animateVictim = true), 3700);
const hang = () => {
	if (ropeLeft.particles.length > 10) {
		ropeLeft.particles.splice(0, 4);
		ropeMid.particles.splice(ropeMid.particles.length - 2, 1);
		ropeRight.particles.splice(1, 3);
	}
};
const pullUp = () => {
	if (ropeMid.gravity > 0) {
		ropeMid.gravity -= 0.034;
		ropeMid.particles.splice(ropeMid.particles.length - 3, 2);
		ropeRight.particles.splice(1, 3);
		rotateAudio.volume = 0.1;
		pullupAudio.volume = 0.2;
		hangAudio.volume = 0.2;
		rollerAnimation.play();
		if (allowAudio) {
			rotateAudio.play();
			pullupAudio.play();
		}
		setTimeout(() => {
			rotateAudio.pause();
			pullupAudio.pause();
			rollerAnimation.pause();
		}, 2500);
		if (ropeMid.gravity <= 0) {
			if (allowAudio) hangAudio.play();
			new Promise((resolve) => {
				setTimeout(() => resolve(), 500);
			})
				.then(() => {
					hang();
					return new Promise((resolve) => {
						setTimeout(() => resolve(), 600);
					});
				})
				.then(() => {
					hang();
					return new Promise((resolve) => {
						setTimeout(() => resolve(), 700);
					});
				})
				.then(() => hang());
		}
	}
};
const resetLeftRope = () => {
	ropeLeft = new Rope(23, 1.5, 0.3, 1, anchor1, victimAnchor);
	ropeLeft.init();
};
const resetMidRope = () => {
	ropeMid = new Rope(
		density,
		stiffness,
		dampingCoef,
		springRestLength,
		anchor1,
		anchor2
	);
	ropeMid.init();
	ropeMid.gravity = gravity;
};
const resetCanvas = () => {
	if (ropeMid.particles.length < density) {
		gsap.to(angle, { rotation: 0, duration: 1 });
		stopAnimate();
		if (ropeLeft.particles.length < 23) {
			resetMidRope();
			resetLeftRope();
			ropeRight = new Rope(30, 1.5, 0.4, 1, anchor4, anchor3);
			ropeRight.init();
		} else {
			resetMidRope();
		}
		animateRope();
	}
};
