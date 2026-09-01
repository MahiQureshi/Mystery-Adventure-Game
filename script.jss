/* ========================================= */
/* MYSTIC REALMS - VERSION 1 GAME ENGINE */
/* ========================================= */


/* ========================================= */
/* GAME STATE */
/* ========================================= */

const GameState = {

  player: {
    name: "Adventurer",
    character: "female",
    outfit: "Sky Royal",

    courage: 80,
    magic: 50,

    location: "",
  },

  inventory: [],

  clues: [],

  achievements: [],

  companion: null,

  companionTrust: 50,

  currentScene: null,

  voiceEnabled: true,

  visitedWorlds: [],

};


/* ========================================= */
/* DOM ELEMENTS */
/* ========================================= */

const screens = {
  start: document.getElementById("startScreen"),
  character: document.getElementById("characterScreen"),
  world: document.getElementById("worldScreen"),
  game: document.getElementById("gameScreen"),
};


const playerNameInput =
  document.getElementById("playerName");


const choicesContainer =
  document.getElementById("choices");


const dialogueText =
  document.getElementById("dialogueText");


const speakerName =
  document.getElementById("speakerName");


const speakerRole =
  document.getElementById("speakerRole");


const speakerIcon =
  document.getElementById("speakerIcon");


const sceneTitle =
  document.getElementById("sceneTitle");


const chapterLabel =
  document.getElementById("chapterLabel");


const worldSymbol =
  document.getElementById("worldSymbol");


const hudPlayerName =
  document.getElementById("hudPlayerName");


const hudLocation =
  document.getElementById("hudLocation");


const playerAvatar =
  document.getElementById("playerAvatar");


const courageBar =
  document.getElementById("courageBar");


const magicBar =
  document.getElementById("magicBar");


const mysteryProgress =
  document.getElementById("mysteryProgress");


const activeCompanion =
  document.getElementById("activeCompanion");


const companionStatus =
  document.getElementById("companionStatus");


const eventMessage =
  document.getElementById("eventMessage");


const modal =
  document.getElementById("modal");


const modalTitle =
  document.getElementById("modalTitle");


const modalBody =
  document.getElementById("modalBody");


const achievementToast =
  document.getElementById("achievementToast");


const achievementText =
  document.getElementById("achievementText");


/* ========================================= */
/* SCREEN NAVIGATION */
/* ========================================= */

function showScreen(screenName) {

  Object.values(screens).forEach((screen) => {
    screen.classList.remove("active");
  });

  screens[screenName].classList.add("active");
}


/* ========================================= */
/* PARTICLES */
/* ========================================= */

function createParticles() {

  const container =
    document.getElementById("particles");


  for (let i = 0; i < 55; i++) {

    const particle =
      document.createElement("div");

    particle.className = "particle";

    particle.style.left =
      Math.random() * 100 + "%";

    particle.style.animationDuration =
      8 + Math.random() * 15 + "s";

    particle.style.animationDelay =
      Math.random() * 10 + "s";

    particle.style.opacity =
      Math.random();

    container.appendChild(particle);
  }
}


/* ========================================= */
/* VOICE SYSTEM */
/* ========================================= */

function speak(text, type = "normal") {

  if (!GameState.voiceEnabled) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }


  window.speechSynthesis.cancel();


  const speech =
    new SpeechSynthesisUtterance(text);


  speech.volume = 0.9;


  /*
    Different voice personalities
  */

  if (type === "queen") {

    speech.rate = 0.88;
    speech.pitch = 1.05;

  }

  else if (type === "fairy") {

    speech.rate = 0.95;
    speech.pitch = 1.35;

  }

  else if (type === "robot") {

    speech.rate = 1.05;
    speech.pitch = 1.15;

  }

  else if (type === "witch") {

    speech.rate = 0.72;
    speech.pitch = 0.75;

  }

  else if (type === "ghost") {

    speech.rate = 0.7;
    speech.pitch = 0.85;

  }

  else if (type === "guardian") {

    speech.rate = 0.8;
    speech.pitch = 0.65;

  }

  else {

    speech.rate = 0.9;
    speech.pitch = 1;
  }


  window.speechSynthesis.speak(speech);
}


/* ========================================= */
/* UPDATE HUD */
/* ========================================= */

