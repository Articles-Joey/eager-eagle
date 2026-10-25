# Game Release Checklist

Guide of what should be done before a game is considered official released in a version 1.0.0 state.

Checklist Version: 0.1  
Completed by: ArticlesJoey  
Date: 2026-10-24

## Game Related

Tasks related to the game.

- [✅] Setup and run prettier
- [✅] All attributions are added in the README
- [✅] Setup game previews in the games DB and the README
- [✅] Setup .env.sample needed fields, especially those needed for dev-box
- [✅] Make sure sync_to_s3.js and reset_public.js are in scripts folder and run sync_to_s3.js

Most games always support these three play styles, if a certain control mode can't be supported then please explain.

- [✅] Keyboard and Mouse
- [✅] Touch Controls
- [⚠️] Controller Support - Only Xbox One controllers were tested. Game loop can be played with controller but customization needs mouse or touch still. A and LT to Flap | X and RT to Dive.

## Dev-Box Related

If using https://www.npmjs.com/package/@articles-media/articles-dev-box make sure these tasks are completed

- [✅] Setup of debugConfig.showStats and debugConfig.showPhysicsDebug from useStore.
- [✅] Implementation of getAssetSource from dev-box if open source game.
- [⚠️] Usage of graphicsQuality across game. - Nothing too intense I think so skipping until phone testing. Will add eventually, just not needed right now I think.
