/* =========================================================
   MYSTIC REALMS
   WORKING GAME ENGINE
   Matched specifically to the provided index.html
========================================================= */


/* =========================================================
   SAFE ELEMENT HELPER
========================================================= */

function getElement(id) {
  return document.getElementById(id);
}


/* =========================================================
   GAME STATE
========================================================= */

const GameState = {
  player: {
    name: "Adventurer",
    character: "female",
    outfit: "Sky Royal",
    courage: 80,
    magic: 50,
    location: "Unknown Realm"
  },

  inventory: [],
  clues: [],
  achievements: [],

  companion: null,
  companionTrust: 50,

  currentScene: null,

  voiceEnabled: true
};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const screens = {
  start: getElement("startScreen"),
  character: getElement("characterScreen"),
  world: getElement("worldScreen"),
  game: getElement("gameScreen")
};

const playerNameInput = getElement("playerName");

const choicesContainer = getElement("choices");

const dialogueText = getElement("dialogueText");
const speakerName = getElement("speakerName");
const speakerRole = getElement("speakerRole");
const speakerIcon = getElement("speakerIcon");

const sceneTitle = getElement("sceneTitle");
const chapterLabel = getElement("chapterLabel");
const worldSymbol = getElement("worldSymbol");

const hudPlayerName = getElement("hudPlayerName");
const hudLocation = getElement("hudLocation");
const playerAvatar = getElement("playerAvatar");

const courageBar = getElement("courageBar");
const magicBar = getElement("magicBar");

const mysteryProgress = getElement("mysteryProgress");

const activeCompanion = getElement("activeCompanion");
const companionStatus = getElement("companionStatus");

const eventMessage = getElement("eventMessage");

const modal = getElement("modal");
const modalTitle = getElement("modalTitle");
const modalBody = getElement("modalBody");

const achievementToast = getElement("achievementToast");
const achievementText = getElement("achievementText");


/* =========================================================
   SCREEN NAVIGATION
========================================================= */

function showScreen(screenName) {

  Object.values(screens).forEach((screen) => {
    if (screen) {
      screen.classList.remove("active");
    }
  });

  if (screens[screenName]) {
    screens[screenName].classList.add("active");
  }
}


/* =========================================================
   PARTICLE SYSTEM
========================================================= */

function createParticles() {

  const container = getElement("particles");

  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < 55; i++) {

    const particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    particle.style.animationDuration =
      8 + Math.random() * 15 + "s";

    particle.style.animationDelay =
      Math.random() * 10 + "s";

    particle.style.opacity =
      Math.random();

    container.appendChild(particle);
  }
}


/* =========================================================
   VOICE SYSTEM
========================================================= */

function speak(text, type = "normal") {

  if (!GameState.voiceEnabled) return;

  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(text);

  speech.volume = 0.9;

  switch (type) {

    case "queen":
      speech.rate = 0.88;
      speech.pitch = 1.05;
      break;

    case "fairy":
      speech.rate = 0.95;
      speech.pitch = 1.35;
      break;

    case "robot":
      speech.rate = 1.05;
      speech.pitch = 1.15;
      break;

    case "witch":
      speech.rate = 0.72;
      speech.pitch = 0.75;
      break;

    case "ghost":
      speech.rate = 0.70;
      speech.pitch = 0.85;
      break;

    case "guardian":
      speech.rate = 0.80;
      speech.pitch = 0.65;
      break;

    default:
      speech.rate = 0.9;
      speech.pitch = 1;
  }

  window.speechSynthesis.speak(speech);
}


/* =========================================================
   UPDATE HUD
========================================================= */

