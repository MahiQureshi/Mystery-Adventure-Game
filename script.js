/* =========================================
   MYSTIC REALMS - GAME ENGINE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     GAME STATE
  ========================================= */

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


  /* =========================================
     DOM ELEMENTS
  ========================================= */

  const screens = {
    start: document.getElementById("startScreen"),
    character: document.getElementById("characterScreen"),
    world: document.getElementById("worldScreen"),
    game: document.getElementById("gameScreen")
  };

  const playerNameInput = document.getElementById("playerName");
  const choicesContainer = document.getElementById("choices");
  const dialogueText = document.getElementById("dialogueText");
  const speakerName = document.getElementById("speakerName");
  const speakerRole = document.getElementById("speakerRole");
  const speakerIcon = document.getElementById("speakerIcon");
  const sceneTitle = document.getElementById("sceneTitle");
  const chapterLabel = document.getElementById("chapterLabel");
  const worldSymbol = document.getElementById("worldSymbol");

  const hudPlayerName = document.getElementById("hudPlayerName");
  const hudLocation = document.getElementById("hudLocation");
  const playerAvatar = document.getElementById("playerAvatar");

  const courageBar = document.getElementById("courageBar");
  const magicBar = document.getElementById("magicBar");

  const mysteryProgress = document.getElementById("mysteryProgress");

  const activeCompanion = document.getElementById("activeCompanion");
  const companionStatus = document.getElementById("companionStatus");

  const eventMessage = document.getElementById("eventMessage");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  const achievementToast =
    document.getElementById("achievementToast");

  const achievementText =
    document.getElementById("achievementText");


  /* =========================================
     SCREEN NAVIGATION
  ========================================= */

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


  /* =========================================
     PARTICLES
  ========================================= */

  function createParticles() {

    const container =
      document.getElementById("particles");

    if (!container) return;

    container.innerHTML = "";

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


  /* =========================================
     VOICE SYSTEM
  ========================================= */

  function speak(text, type = "normal") {

    if (!GameState.voiceEnabled) return;

    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.volume = 0.9;

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


  /* =========================================
     UPDATE HUD
  ========================================= */

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


  /* =========================================
     EVENTS
  ========================================= */

  function showEvent(message) {

    if (!eventMessage) return;

    eventMessage.textContent = message;

    setTimeout(() => {
      eventMessage.textContent = "";
    }, 4000);
  }


  /* =========================================
     INVENTORY
  ========================================= */

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


  /* =========================================
     CLUES
  ========================================= */

  function addClue(name) {

    if (!GameState.clues.includes(name)) {

      GameState.clues.push(name);

      showEvent(
        🔍 New clue discovered: ${name}
      );
    }

    updateHUD();
  }


  /* =========================================
     ACHIEVEMENTS
  ========================================= */

  function unlockAchievement(name) {

    if (
      GameState.achievements.includes(name)
    ) {
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


  /* =========================================
     COMPANION
  ========================================= */

  function setCompanion(companion) {

    GameState.companion = companion;

    updateHUD();

    unlockAchievement(
      Companion Joined: ${companion.name}
    );
  }


  /* =========================================
     RANDOM EVENT
  ========================================= */

  function randomEvent() {

    const chance = Math.random();

    if (chance < 0.20) {

      GameState.player.magic =
        Math.min(
          100,
          GameState.player.magic + 5
        );

      showEvent(
        "✨ Mysterious energy increases your magic."
      );
    }

    else if (chance < 0.35) {

      GameState.player.courage =
        Math.max(
          0,
          GameState.player.courage - 5
        );

      showEvent(
        "🌫️ Something moves in the darkness..."
      );
    }

    updateHUD();
  }


  /* =========================================
     SCENE LOADER
  ========================================= */

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

            if (
              choice.next &&
              Scenes[choice.next]
            ) {
              loadScene(
                Scenes[choice.next]
              );
            }
          }
        );

        choicesContainer.appendChild(
          button
        );
      });
    }

    updateHUD();

    speak(
      scene.text,
      scene.speaker.voice
    );

    randomEvent();
  }


  /* =========================================
     STORY SCENES
  ========================================= */

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

      chapter: "CHAPTER TWO",

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
          text: "Ask who is speaking.",
          next: "companionArrival"
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

            updateHUD();
          },

          next: "darkForest"
        }
      ]
    },


    companionArrival: {

      id: "companionArrival",

      chapter: "CHAPTER THREE",

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
                "A dimensional guide carrying mysterious gadgets."
            });

            addItem(
              "🚪",
              "Dimensional Gateway",
              "A device capable of opening portals."
            );

            addItem(
              "🔦",
              "Adaptive Light",
              "Reveals hidden symbols."
            );
          },

          next: "crownClue"
        },

        {
          text:
            "Tell NOVA you do not trust anyone yet.",

          action: () => {
            GameState.companionTrust = 30;
          },

          next: "crownClue"
        }
      ]
    },


    darkForest: {

      id: "darkForest",

      chapter: "CHAPTER THREE",

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

            updateHUD();
          },

          next: "crownClue"
        }
      ]
    },


    crownClue: {

      id: "crownClue",

      chapter: "CHAPTER FOUR",

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
        "The Lost Crown is not simply an object. Every realm appears to be hiding one part of its history.",

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

          next: "portalChoice"
        },

        {
          text:
            "Ask NOVA to open the Dimensional Gateway.",

          next: "portalChoice"
        }
      ]
    },


    portalChoice: {

      id: "portalChoice",

      chapter: "CHAPTER FIVE",

      title: "The Portals Respond",

      location:
        "Crossroads Between Worlds",

      symbol: "🌌",

      speaker: {
        name: "NOVA",
        role: "Dimensional Guide",
        icon: "🤖",
        voice: "robot"
      },

      text:
        "Four unstable portals are appearing. Each one leads toward another mystery. The decision is yours.",

      choices: [

        {
          text:
            "Enter the Frozen Mountains.",
          next:
            "mountainKingdom"
        },

        {
          text:
            "Enter the Forgotten Palace.",
          next:
            "palaceArrival"
        },

        {
          text:
            "Enter the Witch Territory.",
          next:
            "witchEncounter"
        },

        {
          text:
            "Enter the Dream Realm.",
          next:
            "dreamRealm"
        }
      ]
    },


    mountainKingdom: {

      id: "mountainKingdom",

      chapter: "CHAPTER SIX",

      title: "The Crystal Kingdom",

      location: "Frozen Mountains",

      symbol: "❄️",

      speaker: {
        name: "Queen Aurelia",
        role:
          "Guardian of the Crystal Kingdom",
        icon: "👑",
        voice: "queen"
      },

      text:
        "Welcome, traveler. The mountains have carried your name long before you arrived.",

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

          next: "finalMystery"
        },

        {
          text:
            "Ask the Queen for help.",

          next: "finalMystery"
        }
      ]
    },


    palaceArrival: {

      id: "palaceArrival",

      chapter: "CHAPTER SIX",

      title:
        "The Palace That Remembers",

      location:
        "Forgotten Palace",

      symbol: "🏰",

      speaker: {
        name: "The Palace",
        role: "Living Architecture",
        icon: "🏰",
        voice: "ghost"
      },

      text:
        "The palace doors open without anyone touching them. Hundreds of portraits turn toward you.",

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
              "Reflects memories instead of faces."
            );
          },

          next: "finalMystery"
        },

        {
          text:
            "Enter the royal hall.",

          next: "finalMystery"
        }
      ]
    },


    witchEncounter: {

      id: "witchEncounter",

      chapter: "CHAPTER SIX",

      title:
        "The Witch's Warning",

      location:
        "Witch Territory",

      symbol: "🧙",

      speaker: {
        name: "MORVA",
        role:
          "Keeper of Forbidden Knowledge",
        icon: "🧙",
        voice: "witch"
      },

      text:
        "You seek the Crown, yet you do not understand what it will awaken.",

      choices: [

        {
          text:
            "Ask what the Crown will awaken.",

          action: () => {

            addClue(
              "The Crown Can Awaken Something Ancient"
            );
          },

          next: "finalMystery"
        },

        {
          text:
            "Refuse to trust the Witch.",

          next: "finalMystery"
        }
      ]
    },


    dreamRealm: {

      id: "dreamRealm",

      chapter: "CHAPTER SIX",

      title:
        "A World That Should Not Exist",

      location:
        "Dream Realm",

      symbol: "🌠",

      speaker: {
        name: "LYRA",
        role:
          "Fairy of Forgotten Paths",
        icon: "🧚",
        voice: "fairy"
      },

      text:
        "You are dreaming, but the choices you make here will follow you when you wake.",

      choices: [

        {
          text:
            "Ask LYRA to guide you.",

          action: () => {

            setCompanion({
              name: "LYRA",
              description:
                "A gentle fairy who reveals hidden paths."
            });

            GameState.player.magic =
              Math.min(
                100,
                GameState.player.magic + 20
              );

            updateHUD();
          },

          next: "finalMystery"
        },

        {
          text:
            "Explore alone.",

          next:
            "finalMystery"
        }
      ]
    },


    finalMystery: {

      id: "finalMystery",

      chapter:
        "CHAPTER SEVEN",

      title:
        "The Crown Awakens",

      location:
        "The Hidden Throne",

      symbol: "👑",

      speaker: {
        name:
          "The Crown",

        role:
          "An Ancient Power",

        icon:
          "👑",

        voice:
          "guardian"
      },

      text:
        "The Crown was never waiting for a ruler. It was waiting for someone capable of choosing what kind of world should exist.",

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
              "You choose to protect the kingdoms. The portals close peacefully, and your name becomes a legend."
            );
          }
        },

        {
          text:
            "Discover the Crown's full power.",

          action: () => {

            unlockAchievement(
              "The FORBIDDEN CHOICE"
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


  /* =========================================
     ENDING
  ========================================= */

  function showEnding(title, text) {

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
        "Journey Complete";
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

    speak(text, "guardian");

    saveGame();
  }


  /* =========================================
     MODAL PANELS
  ========================================= */

  function openPanel(panel) {

    if (!modal) return;

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
                    <p>
                      ${item.description}
                    </p>
                  </div>
                `
              )
              .join("")

          : "<p>Your inventory is empty.</p>";
    }


    else if (panel === "journal") {

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


    else if (panel === "companions") {

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


    else if (panel === "achievements") {

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


  /* =========================================
     SAVE GAME
  ========================================= */

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

      console.error(
        "Save error:",
        error
      );
    }
  }


  /* =========================================
     LOAD GAME
  ========================================= */

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

    try {

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

      console.error(
        "Load error:",
        error
      );

      alert(
        "Saved game could not be loaded."
      );
    }
  }


  /* =========================================
     CHARACTER SELECTION
  ========================================= */

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

          updateHUD();
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


  /* =========================================
     MAIN BUTTON EVENTS
  ========================================= */

  const newGameBtn =
    document.getElementById(
      "newGameBtn"
    );

  if (newGameBtn) {

    newGameBtn.addEventListener(
      "click",
      () => {

        console.log(
          "New Game button clicked"
        );

        showScreen("character");
      }
    );
  }


  const continueBtn =
    document.getElementById(
      "continueBtn"
    );

  if (continueBtn) {

    continueBtn.addEventListener(
      "click",
      loadGame
    );
  }


  const continueWorldBtn =
    document.getElementById(
      "continueWorldBtn"
    );

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


  /* =========================================
     WORLD SELECTION
  ========================================= */

  document
    .querySelectorAll(".world-card")
    .forEach((card) => {

      card.addEventListener(
        "click",
        () => {

          const world =
            card.dataset.world;

          showScreen("game");

          if (
            world === "forest"
          ) {

            loadScene(
              Scenes.forestStart
            );
          }

          else if (
            world === "ruins"
          ) {

            loadScene(
              Scenes.palaceArrival
            );
          }

          else if (
            world === "desert"
          ) {

            loadScene(
              Scenes.witchEncounter
            );
          }

          else if (
            world === "mountains"
          ) {

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


  /* =========================================
     VOICE BUTTON
  ========================================= */

  const voiceBtn =
    document.getElementById(
      "voiceBtn"
    );

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

        if (
          !GameState.voiceEnabled &&
          "speechSynthesis" in window
        ) {

          window
            .speechSynthesis
            .cancel();
        }
      }
    );
  }


  /* =========================================
     SAVE BUTTON
  ========================================= */

  const saveBtn =
    document.getElementById(
      "saveBtn"
    );

  if (saveBtn) {

    saveBtn.addEventListener(
      "click",
      saveGame
    );
  }


  /* =========================================
     HUD PANEL BUTTONS
  ========================================= */

  document
    .querySelectorAll(
      ".hud-menu-btn"
    )
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


  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeModal =
    document.getElementById(
      "closeModal"
    );

  if (closeModal) {

    closeModal.addEventListener(
      "click",
      () => {

        modal.classList.remove(
          "show"
        );
      }
    );
  }


  if (modal) {

    modal.addEventListener(
      "click",
      (event) => {

        if (
          event.target === modal
        ) {

          modal.classList.remove(
            "show"
          );
        }
      }
    );
  }


  /* =========================================
     INITIALIZE GAME
  ========================================= */

  console.log(
    "Mystic Realms JavaScript Loaded Successfully"
  );

  createParticles();

  updateHUD();

});