function updateHUD() {

  hudPlayerName.textContent =
    GameState.player.name;


  hudLocation.textContent =
    GameState.player.location ||
    "Unknown Realm";


  playerAvatar.textContent =
    GameState.player.character === "female"
      ? "👸"
      : "🤴";


  courageBar.style.width =
    GameState.player.courage + "%";


  magicBar.style.width =
    GameState.player.magic + "%";


  mysteryProgress.textContent =
    Clues discovered: ${GameState.clues.length};


  if (GameState.companion) {

    activeCompanion.textContent =
      GameState.companion.name;

    companionStatus.textContent =
      GameState.companion.description;

  }

  else {

    activeCompanion.textContent =
      "None";

    companionStatus.textContent =
      "You are travelling alone.";
  }
}


/* ========================================= */
/* INVENTORY */
/* ========================================= */

function addItem(icon, name, description) {

  const exists =
    GameState.inventory.some(
      (item) => item.name === name
    );


  if (!exists) {

    GameState.inventory.push({
      icon,
      name,
      description,
    });


    showEvent(
      ${icon} Added to inventory: ${name}
    );
  }
}


/* ========================================= */
/* CLUES */
/* ========================================= */

function addClue(name) {

  if (!GameState.clues.includes(name)) {

    GameState.clues.push(name);

    showEvent(
      🔍 New clue discovered: ${name}
    );
  }

  updateHUD();
}


/* ========================================= */
/* EVENTS */
/* ========================================= */

function showEvent(message) {

  eventMessage.textContent =
    message;


  setTimeout(() => {

    eventMessage.textContent = "";

  }, 4000);
}


/* ========================================= */
/* ACHIEVEMENTS */
/* ========================================= */

function unlockAchievement(name) {

  if (
    GameState.achievements.includes(name)
  ) {
    return;
  }


  GameState.achievements.push(name);


  achievementText.textContent =
    name;


  achievementToast.classList.add("show");


  setTimeout(() => {

    achievementToast.classList.remove("show");

  }, 4500);
}


/* ========================================= */
/* COMPANIONS */
/* ========================================= */

function setCompanion(companion) {

  GameState.companion =
    companion;

  updateHUD();


  unlockAchievement(
    Companion Joined: ${companion.name}
  );
}


/* ========================================= */
/* RANDOM EVENTS */
/* ========================================= */

function randomEvent() {

  const chance =
    Math.random();


  if (chance < 0.25) {

    GameState.player.magic =
      Math.min(
        100,
        GameState.player.magic + 5
      );


    showEvent(
      "✨ A mysterious energy increases your magic."
    );
  }


  else if (chance < 0.5) {

    GameState.player.courage =
      Math.max(
        0,
        GameState.player.courage - 5
      );


    showEvent(
      "🌫️ Something moves in the darkness. Courage decreases."
    );
  }


  else if (chance < 0.7) {

    showEvent(
      "👣 You hear footsteps behind you..."
    );
  }


  updateHUD();
}


/* ========================================= */
/* SCENE SYSTEM */
/* ========================================= */

function loadScene(scene) {

  GameState.currentScene =
    scene.id;


  GameState.player.location =
    scene.location;


  chapterLabel.textContent =
    scene.chapter;


  sceneTitle.textContent =
    scene.title;


  worldSymbol.textContent =
    scene.symbol;


  speakerName.textContent =
    scene.speaker.name;


  speakerRole.textContent =
    scene.speaker.role;


  speakerIcon.textContent =
    scene.speaker.icon;


  dialogueText.textContent =
    scene.text;


  choicesContainer.innerHTML = "";


  scene.choices.forEach(
    (choice) => {

      const button =
        document.createElement("button");


      button.className =
        "choice-btn";


      button.textContent =
        choice.text;


      button.addEventListener(
        "click",
        () => {

          if (choice.action) {

            choice.action();
          }


          if (choice.next) {

            loadScene(
              Scenes[choice.next]
            );
          }

        }
      );


      choicesContainer.appendChild(
        button
      );
    }
  );


  updateHUD();


  speak(
    scene.text,
    scene.speaker.voice
  );


  randomEvent();
}


/* ========================================= */
/* STORY SCENES */
/* ========================================= */