function updateHUD() {

  if (hudPlayerName) {
    hudPlayerName.textContent =
      GameState.player.name;
  }

  if (hudLocation) {
    hudLocation.textContent =
      GameState.player.location;
  }

  if (playerAvatar) {
    playerAvatar.textContent =
      GameState.player.character === "female"
        ? "👸"
        : "🤴";
  }

  if (courageBar) {
    courageBar.style.width =
      GameState.player.courage + "%";
  }

  if (magicBar) {
    magicBar.style.width =
      GameState.player.magic + "%";
  }

  if (mysteryProgress) {
    mysteryProgress.textContent =
      Clues discovered: ${GameState.clues.length};
  }

  if (GameState.companion) {

    if (activeCompanion) {
      activeCompanion.textContent =
        GameState.companion.name;
    }

    if (companionStatus) {
      companionStatus.textContent =
        GameState.companion.description;
    }

  } else {

    if (activeCompanion) {
      activeCompanion.textContent = "None";
    }

    if (companionStatus) {
      companionStatus.textContent =
        "You are travelling alone.";
    }
  }
}


/* =========================================================
   EVENT MESSAGE
========================================================= */

let eventTimer;

function showEvent(message) {

  if (!eventMessage) return;

  clearTimeout(eventTimer);

  eventMessage.textContent = message;

  eventTimer = setTimeout(() => {
    eventMessage.textContent = "";
  }, 4000);
}


/* =========================================================
   INVENTORY
========================================================= */

function addItem(icon, name, description) {

  const exists =
    GameState.inventory.some(
      (item) => item.name === name
    );

  if (!exists) {

    GameState.inventory.push({
      icon,
      name,
      description
    });

    showEvent(
      ${icon} Added to inventory: ${name}
    );
  }
}


/* =========================================================
   CLUES
========================================================= */

