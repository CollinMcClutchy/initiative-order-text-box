Hooks.on('init', setup);


Hooks.on("renderCombatTracker", (app, html, data) => {
    // Opt out for replacing initiative roll with input field
    if (game.settings.get("initiative-order-text-box", "initiativeInputField")) {
        const currentCombat = data.combats[data.currentIndex - 1];
        if (currentCombat) {
            html.find(".combatant").each((i, el) => {
                const combId = el.dataset.combatantId;
                const combatant = currentCombat.data.combatants.find((c) => c._id === combId);
                const initDiv = el.getElementsByClassName("token-initiative")[0];
                const min = game.settings.get("reverse-initiative-order", "min");
                const max = game.settings.get("reverse-initiative-order", "max");
                const initiative = combatant.initiative || "";
                const readOnly = combatant.actor.owner ? "" : "readonly";
                initDiv.innerHTML = `<input type="number" min="${min}" max="${max}" ${readOnly} value="${initiative}">`;

                initDiv.addEventListener("change", async (e) => {
                    const inputElement = e.target;
                    const combatantId = inputElement.closest("[data-combatant-id]").dataset.combatantId;
                    await currentCombat.setInitiative(combatantId, inputElement.value);
                });
            });
        }
    }
});


async function setup() {
    console.log('initiative-order-text-box | Initializing Initiative Order Text Box module');
    await registerRIOSettings();
    Combat.prototype._sortCombatants = sortCombatants;

    // Opt out for replacing initiative roll with input field
    if (game.settings.get("initiative-order-text-box", "initiativeInputField")) {
        CONFIG.Combat.initiative = {
            formula: null,
            decimals: 0
        };
    }

}