const Scenes = {


  forestStart: {

    id: "forestStart",

    chapter:
      "CHAPTER ONE",

    title:
      "The Whispering Forest",

    location:
      "Whispering Forest",

    symbol:
      "🌲",


    speaker: {

      name:
        "The Forest",

      role:
        "An Ancient Presence",

      icon:
        "🌲",

      voice:
        "ghost",
    },


    text:
      "The trees stand silent as you enter. A cold wind passes through the forest, carrying a whisper that sounds almost like your name.",


    choices: [

      {

        text:
          "Follow the whisper deeper into the forest.",

        next:
          "forestWhisper",
      },


      {

        text:
          "Search the ground for clues.",

        action:
          () => {

            addClue(
              "Strange Silver Footprints"
            );


            addItem(
              "🗝️",
              "Ancient Key",
              "A key engraved with a crown symbol."
            );
          },

        next:
          "forestWhisper",
      },

    ],
  },


  forestWhisper: {

    id:
      "forestWhisper",

    chapter:
      "CHAPTER ONE",

    title:
      "Someone Is Watching",

    location:
      "Whispering Forest",

    symbol:
      "👣",


    speaker: {

      name:
        "Unknown Voice",

      role:
        "Hidden in the Shadows",

      icon:
        "🌫️",

      voice:
        "ghost",
    },


    text:
      "Stop. Do not take another step. The path ahead is not the path you think it is.",


    choices: [

      {

        text:
          "Ask who is speaking.",

        next:
          "companionArrival",
      },


      {

        text:
          "Ignore the voice and continue.",

        action:
          () => {

            GameState.player.courage =
              Math.max(
                0,
                GameState.player.courage - 10
              );


            updateHUD();
          },

        next:
          "darkForest",
      },

    ],
  },


  companionArrival: {

    id:
      "companionArrival",

    chapter:
      "CHAPTER TWO",

    title:
      "The Dimensional Companion",

    location:
      "Whispering Forest",

    symbol:
      "🤖",


    speaker: {

      name:
        "NOVA",

      role:
        "Dimensional Guide",

      icon:
        "🤖",

      voice:
        "robot",
    },


    text:
      "My name is NOVA. I have been searching for the one connected to the Lost Crown. My sensors suggest that might be you.",


    choices: [

      {

        text:
          "Allow NOVA to join your journey.",

        action:
          () => {

            setCompanion({

              name:
                "NOVA",

              description:
                "A cheerful dimensional companion with mysterious gadgets.",

              type:
                "robot",
            });


            addItem(
              "🚪",
              "Dimensional Gateway",
              "A device capable of opening unstable portals."
            );


            addItem(
              "🔦",
              "Adaptive Light",
              "Reveals hidden symbols and dangerous paths."
            );
          },

        next:
          "crownClue",
      },


      {

        text:
          "Tell NOVA you do not trust anyone yet.",

        action:
          () => {

            GameState.companionTrust =
              30;
          },

        next:
          "crownClue",
      },

    ],
  },


  darkForest: {

    id:
      "darkForest",

    chapter:
      "CHAPTER TWO",

    title:
      "The Darkness Moves",

    location:
      "Forbidden Forest",

    symbol:
      "🌑",


    speaker: {

      name:
        "Narrator",

      role:
        "The Ancient Voice",

      icon:
        "🌙",

      voice:
        "guardian",
    },


    text:
      "The light disappears. For several seconds, you cannot see anything. Then you hear breathing behind you.",


    choices: [

      {

        text:
          "Turn around.",

        next:
          "companionArrival",
      },


      {

        text:
          "Run toward the distant light.",

        action:
          () => {

            GameState.player.courage =
              Math.min(
                100,
                GameState.player.courage + 5
              );
          },

        next:
          "crownClue",
      },

    ],
  },


  crownClue: {

    id:
      "crownClue",

    chapter:
      "CHAPTER THREE",

    title:
      "The Lost Crown",

    location:
      "Ancient Clearing",

    symbol:
      "👑",


    speaker: {

      name:
        "NOVA",

      role:
        "Dimensional Guide",

      icon:
        "🤖",

      voice:
        "robot",
    },


    text:
      "I have discovered something unusual. The Lost Crown is not simply an object. Every realm appears to be hiding one part of its history.",


    choices: [

      {

        text:
          "Search for the Crown's first clue.",

        action:
          () => {

            addClue(
              "Crown Symbol in the Forest"
            );


            unlockAchievement(
              "First Mystery Discovered"
            );
          },

        next:
          "portalChoice",
      },


      {

        text:
          "Ask NOVA to open the Dimensional Gateway.",

        next:
          "portalChoice",
      },

    ],
  },


  portalChoice: {

    id:
      "portalChoice",

    chapter:
      "CHAPTER FOUR",

    title:
      "The Portals Respond",

    location:
      "Crossroads Between Worlds",

    symbol:
      "🌌",


    speaker: {

      name:
        "NOVA",

      role:
        "Dimensional Guide",

      icon:
        "🤖",

      voice:
        "robot",
    },


    text:
      "Four unstable signals are appearing. Each one leads toward another mystery. The decision is yours.",


    choices: [

      {

        text:
          "Enter the Frozen Mountains.",

        next:
          "mountainKingdom",
      },


      {

        text:
          "Enter the Forgotten Palace.",

        next:
          "palaceArrival",
      },


      {

        text:
          "Enter the Witch Territory.",

        next:
          "witchEncounter",
      },


      {

        text:
          "Enter the Dream Realm.",

        next:
          "dreamRealm",
      },

    ],
  },


  mountainKingdom: {

    id:
      "mountainKingdom",

    chapter:
      "CHAPTER FIVE",

    title:
      "The Crystal Kingdom",

    location:
      "Frozen Mountains",

    symbol:
      "❄️",


    speaker: {

      name:
        "Queen Aurelia",

      role:
        "Guardian of the Crystal Kingdom",

      icon:
        "👑",

      voice:
        "queen",
    },


    text:
      "Welcome, traveler. The mountains have carried your name long before you arrived. But before you enter my kingdom, you must tell me what you are searching for.",


    choices: [

      {

        text:
          "Tell the Queen about the Lost Crown.",

        action:
          () => {

            addClue(
              "The Queen Knows About the Crown"
            );


            unlockAchievement(
              "Entered the Crystal Kingdom"
            );
          },

        next:
          "royalDecision",
      },


      {

        text:
          "Say that you do not yet know whom to trust.",

        next:
          "royalDecision",
      },

    ],
  },


  palaceArrival: {

    id:
      "palaceArrival",

    chapter:
      "CHAPTER FIVE",

    title:
      "The Palace That Remembers",

    location:
      "Forgotten Palace",

    symbol:
      "🏰",


    speaker: {

      name:
        "The Palace",

      role:
        "Living Architecture",

      icon:
        "🏰",

      voice:
        "ghost",
    },


    text:
      "The palace doors open without anyone touching them. Inside, hundreds of portraits turn toward you at the same time.",


    choices: [

      {

        text:
          "Inspect the portraits.",

        action:
          () => {

            addClue(
              "A Portrait Wearing Your Outfit"
            );


            addItem(
              "🪞",
              "Living Mirror Fragment",
              "A fragment that reflects memories instead of faces."
            );
          },

        next:
          "royalDecision",
      },


      {

        text:
          "Search for the royal dining hall.",

        next:
          "royalDecision",
      },

    ],
  },


  witchEncounter: {

    id:
      "witchEncounter",

    chapter:
      "CHAPTER FIVE",

    title:
      "The Witch's Warning",

    location:
      "Witch Territory",

    symbol:
      "🧙",


    speaker: {

      name:
        "MORVA",

      role:
        "Keeper of Forbidden Knowledge",

      icon:
        "🧙",

      voice:
        "witch",
    },


    text:
      "You seek the Crown, yet you do not understand what it will awaken. Take my warning, traveler. Some mysteries were hidden for a reason.",


    choices: [

      {

        text:
          "Ask what the Crown will awaken.",

        action:
          () => {

            addClue(
              "The Crown Can Awaken Something Ancient"
            );
          },

        next:
          "royalDecision",
      },


      {

        text:
          "Refuse to trust the Witch.",

        action:
          () => {

            GameState.player.courage =
              Math.min(
                100,
                GameState.player.courage + 10
              );
          },

        next:
          "royalDecision",
      },

    ],
  },


  dreamRealm: {

    id:
      "dreamRealm",

    chapter:
      "CHAPTER FIVE",

    title:
      "A World That Should Not Exist",

    location:
      "Dream Realm",

    symbol:
      "🌠",


    speaker: {

      name:
        "LYRA",

      role:
        "Fairy of Forgotten Paths",

      icon:
        "🧚",

      voice:
        "fairy",
    },


    text:
      "You are dreaming, but the choices you make here will follow you when you wake. That is why you must be careful.",


    choices: [

      {

        text:
          "Ask LYRA to guide you.",

        action:
          () => {

            setCompanion({

              name:
                "LYRA",

              description:
                "A gentle fairy who reveals hidden paths and magical clues.",

              type:
                "fairy",
            });


            GameState.player.magic =
              Math.min(
                100,
                GameState.player.magic + 20
              );


            updateHUD();
          },

        next:
          "royalDecision",
      },


      {

        text:
          "Explore the dream alone.",

        next:
          "royalDecision",
      },

    ],
  },


  royalDecision: {

    id:
      "royalDecision",

    chapter:
      "CHAPTER SIX",

    title:
      "The Truth Approaches",

    location:
      "The Royal Crossroads",

    symbol:
      "👑",


    speaker: {

      name:
        "Narrator",

      role:
        "The Ancient Voice",

      icon:
        "🌙",

      voice:
        "guardian",
    },


    text:
      "Every clue is beginning to connect. The Crown is calling, the kingdoms are watching, and someone among those who helped you may still be hiding the truth.",


    choices: [

      {

        text:
          "Trust your companion and continue the journey.",

        action:
          () => {

            GameState.companionTrust +=
              20;


            unlockAchievement(
              "Trust Is a Choice"
            );
          },

        next:
          "finalMystery",
      },


      {

        text:
          "Continue alone and trust nobody.",

        action:
          () => {

            GameState.companionTrust -=
              20;


            GameState.player.courage =
              Math.min(
                100,
                GameState.player.courage + 10
              );
          },

        next:
          "finalMystery",
      },

    ],
  },


  finalMystery: {

    id:
      "finalMystery",

    chapter:
      "CHAPTER SEVEN",

    title:
      "The Crown Awakens",

    location:
      "The Hidden Throne",

    symbol:
      "👑",


    speaker: {

      name:
        "The Crown",

      role:
        "An Ancient Power",

      icon:
        "👑",

      voice:
        "guardian",
    },


    text:
      "At last, you have reached the truth. The Crown was never waiting for a ruler. It was waiting for someone capable of choosing what kind of world should exist after it awakens.",


    choices: [

      {

        text:
          "Protect the kingdoms.",

        action:
          () => {

            unlockAchievement(
              "Guardian of the Realms"
            );


            showEnding(
              "THE GUARDIAN ENDING",
              "You choose to protect the kingdoms. The Crown recognizes your courage and the portals begin to close peacefully."
            );
          },
      },


      {

        text:
          "Discover the Crown's full power.",

        action:
          () => {

            unlockAchievement(
              "The Forbidden Choice"
            );


            showEnding(
              "THE MYSTERY ENDING",
              "You reach toward the Crown's hidden power. The world fades into silence, and somewhere beyond the throne, another door opens."
            );
          },
      },

    ],
  },
};