function addClue(name) {

  if (!GameState.clues.includes(name)) {

    GameState.clues.push(name);

    showEvent(
      🔍 New clue discovered: ${name}
    );
  }

  updateHUD();
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function unlockAchievement(name) {

  if (GameState.achievements.includes(name)) {
    return;
  }

  GameState.achievements.push(name);

  if (achievementText) {
    achievementText.textContent = name;
  }

  if (achievementToast) {

    achievementToast.classList.add("show");

    setTimeout(() => {
      achievementToast.classList.remove("show");
    }, 4500);
  }
}


/* =========================================================
   COMPANIONS
========================================================= */

function setCompanion(companion) {

  GameState.companion = companion;

  updateHUD();

  unlockAchievement(
    Companion Joined: ${companion.name}
  );
}


/* =========================================================
   RANDOM MYSTERY EVENT
========================================================= */

function randomEvent() {

  const chance = Math.random();

  if (chance < 0.15) {

    GameState.player.magic =
      Math.min(
        100,
        GameState.player.magic + 5
      );

    showEvent(
      "✨ A mysterious energy increases your magic."
    );

  }

  else if (chance < 0.30) {

    GameState.player.courage =
      Math.max(
        0,
        GameState.player.courage - 5
      );

    showEvent(
      "🌫️ Something moves in the darkness..."
    );

  }

  else if (chance < 0.45) {

    showEvent(
      "👣 You hear footsteps behind you..."
    );
  }

  updateHUD();
}


/* =========================================================
   LOAD SCENE
========================================================= */

function loadScene(scene) {

  if (!scene) return;

  GameState.currentScene = scene.id;

  GameState.player.location =
    scene.location;

  if (chapterLabel) {
    chapterLabel.textContent =
      scene.chapter;
  }

  if (sceneTitle) {
    sceneTitle.textContent =
      scene.title;
  }

  if (worldSymbol) {
    worldSymbol.textContent =
      scene.symbol;
  }

  if (speakerName) {
    speakerName.textContent =
      scene.speaker.name;
  }

  if (speakerRole) {
    speakerRole.textContent =
      scene.speaker.role;
  }

  if (speakerIcon) {
    speakerIcon.textContent =
      scene.speaker.icon;
  }

  if (dialogueText) {
    dialogueText.textContent =
      scene.text;
  }

  if (choicesContainer) {

    choicesContainer.innerHTML = "";

    scene.choices.forEach((choice) => {

      const button =
        document.createElement("button");

      button.className = "choice-btn";

      button.textContent =
        choice.text;

      button.addEventListener(
        "click",
        () => {

          if (choice.action) {
            choice.action();
          }

          updateHUD();

          if (choice.next) {
            loadScene(
              Scenes[choice.next]
            );
          }
        }
      );

      choicesContainer.appendChild(button);
    });
  }

  updateHUD();

  speak(
    scene.text,
    scene.speaker.voice
  );

  randomEvent();
}


/* =========================================================
   STORY SCENES
========================================================= */

const Scenes = {


  forestStart: {

    id: "forestStart",

    chapter: "CHAPTER ONE",

    title: "The Whispering Forest",

    location: "Whispering Forest",

    symbol: "🌲",

    speaker: {
      name: "The Forest",
      role: "An Ancient Presence",
      icon: "🌲",
      voice: "ghost"
    },

    text:
      "The trees stand silent as you enter. A cold wind passes through the forest, carrying a whisper that sounds almost like your name.",

    choices: [

      {
        text:
          "Follow the whisper deeper into the forest.",
        next:
          "forestWhisper"
      },

      {
        text:
          "Search the ground for clues.",
        action: () => {

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
          "forestWhisper"
      }
    ]
  },


  forestWhisper: {

    id: "forestWhisper",

    chapter: "CHAPTER ONE",

    title: "Someone Is Watching",

    location: "Whispering Forest",

    symbol: "👣",

    speaker: {
      name: "Unknown Voice",
      role: "Hidden in the Shadows",
      icon: "🌫️",
      voice: "ghost"
    },

    text:
      "Stop. Do not take another step. The path ahead is not the path you think it is.",

    choices: [

      {
        text:
          "Ask who is speaking.",
        next:
          "companionArrival"
      },

      {
        text:
          "Ignore the voice and continue.",
        action: () => {

          GameState.player.courage =
            Math.max(
              0,
              GameState.player.courage - 10
            );
        },
        next:
          "darkForest"
      }
    ]
  },


  companionArrival: {

    id: "companionArrival",

    chapter: "CHAPTER TWO",

    title: "The Dimensional Companion",

    location: "Whispering Forest",

    symbol: "🤖",

    speaker: {
      name: "NOVA",
      role: "Dimensional Guide",
      icon: "🤖",
      voice: "robot"
    },

    text:
      "My name is NOVA. I have been searching for the one connected to the Lost Crown. My sensors suggest that might be you.",

    choices: [

      {
        text:
          "Allow NOVA to join your journey.",

        action: () => {

          setCompanion({
            name: "NOVA",
            description:
              "A cheerful dimensional guide with mysterious gadgets.",
            type: "robot"
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
          "crownClue"
      },

      {
        text:
          "Tell NOVA you do not trust anyone yet.",

        action: () => {
          GameState.companionTrust = 30;
        },

        next:
          "crownClue"
      }
    ]
  },


  darkForest: {

    id: "darkForest",

    chapter: "CHAPTER TWO",

    title: "The Darkness Moves",

    location: "Forbidden Forest",

    symbol: "🌑",

    speaker: {
      name: "Narrator",
      role: "The Ancient Voice",
      icon: "🌙",
      voice: "guardian"
    },

    text:
      "The light disappears. For several seconds, you cannot see anything. Then you hear breathing behind you.",

    choices: [

      {
        text: "Turn around.",
        next: "companionArrival"
      },

      {
        text:
          "Run toward the distant light.",

        action: () => {

          GameState.player.courage =
            Math.min(
              100,
              GameState.player.courage + 5
            );
        },

        next:
          "crownClue"
      }
    ]
  },


  crownClue: {

    id: "crownClue",

    chapter: "CHAPTER THREE",

    title: "The Lost Crown",

    location: "Ancient Clearing",

    symbol: "👑",

    speaker: {
      name: "NOVA",
      role: "Dimensional Guide",
      icon: "🤖",
      voice: "robot"
    },

    text:
      "I have discovered something unusual. The Lost Crown is not simply an object. Every realm appears to be hiding one part of its history.",

    choices: [

      {
        text:
          "Search for the Crown's first clue.",

        action: () => {

          addClue(
            "Crown Symbol in the Forest"
          );

          unlockAchievement(
            "First Mystery Discovered"
          );
        },

        next:
          "portalChoice"
      },

      {
        text:
          "Ask NOVA to open the Dimensional Gateway.",

        next:
          "portalChoice"
      }
    ]
  },


  portalChoice: {

    id: "portalChoice",

    chapter: "CHAPTER FOUR",

    title: "The Portals Respond",

    location: "Crossroads Between Worlds",

    symbol: "🌌",

    speaker: {
      name: "NOVA",
      role: "Dimensional Guide",
      icon: "🤖",
      voice: "robot"
    },

    text:
      "Four unstable signals are appearing. Each one leads toward another mystery. The decision is yours.",

    choices: [

      {
        text: "Enter the Frozen Mountains.",
        next: "mountainKingdom"
      },

      {
        text: "Enter the Forgotten Palace.",
        next: "palaceArrival"
      },

      {
        text: "Enter the Witch Territory.",
        next: "witchEncounter"
      },

      {
        text: "Enter the Dream Realm.",
        next: "dreamRealm"
      }
    ]
  },


  mountainKingdom: {

    id: "mountainKingdom",

    chapter: "CHAPTER FIVE",

    title: "The Crystal Kingdom",

    location: "Frozen Mountains",

    symbol: "❄️",

    speaker: {
      name: "Queen Aurelia",
      role: "Guardian of the Crystal Kingdom",
      icon: "👑",
      voice: "queen"
    },

    text:
      "Welcome, traveler. The mountains have carried your name long before you arrived. Before entering my kingdom, tell me what you seek.",

    choices: [

      {
        text:
          "Tell the Queen about the Lost Crown.",

        action: () => {

          addClue(
            "The Queen Knows About the Crown"
          );

          unlockAchievement(
            "Entered the Crystal Kingdom"
          );
        },

        next:
          "royalDecision"
      },

      {
        text:
          "Say that you do not yet know whom to trust.",

        next:
          "royalDecision"
      }
    ]
  },


  palaceArrival: {

    id: "palaceArrival",

    chapter: "CHAPTER FIVE",

    title: "The Palace That Remembers",

    location: "Forgotten Palace",

    symbol: "🏰",

    speaker: {
      name: "The Palace",
      role: "Living Architecture",
      icon: "🏰",
      voice: "ghost"
    },

    text:
      "The palace doors open without anyone touching them. Inside, hundreds of portraits turn toward you at the same time.",

    choices: [

      {
        text:
          "Inspect the portraits.",

        action: () => {

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
          "royalDecision"
      },

      {
        text:
          "Search for the royal dining hall.",

        next:
          "royalDecision"
      }
    ]
  },


  witchEncounter: {

    id: "witchEncounter",

    chapter: "CHAPTER FIVE",

    title: "The Witch's Warning",

    location: "Witch Territory",

    symbol: "🧙",

    speaker: {
      name: "MORVA",
      role: "Keeper of Forbidden Knowledge",
      icon: "🧙",
      voice: "witch"
    },

    text:
      "You seek the Crown, yet you do not understand what it will awaken. Some mysteries were hidden for a reason.",

    choices: [

      {
        text:
          "Ask what the Crown will awaken.",

        action: () => {

          addClue(
            "The Crown Can Awaken Something Ancient"
          );
        },

        next:
          "royalDecision"
      },

      {
        text:
          "Refuse to trust the Witch.",

        action: () => {

          GameState.player.courage =
            Math.min(
              100,
              GameState.player.courage + 10
            );
        },

        next:
          "royalDecision"
      }
    ]
  },


  royalDecision: {

    id: "royalDecision",

    chapter: "CHAPTER SIX",

    title: "The Truth Approaches",

    location: "The Royal Crossroads",

    symbol: "👑",

    speaker: {
      name: "Narrator",
      role: "The Ancient Voice",
      icon: "🌙",
      voice: "guardian"
    },

    text:
      "Every clue is beginning to connect. The Crown is calling, the kingdoms are watching, and someone who helped you may still be hiding the truth.",

    choices: [

      {
        text:
          "Trust your companion and continue.",

        action: () => {

          GameState.companionTrust += 20;

          unlockAchievement(
            "Trust Is a Choice"
          );
        },

        next:
          "finalMystery"
      },

      {
        text:
          "Continue alone and trust nobody.",

        action: () => {

          GameState.companionTrust -= 20;

          GameState.player.courage =
            Math.min(
              100,
              GameState.player.courage + 10
            );
        },

        next:
          "finalMystery"
      }
    ]
  },


  finalMystery: {

    id: "finalMystery",

    chapter: "CHAPTER SEVEN",

    title: "The Crown Awakens",

    location: "The Hidden Throne",

    symbol: "👑",

    speaker: {
      name: "The Crown",
      role: "An Ancient Power",
      icon: "👑",
      voice: "guardian"
    },

    text:
      "At last, you have reached the truth. The Crown was never waiting for a ruler. It was waiting for someone capable of choosing what kind of world should exist.",

    choices: [

      {
        text:
          "Protect the kingdoms.",

        action: () => {

          unlockAchievement(
            "Guardian of the Realms"
          );

          showEnding(
            "THE GUARDIAN ENDING",
            "You choose to protect the kingdoms. The Crown recognizes your courage and the portals begin to close peacefully."
          );
        }
      },

      {
        text:
          "Discover the Crown's full power.",

        action: () => {

          unlockAchievement(
            "The Forbidden Choice"
          );

          showEnding(
            "THE MYSTERY ENDING",
            "You reach toward the Crown's hidden power. The world fades into silence, and somewhere beyond the throne, another door opens."
          );
        }
      }
    ]
  }
};


/* =========================================================
   ENDING
========================================================= */

function showEnding(title, text) {

  speak(text, "guardian");

  if (sceneTitle) {
    sceneTitle.textContent = title;
  }

  if (chapterLabel) {
    chapterLabel.textContent =
      "YOUR DESTINY";
  }

  if (speakerName) {
    speakerName.textContent =
      "Mystic Realms";
  }

  if (speakerRole) {
    speakerRole.textContent =
      "Journey Complete... For Now";
  }

  if (speakerIcon) {
    speakerIcon.textContent = "✨";
  }

  if (dialogueText) {
    dialogueText.textContent = text;
  }

  if (choicesContainer) {

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
  }

  GameState.player.location = title;

  updateHUD();

  saveGame();
}


/* =========================================================
   MODAL PANELS
========================================================= */

function openPanel(panel) {

  if (!modal || !modalTitle || !modalBody) {
    return;
  }

  modal.classList.add("show");


  if (panel === "inventory") {

    modalTitle.textContent =
      "🎒 Mystical Inventory";

    modalBody.innerHTML =
      GameState.inventory.length
        ? GameState.inventory
            .map(
              (item) => `
                <div class="item-row">
                  <strong>
                    ${item.icon} ${item.name}
                  </strong>
                  <p>${item.description}</p>
                </div>
              `
            )
            .join("")
        : "<p>Your inventory is empty.</p>";
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

    modalBody.innerHTML =
      GameState.companion
        ? `
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
        `
        : `
          <p>
            You are currently travelling alone.
          </p>
        `;
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


/* =========================================================
   SAVE GAME
========================================================= */

function saveGame() {

  try {

    localStorage.setItem(
      "mysticRealmsSave",
      JSON.stringify(GameState)
    );

    showEvent(
      "💾 Journey saved successfully."
    );

  } catch (error) {

    console.error(error);

    showEvent(
      "⚠️ Unable to save the journey."
    );
  }
}


/* =========================================================
   LOAD GAME
========================================================= */

function loadGame() {

  try {

    const saved =
      localStorage.getItem(
        "mysticRealmsSave"
      );

    if (!saved) {

      showEvent(
        "No saved journey was found."
      );

      return;
    }

    const savedState =
      JSON.parse(saved);

    Object.assign(
      GameState,
      savedState
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

  } catch (error) {

    console.error(error);

    showEvent(
      "⚠️ Saved journey could not be loaded."
    );
  }
}


/* =========================================================
   CHARACTER SELECTION
========================================================= */

document
  .querySelectorAll(".character-card")
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".character-card"
          )
          .forEach((item) => {

            item.classList.remove(
              "selected"
            );
          });

        card.classList.add(
          "selected"
        );

        GameState.player.character =
          card.dataset.character;
      }
    );
  });


/* =========================================================
   OUTFIT SELECTION
========================================================= */

document
  .querySelectorAll(".outfit-card")
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".outfit-card"
          )
          .forEach((item) => {

            item.classList.remove(
              "selected"
            );
          });

        card.classList.add(
          "selected"
        );

        GameState.player.outfit =
          card.dataset.outfit;
      }
    );
  });


