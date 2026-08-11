/* ===== 主游戏控制器 ===== */

const Game = {
    player: null,
    currentScreen: "start-screen",
    previousScreen: null,

    init() {
        this.bindStartScreen();
        this.bindCreateScreen();
        this.bindGameScreen();
        this.bindBackButtons();
    },

    // ===== 界面管理 =====
    showScreen(screenId) {
        document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
        document.getElementById(screenId).classList.add("active");
        this.previousScreen = this.currentScreen;
        this.currentScreen = screenId;
    },

    // ===== 开始界面 =====
    bindStartScreen() {
        document.getElementById("btn-new-game").addEventListener("click", () => {
            this.showScreen("create-screen");
        });

        document.getElementById("btn-load-game").addEventListener("click", () => {
            if (this.loadGame()) {
                this.showScreen("game-screen");
                this.updateUI();
                this.addLog("读取存档成功，继续你的修仙之旅...", "info");
            } else {
                this.showModal("提示", "没有找到存档记录。", [{ text: "确定", action: () => this.hideModal() }]);
            }
        });
    },

    // ===== 创建角色 =====
    bindCreateScreen() {
        const nameInput = document.getElementById("player-name");
        const rootDisplay = document.getElementById("root-display");
        const startBtn = document.getElementById("btn-start-cultivation");
        let rolledRoot = null;

        document.getElementById("btn-roll-root").addEventListener("click", () => {
            rolledRoot = this.rollSpiritRoot();
            rootDisplay.textContent = `${rolledRoot.name} — ${rolledRoot.desc}`;
            rootDisplay.className = `root-${rolledRoot.rarity}`;
            this.checkStartReady();
        });

        nameInput.addEventListener("input", () => this.checkStartReady());

        this.checkStartReady = () => {
            const ready = nameInput.value.trim().length > 0 && rolledRoot !== null;
            startBtn.disabled = !ready;
        };

        startBtn.addEventListener("click", () => {
            const name = nameInput.value.trim();
            if (!name || !rolledRoot) return;
            this.player = new Player(name, rolledRoot.name);
            this.showScreen("game-screen");
            this.updateUI();
            this.addLog(`${name}，你踏上了修仙之路...`, "system");
            this.addLog(`你的灵根为【${rolledRoot.name}】— ${rolledRoot.desc}`, "rare");
            this.addLog("你可以打坐修炼、外出历练，或接取宗门任务。", "system");
        });
    },

    // 随机灵根（加权）
    rollSpiritRoot() {
        const roots = GameData.spiritRoots;
        const totalWeight = roots.reduce((sum, r) => sum + r.weight, 0);
        let roll = Math.random() * totalWeight;
        for (const root of roots) {
            roll -= root.weight;
            if (roll <= 0) return root;
        }
        return roots[0];
    },

    // ===== 主游戏界面 =====
    bindGameScreen() {
        document.querySelectorAll("[data-action]").forEach(btn => {
            btn.addEventListener("click", () => {
                this.handleAction(btn.dataset.action);
            });
        });
    },

    handleAction(action) {
        if (!this.player) return;

        // 检查寿元
        if (this.player.age >= this.player.lifespan && action !== "save") {
            this.addLog("你的寿元已尽...", "danger");
            this.addLog(`【${this.player.name}】的修仙之路到此结束。`, "danger");
            this.addLog(`最终境界：${this.player.realm.name}`, "system");
            return;
        }

        let messages = [];

        switch (action) {
            case "meditate":
                messages = Cultivation.meditate(this.player);
                break;
            case "breakthrough":
                messages = Cultivation.breakthrough(this.player);
                break;
            case "alchemy":
                this.showAlchemyMenu();
                return;
            case "explore":
                messages = Events.explore(this.player);
                break;
            case "adventure":
                messages = Events.adventure(this.player);
                break;
            case "sect":
                messages = Events.sectMission(this.player);
                break;
            case "inventory":
                Inventory.render(this.player);
                this.showScreen("inventory-screen");
                return;
            case "skills":
                this.renderSkills();
                this.showScreen("skills-screen");
                return;
            case "save":
                this.saveGame();
                messages = [{ text: "存档成功！", type: "success" }];
                break;
        }

        for (const msg of messages) {
            this.addLog(msg.text, msg.type);
        }

        // 自然恢复少量
        if (["meditate", "explore", "sect"].includes(action)) {
            const mpRegen = Math.floor(this.player.maxMp * 0.05);
            this.player.restoreMp(mpRegen);
        }

        this.updateUI();
    },

    // ===== 使用物品 =====
    useItem(itemId) {
        const messages = Inventory.useItem(this.player, itemId);
        if (messages) {
            for (const msg of messages) this.addLog(msg.text, msg.type);
            Inventory.render(this.player);
            this.updateUI();
        }
    },

    // ===== 装备物品 =====
    equipItem(itemId) {
        const messages = Inventory.equipItem(this.player, itemId);
        if (messages) {
            for (const msg of messages) this.addLog(msg.text, msg.type);
            Inventory.render(this.player);
            this.updateUI();
        }
    },

    // ===== 炼丹界面 =====
    showAlchemyMenu() {
        const recipes = GameData.alchemyRecipes;
        let body = "";
        recipes.forEach((r, i) => {
            const mats = r.materials.map(([id, c]) => {
                const have = this.player.inventory[id] || 0;
                const name = GameData.items[id].name;
                const ok = have >= c;
                return `${name}x${c}(${have})`;
            }).join(" + ");
            const canCraft = r.materials.every(([id, c]) => (this.player.inventory[id] || 0) >= c);
            body += `<div style="text-align:left;margin-bottom:10px;padding:8px;background:rgba(255,255,255,0.03);border-radius:6px;">
                <div style="color:#d4c5a0;font-weight:bold;">${r.name} <span style="color:#8a7a5a;font-size:12px;">成功率${r.successRate}%</span></div>
                <div style="color:#8a7a5a;font-size:12px;">材料：${mats}</div>
                <button class="btn btn-small" style="margin-top:6px;${canCraft ? '' : 'opacity:0.4;pointer-events:none;'}" data-recipe="${i}">炼制</button>
            </div>`;
        });

        this.showModal("炼丹炉", body, [
            { text: "关闭", action: () => this.hideModal() }
        ]);

        // 绑定炼制按钮
        setTimeout(() => {
            document.querySelectorAll("[data-recipe]").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idx = parseInt(btn.dataset.recipe);
                    const msgs = Cultivation.alchemy(this.player, idx);
                    for (const msg of msgs) this.addLog(msg.text, msg.type);
                    this.hideModal();
                    this.updateUI();
                });
            });
        }, 50);
    },

    // ===== 功法界面 =====
    renderSkills() {
        const container = document.getElementById("skills-list");
        container.innerHTML = "";

        if (this.player.skills.length === 0) {
            container.innerHTML = '<div class="empty-tip">尚未习得任何功法</div>';
            return;
        }

        for (const skillId of this.player.skills) {
            const skill = GameData.skills[skillId];
            if (!skill) continue;

            const div = document.createElement("div");
            div.className = "list-item";

            const isActive = (this.player.activeCultivateSkill === skillId);
            let btnHtml = "";
            if (skill.type === "cultivate") {
                btnHtml = isActive
                    ? `<button class="btn-use" disabled>修炼中</button>`
                    : `<button class="btn-use" data-set-active="${skillId}">切换</button>`;
            }

            const bonusText = skill.expBonus
                ? `修炼倍率：${skill.expBonus}x`
                : skill.attackBonus ? `攻击+${skill.attackBonus}` : `防御+${skill.defenseBonus}`;

            div.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${skill.name}${isActive ? ' ★' : ''}</div>
                    <div class="item-desc">${skill.desc} | ${bonusText}</div>
                </div>
                ${btnHtml}
            `;
            container.appendChild(div);
        }

        container.querySelectorAll("[data-set-active]").forEach(btn => {
            btn.addEventListener("click", () => {
                this.player.activeCultivateSkill = btn.dataset.setActive;
                const skill = GameData.skills[btn.dataset.setActive];
                this.addLog(`切换修炼功法为【${skill.name}】`, "info");
                this.renderSkills();
            });
        });
    },

    // ===== 返回按钮 =====
    bindBackButtons() {
        document.querySelectorAll("[data-back]").forEach(btn => {
            btn.addEventListener("click", () => {
                this.showScreen(this.previousScreen || "game-screen");
            });
        });
    },

    // ===== UI更新 =====
    updateUI() {
        if (!this.player) return;
        const p = this.player;

        document.getElementById("player-name-display").textContent = p.name;
        document.getElementById("realm-display").textContent = p.realm.name;

        const expPct = Math.min(100, (p.exp / p.expNeeded) * 100);
        document.getElementById("exp-bar").style.width = expPct + "%";
        document.getElementById("exp-text").textContent = `${p.exp}/${p.expNeeded}`;

        const hpPct = Math.min(100, (p.hp / p.maxHp) * 100);
        document.getElementById("hp-bar").style.width = hpPct + "%";
        document.getElementById("hp-text").textContent = `${p.hp}/${p.maxHp}`;

        const mpPct = Math.min(100, (p.mp / p.maxMp) * 100);
        document.getElementById("mp-bar").style.width = mpPct + "%";
        document.getElementById("mp-text").textContent = `${p.mp}/${p.maxMp}`;

        document.getElementById("spirit-stones").textContent = p.spiritStones;
        document.getElementById("lifespan").textContent = `${p.lifespan - p.age}`;
    },

    // ===== 日志系统 =====
    addLog(text, type = "system") {
        const logContent = document.getElementById("log-content");
        const line = document.createElement("div");
        line.className = `log-line ${type}`;
        line.textContent = text;
        logContent.appendChild(line);

        // 限制日志条数
        while (logContent.children.length > 200) {
            logContent.removeChild(logContent.firstChild);
        }

        // 自动滚动到底部
        const logArea = document.getElementById("game-log");
        logArea.scrollTop = logArea.scrollHeight;
    },

    // ===== 弹窗 =====
    showModal(title, bodyHtml, buttons) {
        document.getElementById("modal-title").textContent = title;
        document.getElementById("modal-body").innerHTML = bodyHtml;
        const btnContainer = document.getElementById("modal-buttons");
        btnContainer.innerHTML = "";
        for (const b of buttons) {
            const btn = document.createElement("button");
            btn.className = b.primary ? "btn btn-primary" : "btn btn-secondary";
            btn.textContent = b.text;
            btn.addEventListener("click", b.action);
            btnContainer.appendChild(btn);
        }
        document.getElementById("modal").classList.add("active");
    },

    hideModal() {
        document.getElementById("modal").classList.remove("active");
    },

    // ===== 存档系统 =====
    saveGame() {
        try {
            const data = JSON.stringify(this.player.toJSON());
            localStorage.setItem("xiuxian_save", data);
            return true;
        } catch (e) {
            console.error("Save failed:", e);
            return false;
        }
    },

    loadGame() {
        try {
            const raw = localStorage.getItem("xiuxian_save");
            if (!raw) return false;
            const data = JSON.parse(raw);
            this.player = Player.fromJSON(data);
            return true;
        } catch (e) {
            console.error("Load failed:", e);
            return false;
        }
    }
};

// 启动游戏
document.addEventListener("DOMContentLoaded", () => {
    Game.init();
});