/* ========================================= */
/* ENDING */
/* ========================================= */

function showEnding(title, text) {

  speak(
    text,
    "guardian"
  );


  sceneTitle.textContent =
    title;


  chapterLabel.textContent =
    "YOUR DESTINY";


  speakerName.textContent =
    "Mystic Realms";


  speakerRole.textContent =
    "Journey Complete... For Now";


  speakerIcon.textContent =
    "✨";


  dialogueText.textContent =
    text;


  choicesContainer.innerHTML = "";


  const restartButton =
    document.createElement("button");


  restartButton.className =
    "primary-btn";


  restartButton.textContent =
    "Begin Another Journey";


  restartButton.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "mysticRealmsSave"
      );


      location.reload();
    }
  );


  choicesContainer.appendChild(
    restartButton
  );


  GameState.player.location =
    title;


  updateHUD();


  saveGame();
}


/* ========================================= */
/* MODALS */
/* ========================================= */

function openPanel(panel) {

  modal.classList.add("show");


  if (panel === "inventory") {

    modalTitle.textContent =
      "🎒 Mystical Inventory";


    if (
      GameState.inventory.length === 0
    ) {

      modalBody.innerHTML =
        "<p>Your inventory is empty.</p>";

      return;
    }


    modalBody.innerHTML =
      GameState.inventory
        .map(
          (item) => `
            <div class="item-row">
              <strong>
                ${item.icon} ${item.name}
              </strong>
              <p>
                ${item.description}
              </p>
            </div>
          `
        )
        .join("");
  }


  if (panel === "journal") {

    modalTitle.textContent =
      "📖 Mystery Journal";


    modalBody.innerHTML =
      GameState.clues.length
        ? GameState.clues
            .map(
              (clue) => `
                <div class="item-row">
                  🔍 ${clue}
                </div>
              `
            )
            .join("")
        : "<p>No clues discovered yet.</p>";
  }


  if (panel === "companions") {

    modalTitle.textContent =
      "🤖 Companion System";


    if (!GameState.companion) {

      modalBody.innerHTML =
        `
        <p>
          You are currently travelling alone.
        </p>
        `;
    }

    else {

      modalBody.innerHTML =
        `
        <div class="item-row">
          <strong>
            ${GameState.companion.name}
          </strong>

          <p>
            ${GameState.companion.description}
          </p>

          <p>
            Trust Level:
            ${GameState.companionTrust}%
          </p>
        </div>
        `;
    }
  }


  if (panel === "achievements") {

    modalTitle.textContent =
      "🏆 Achievements";


    modalBody.innerHTML =
      GameState.achievements.length
        ? GameState.achievements
            .map(
              (achievement) => `
                <div class="item-row">
                  🏆 ${achievement}
                </div>
              `
            )
            .join("")
        : "<p>No achievements unlocked yet.</p>";
  }
}


