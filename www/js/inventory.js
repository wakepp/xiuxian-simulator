/* ===== 背包系统 ===== */

const Inventory = {

    // 渲染背包列表
    render(player) {
        const container = document.getElementById("inventory-list");
        container.innerHTML = "";

        const entries = Object.entries(player.inventory);
        if (entries.length === 0) {
            container.innerHTML = '<div class="empty-tip">背包空空如也</div>';
            return;
        }

        for (const [itemId, count] of entries) {
            const item = GameData.items[itemId];
            if (!item) continue;

            const div = document.createElement("div");
            div.className = "list-item";

            let useBtn = "";
            if (item.type === "pill") {
                useBtn = `<button class="btn-use" data-use="${itemId}">使用</button>`;
            } else if (item.type === "equip") {
                const isEquipped = (player.equipment[item.slot] === itemId);
                useBtn = `<button class="btn-use" data-equip="${itemId}">${isEquipped ? "已装备" : "装备"}</button>`;
            }

            div.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-desc">${item.desc}</div>
                </div>
                <span class="item-count">x${count}</span>
                ${useBtn}
            `;
            container.appendChild(div);
        }

        // 绑定使用按钮
        container.querySelectorAll("[data-use]").forEach(btn => {
            btn.addEventListener("click", () => {
                Game.useItem(btn.dataset.use);
            });
        });

        // 绑定装备按钮
        container.querySelectorAll("[data-equip]").forEach(btn => {
            btn.addEventListener("click", () => {
                Game.equipItem(btn.dataset.equip);
            });
        });
    },

    // 使用物品
    useItem(player, itemId) {
        const item = GameData.items[itemId];
        if (!item || !player.hasItem(itemId)) return null;

        const messages = [];

        if (item.type === "pill") {
            player.removeItem(itemId);
            const eff = item.effect;
            if (eff.exp) {
                player.exp += eff.exp;
                messages.push({ text: `使用【${item.name}】，修为增加 ${eff.exp}`, type: "success" });
            }
            if (eff.hp) {
                player.heal(eff.hp);
                messages.push({ text: `使用【${item.name}】，气血恢复 ${eff.hp}`, type: "success" });
            }
            if (eff.mp) {
                player.restoreMp(eff.mp);
                messages.push({ text: `使用【${item.name}】，灵力恢复 ${eff.mp}`, type: "success" });
            }
            if (eff.lifespan) {
                player.lifespan += eff.lifespan;
                messages.push({ text: `使用【${item.name}】，寿元增加 ${eff.lifespan} 年`, type: "legendary" });
            }
            if (eff.breakBonus) {
                player.breakBonus += eff.breakBonus;
                messages.push({ text: `使用【${item.name}】，下次突破成功率 +${eff.breakBonus}%`, type: "rare" });
            }
        }

        return messages;
    },

    // 装备物品
    equipItem(player, itemId) {
        const item = GameData.items[itemId];
        if (!item || item.type !== "equip" || !player.hasItem(itemId)) return null;

        const messages = [];
        const slot = item.slot;

        // 卸下旧装备
        if (player.equipment[slot]) {
            const oldItem = GameData.items[player.equipment[slot]];
            messages.push({ text: `卸下【${oldItem.name}】`, type: "system" });
        }

        player.equipment[slot] = itemId;
        messages.push({ text: `装备【${item.name}】，${item.desc}`, type: "success" });

        return messages;
    }
};
