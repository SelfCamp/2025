# 2048 clone with a twist

Our version of the mighty [2048](https://play2048.co/) game, built in Vanilla JS for fun and to hone our skills.


## Objectives

##### [Must have]
- Clone original features (working board logic, win on 2048)
- Maintainable code
- Good test coverage

##### [Nice to have]
- Beautification
- Win on 2048+1 logic
- Additional features (undo, difficulty levels, etc.)

##### [Probably won't have]
- Backend (logins, scoreboard, etc.)


## Design principles
- Only script.js and eventHandler.js are allowed to control `Game` object
- Dependencies are injected from script.js unless it's super inconvenient
- Responsibilities
  - `Game` class contains all game state
  - 'config.js' contains all config options
- DOM sprites are used for animation (not canvas)


## Game logic

#### Original 2048 rules
> https://play2048.co/

#### Extension: win on 2048+1
1. When **2048** tile is created, we spawn a one-time-only **1** tile
1. From here on, no more new tiles are spawned
1. Player has *8* moves to merge **1** into **2048** to create the winning **2049** tile


## Board lifecycle

#### `game.currentBoard()` object
- Updated **once** for each player move
- Contains both the state of the current board and the history of how it changed from the previous one

#### HTML `.board` and `.tile` elements
- Updated **twice** for each player move
    1. `initiateSlideInDOM`
        - Attrs indicate whether tile is sliding or not, and if it is, where to
        - (Tile numbers are still old)
    1. `initiateMergeSpawnInDOM`
        - Tile numbers get updated
        - Attrs indicate whether tile value is from merging / spawning
- Game-logic related values (e.g. `--slide-duration`) are automatically updated from config at runtime