/* ========================================= */
/* SAVE SYSTEM */
/* ========================================= */

function saveGame() {

  const saveData = {

    state:
      GameState,

  };


  localStorage.setItem(
    "mysticRealmsSave",
    JSON.stringify(saveData)
  );


  showEvent(
    "💾 Journey saved successfully."
  );
}


function loadGame() {

  const saved =
    localStorage.getItem(
      "mysticRealmsSave"
    );


  if (!saved) {

    alert(
      "No saved journey was found."
    );

    return;
  }


  const data =
    JSON.parse(saved);


  Object.assign(
    GameState,
    data.state
  );


  showScreen("game");


  updateHUD();


  if (
    GameState.currentScene &&
    Scenes[GameState.currentScene]
  ) {

    loadScene(
      Scenes[
        GameState.currentScene
      ]
    );
  }
}


/* ========================================= */
/* CHARACTER SELECTION */
/* ========================================= */

document
  .querySelectorAll(".character-card")
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".character-card")
          .forEach(
            (item) =>
              item.classList.remove("selected")
          );


        card.classList.add("selected");


        GameState.player.character =
          card.dataset.character;
      }
    );
  });


document
  .querySelectorAll(".outfit-card")
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".outfit-card")
          .forEach(
            (item) =>
              item.classList.remove("selected")
          );


        card.classList.add("selected");


        GameState.player.outfit =
          card.dataset.outfit;
      }
    );
  });