/* =========================================================
   NEW GAME BUTTON
========================================================= */

const newGameBtn =
  getElement("newGameBtn");

if (newGameBtn) {

  newGameBtn.addEventListener(
    "click",
    () => {

      showScreen("character");
    }
  );
}


/* =========================================================
   CONTINUE GAME BUTTON
========================================================= */

const continueBtn =
  getElement("continueBtn");

if (continueBtn) {

  continueBtn.addEventListener(
    "click",
    () => {

      loadGame();
    }
  );
}


/* =========================================================
   CONTINUE TO WORLDS
========================================================= */

const continueWorldBtn =
  getElement("continueWorldBtn");

if (continueWorldBtn) {

  continueWorldBtn.addEventListener(
    "click",
    () => {

      const name =
        playerNameInput
          ? playerNameInput.value.trim()
          : "";

      GameState.player.name =
        name || "Adventurer";

      showScreen("world");
    }
  );
}


/* =========================================================
   WORLD SELECTION
========================================================= */

document
  .querySelectorAll(".world-card")
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        const world =
          card.dataset.world;

        showScreen("game");

        unlockAchievement(
          "Entered a New Realm"
        );

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
      }
    );
  });


/* =========================================================
   VOICE BUTTON
========================================================= */

const voiceBtn =
  getElement("voiceBtn");

