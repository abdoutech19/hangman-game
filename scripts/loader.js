const animScreen = document.querySelector(".loading-screen");
let loaded = false;
let mainTimeLine = gsap.timeline();
let allowAudio = true;
const initLoading = () => {
	let tl = gsap.timeline({ defaults: { duration: 0.4, delay: 0.4 } });
	tl.to(".loading-cover", { scaleY: 1 }).to(".loading-seg", {
		duration: 0,
		opacity: 1,
	});
	return tl;
};
const loading = () => {
	let tl = gsap.timeline({
		defaults: { duration: 0.4 },
		repeat: -1,
		onRepeat: () => {
			if (loaded) {
				tl.pause().kill();
				gsap
					.timeline({ defaults: { duration: 0.4 } })
					.to(".loading-seg", { duration: 0, opacity: 0 })
					.to(".loading-cover", { scaleY: 0 })
					.to(".loading-screen", { opacity: 0 })
					.to(".loading-screen", { duration: 0, visibility: "collapse" });
			}
		},
	});
	tl.to(".loading-cover", { scaleY: 0, y: -12, stagger: 0.1 })
		.to(
			".loading-cover",
			{
				scaleY: 1,
				stagger: 0.1,
				y: 0,
			},
			0.7
		)
		.to(".loading-seg", { y: -12, stagger: 0.1 }, 0)
		.to(".loading-seg", { y: 0, stagger: 0.1 }, "-=1.3");
	return tl;
};
const animateLoading = () => {
	mainTimeLine.add(initLoading()).add(loading());
};
animateLoading();
let correctAudio;
let wrongAudio;
let winAudio;
let loseAudio;
let rotateAudio;
let pullupAudio;
let hangAudio;
const handleLoadComplete = (id, item) => {
	let right = document.getElementsByClassName("hill-right")[0];
	let left = document.getElementsByClassName("hill-left")[0];
	let mid = document.getElementsByClassName("hill-middle")[0];
	let city = document.getElementsByClassName("city")[0];
	let mountains = document.getElementsByClassName("mountains")[0];
	let bgContainer = document.getElementsByClassName("bg-container")[0];
	switch (id) {
		case "right":
			right.append(item);
			break;
		case "left":
			left.append(item);
			break;
		case "mid":
			mid.append(item);
			break;
		case "city":
			city.append(item);
			break;
		case "mountains":
			mountains.append(item);
			break;
		case "sky":
			bgContainer.style.backgroundImage = `url(${item})`;
			break;
		case "correct":
			correctAudio = item;
			break;
		case "wrong":
			wrongAudio = item;
			break;
		case "win":
			winAudio = item;
			break;
		case "lose":
			loseAudio = item;
			break;
		case "rotate":
			rotateAudio = item;
			break;
		case "pullup":
			pullupAudio = item;
			break;
		case "hang":
			hangAudio = item;
			break;
	}
};
const loadData = () => {
	let queue = new createjs.LoadQueue(false);
	queue.loadFile({ id: "sky", src: "/images/sky.png" });
	queue.loadFile({ id: "city", src: "/images/city.png" });
	queue.loadFile({ id: "right", src: "/images/right.png" });
	queue.loadFile({ id: "left", src: "/images/left.png" });
	queue.loadFile({ id: "mid", src: "/images/middle.png" });
	queue.loadFile({ id: "mountains", src: "/images/mountains.png" });
	queue.loadFile({ id: "correct", src: "/audios/correct.mp3" });
	queue.loadFile({ id: "wrong", src: "/audios/wrong.mp3" });
	queue.loadFile({ id: "win", src: "/audios/win.mp3" });
	queue.loadFile({ id: "lose", src: "/audios/lose.mp3" });
	queue.loadFile({ id: "rotate", src: "/audios/rotate.mp3" });
	queue.loadFile({ id: "pullup", src: "/audios/pullup.mp3" });
	queue.loadFile({ id: "hang", src: "/audios/hang.mp3" });
	queue.on("fileload", (event) => {
		if (event.item.id === "sky") {
			handleLoadComplete(event.item.id, queue.getResult("sky").src);
		} else {
			handleLoadComplete(event.item.id, event.result);
		}
	});
	queue.on("complete", () => {
		loaded = true;
	});
};
loadData();
