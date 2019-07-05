
var bgmusic;

function startSounds() {
	bgmusic = game.add.audio('bg');


    sounds = [ bgmusic ];

    //  Being mp3 files these take time to decode, so we can't play them instantly
    //  Using setDecodedCallback we can be notified when they're ALL ready for use.
    //  The audio files could decode in ANY order, we can never be sure which it'll be.

    game.sound.setDecodedCallback(sounds, playMusic, this);
}

function playMusic() {

    sounds.shift();

    //bgmusic.loopFull(0.6);

    //bgmusic.onLoop.add(hasLooped, this);

}