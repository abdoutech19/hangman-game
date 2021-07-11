# Hangman Game

</br>

![Hangman](https://i.ibb.co/ThFP6LJ/Hangman.png)

</br>

## About the project

Hangman is a word game in which one player has to guess a word that the other player (the computer in this case) has thought of, by guessing the letters in it. Every time the player guesses a wrong letter, the rope that's tightening the man will get pulled by a tiny bit, until it gets completely pulled and the man is hanged. The player has to make the right guesses before the rope gets completely pulled to win the game.

The game is responsive to different window sizes, built with HTML, CSS3, and vanilla javascript.

</br>

## Project files description

- **index.html** - The project's enterypoint.
- **main.js** - The main javascript file that's responsible for running the game's logic, the animations, as well as fetching data from the APIs used in the project.
- **rope.js** - This JS file contains the code for all canvas animations used to calculate and display the hanging animation of the person. The file mainly contains the logic that simulates the motion of a rope, which is the implementation of simple particle system that uses the physics of a spring force applied to each two connected particles to simulate the tension a real rope. The spring force  is calculated using **Hooke's Law** with a spring-damper system which is modeled as follows:  **<math xmlns="http://www.w3.org/1998/Math MathML">
  <mi>F</mi>
  <mo>=</mo>
  <mo>&#x2212;</mo>
  <mi>&#x3B2;</mi>
  <mi>v</mi>
  <mo>&#x2212;</mo>
  <mi>k</mi>
  <mi>x</mi>
</math>**. Where:
    * **x** is the vector displacement of the end of the spring from it’s equilibrium position.
    * **k** is  a constant describing the tightness of the spring.
    * **b** is the coefficient of damping.
    * **v** is the relative velocity between the two points connected by the spring.

    You can tweek all these parameters which are declared in the beginning of this file along with other paramters such as the **mass** of the particle, the **density** of each rope, and the **gravity** of the system to get different rope animation results.
- **loader.js** - This JS file is responsible for displaying a loading animation while preloading all the media assets of the project (images and sounds) using [PreloadJS](https://createjs.com/preloadjs).

## Built With

- [Vanilla JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [GSAP](https://greensock.com/gsap/)

## Demo
Here is a live working demo: [Hangman](http://www.hangman-js.epizy.com  "Hangman Game").

## Usage
You are able to start the game locally in your machine by typing the following commands in the command line:

    $ npm install -g live-server

After installing live-server, navigate to project directory and simply run:

    $ live-server

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

Email me at: abdou19.tech@gmail.com.