if (voiceBtn) {

  voiceBtn.addEventListener(
    "click",
    () => {

      GameState.voiceEnabled =
        !GameState.voiceEnabled;

      voiceBtn.textContent =
        GameState.voiceEnabled
          ? "🔊"
          : "🔇";

      if (!GameState.voiceEnabled) {

        if (
          "speechSynthesis" in window
        ) {
          window
            .speechSynthesis
            .cancel();
        }
      }
    }
  );
}


/* =========================================================
   SAVE BUTTON
========================================================= */

const saveBtn =
  getElement("saveBtn");

if (saveBtn) {

  saveBtn.addEventListener(
    "click",
    saveGame
  );
}


/* =========================================================
   HUD PANEL BUTTONS
========================================================= */

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


/* =========================================================
   CLOSE MODAL
========================================================= */

const closeModal =
  getElement("closeModal");

if (closeModal) {

  closeModal.addEventListener(
    "click",
    () => {

      if (modal) {
        modal.classList.remove("show");
      }
    }
  );
}


if (modal) {

  modal.addEventListener(
    "click",
    (event) => {

      if (event.target === modal) {
        modal.classList.remove("show");
      }
    }
  );
}


/* =========================================================
   INITIALIZE GAME
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    createParticles();

    updateHUD();

    console.log(
      "Mystic Realms Game Engine Loaded Successfully!"
    );
  }
);