/* ========================================= */
/* BUTTON EVENTS */
/* ========================================= */

document
  .getElementById("newGameBtn")
  .addEventListener(
    "click",
    () => {

      showScreen("character");
    }
  );


document
  .getElementById("continueBtn")
  .addEventListener(
    "click",
    () => {

      loadGame();
    }
  );


document
  .getElementById("continueWorldBtn")
  .addEventListener(
    "click",
    () => {

      const name =
        playerNameInput.value.trim();


      GameState.player.name =
        name ||
        "Adventurer";


      showScreen("world");
    }
  );


document
  .querySelectorAll(".world-card")
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        const world =
          card.dataset.world;


        showScreen("game");


        if (world === "forest") {

          loadScene(
            Scenes.forestStart
          );
        }


        else if (world === "ruins") {

          loadScene(
            Scenes.palaceArrival
          );
        }


        else if (world === "desert") {

          loadScene(
            Scenes.witchEncounter
          );
        }


        else if (world === "mountains") {

          loadScene(
            Scenes.mountainKingdom
          );
        }


        unlockAchievement(
          "Entered a New Realm"
        );
      }
    );
  });


document
  .getElementById("voiceBtn")
  .addEventListener(
    "click",
    () => {

      GameState.voiceEnabled =
        !GameState.voiceEnabled;


      document
        .getElementById("voiceBtn")
        .textContent =
        GameState.voiceEnabled
          ? "🔊"
          : "🔇";


      if (
        !GameState.voiceEnabled
      ) {

        window.speechSynthesis.cancel();
      }
    }
  );


document
  .getElementById("saveBtn")
  .addEventListener(
    "click",
    saveGame
  );


document
  .querySelectorAll(".hud-menu-btn")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        openPanel(
          button.dataset.panel
        );
      }
    );
  });


document
  .getElementById("closeModal")
  .addEventListener(
    "click",
    () => {

      modal.classList.remove("show");
    }
  );


modal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === modal
    ) {

      modal.classList.remove("show");
    }
  }
);


/* ========================================= */
/* INITIALIZE */
/* ========================================= */

createParticles();

updateHUD();
