/* ===== 事件系统 ===== */

const Events = {

    // 外出历练
    explore(player) {
        const messages = [];
        const area = this.getAvailableArea(player);
        if (!area) {
            messages.push({ text: "你尚未达到可以外出历练的境界。", type: "system" });
            return messages;
        }

        messages.push({ text: `你前往【${area.name}】历练...`, type: "system" });

        const roll = Math.random();
        if (roll < 0.3) {
            // 随机事件
            const event = GameData.randomEvents[Math.floor(Math.random() * GameData.randomEvents.length)];
            messages.push({ text: event.text, type: "system" });
            this.applyRandomEvent(player, event, messages);
        } else if (roll < 0.75) {
            // 战斗
            const enemy = area.enemies[Math.floor(Math.random() * area.enemies.length)];
            messages.push(...this.combat(player, enemy, area));
        } else {
            // 发现宝物
            const rewardId = area.rewards[Math.floor(Math.random() * area.rewards.length)];
            const rewardItem = GameData.items[rewardId];
            player.addItem(rewardId);
            messages.push({ text: `你在探索中发现了一个宝箱！`, type: "rare" });
            messages.push({ text: `获得【${rewardItem.name}】`, type: "legendary" });
        }

        player.age += 1;
        return messages;
    },

    // 秘境探险
    adventure(player) {
        const messages = [];
        const area = this.getAvailableArea(player, 1);
        if (!area) {
            messages.push({ text: "你的境界太低，无法找到秘境入口。", type: "system" });
            return messages;
        }

        if (player.spiritStones < 20) {
            messages.push({ text: "进入秘境需要20灵石，你的灵石不足。", type: "danger" });
            return messages;
        }
        player.spiritStones -= 20;

        messages.push({ text: `你消耗20灵石，进入【${area.name}】深处的秘境...`, type: "system" });

        // 秘境多轮战斗
        let rounds = 2 + Math.floor(Math.random() * 3);
        let totalExp = 0;
        let totalStones = 0;
        let itemsFound = [];

        for (let i = 0; i < rounds; i++) {
            if (player.isDead()) break;
            const isBoss = (i === rounds - 1);
            const enemy = isBoss ? area.boss : area.enemies[Math.floor(Math.random() * area.enemies.length)];

            const enemyLevel = (area.minLevel || 0) + (isBoss ? 2 : 0);
            const enemyHp = 30 + enemyLevel * 40 + Math.floor(Math.random() * 20);
            const enemyAtk = 8 + enemyLevel * 12;

            const playerDmg = Math.max(1, player.totalAttack - enemyLevel * 3);
            const enemyDmg = Math.max(1, enemyAtk - Math.floor(player.totalDefense * 0.5));
            const hits = Math.ceil(enemyHp / playerDmg);
            const damageTaken = hits * enemyDmg;

            player.hp = Math.max(0, player.hp - damageTaken);

            const expGain = (isBoss ? 80 : 20) + enemyLevel * 15;
            const stonesGain = (isBoss ? 30 : 5) + Math.floor(Math.random() * enemyLevel * 5);
            totalExp += expGain;
            totalStones += stonesGain;

            if (isBoss) {
                messages.push({ text: `你遭遇了秘境Boss【${enemy}】！经过激战，你将其击败！`, type: "legendary" });
                // Boss掉落
                const dropId = area.rewards[Math.floor(Math.random() * area.rewards.length)];
                player.addItem(dropId);
                itemsFound.push(GameData.items[dropId].name);
            } else {
                messages.push({ text: `你遇到了${enemy}，将其击杀。`, type: "system" });
            }
        }

        player.exp += totalExp;
        player.spiritStones += totalStones;
        player.age += 2;

        messages.push({ text: `秘境探索结束！`, type: "info" });
        messages.push({ text: `获得修为 ${totalExp}，灵石 ${totalStones}`, type: "success" });
        if (itemsFound.length > 0) {
            messages.push({ text: `获得物品：${itemsFound.join("、")}`, type: "legendary" });
        }

        if (player.isDead()) {
            messages.push({ text: "你在秘境中昏死过去，被传送出了秘境...", type: "danger" });
            player.hp = Math.floor(player.maxHp * 0.1);
        }

        return messages;
    },

    // 宗门任务
    sectMission(player) {
        const messages = [];
        const available = GameData.sectMissions.filter(m => m.difficulty <= Math.ceil(player.realmIndex / 2) + 1);
        if (available.length === 0) {
            messages.push({ text: "宗门暂无适合你的任务。", type: "system" });
            return messages;
        }

        const mission = available[Math.floor(Math.random() * available.length)];
        messages.push({ text: `你接取了宗门任务：【${mission.name}】`, type: "info" });
        messages.push({ text: mission.desc, type: "system" });

        // 任务成功率
        const successRate = 50 + player.totalAttack - mission.difficulty * 20;
        const capped = Math.min(90, Math.max(20, successRate));

        if (Math.random() * 100 < capped) {
            messages.push({ text: "任务完成！", type: "success" });
            player.exp += mission.rewardExp;
            player.spiritStones += mission.rewardStones;
            messages.push({ text: `获得修为 ${mission.rewardExp}，灵石 ${mission.rewardStones}`, type: "success" });
            if (mission.rewardItem) {
                player.addItem(mission.rewardItem);
                const itemName = GameData.items[mission.rewardItem].name;
                messages.push({ text: `获得物品【${itemName}】`, type: "rare" });
            }
        } else {
            messages.push({ text: "任务失败，你受了些伤。", type: "danger" });
            const dmg = Math.floor(player.maxHp * 0.2);
            player.hp = Math.max(1, player.hp - dmg);
            messages.push({ text: `气血减少 ${dmg}`, type: "danger" });
        }

        player.age += 1;
        return messages;
    },

    // 战斗
    combat(player, enemyName, area) {
        const messages = [];
        const enemyLevel = area.minLevel + Math.floor(Math.random() * 2);
        const enemyHp = 20 + enemyLevel * 30;
        const enemyAtk = 5 + enemyLevel * 10;

        const playerDmg = Math.max(1, player.totalAttack - enemyLevel * 2);
        const enemyDmg = Math.max(1, enemyAtk - Math.floor(player.totalDefense * 0.4));
        const hits = Math.ceil(enemyHp / playerDmg);
        const totalDamage = hits * enemyDmg;

        messages.push({ text: `你遇到了${enemyName}（等级${enemyLevel}）！`, type: "system" });

        if (player.hp > totalDamage) {
            // 胜利
            player.hp -= totalDamage;
            const expGain = 10 + enemyLevel * 8;
            const stonesGain = Math.floor(Math.random() * (enemyLevel * 3 + 1));
            player.exp += expGain;
            player.spiritStones += stonesGain;
            messages.push({ text: `你击败了${enemyName}！`, type: "success" });
            messages.push({ text: `获得修为 ${expGain}，灵石 ${stonesGain}`, type: "success" });

            // 掉落
            if (Math.random() < 0.3 && area.rewards.length > 0) {
                const dropId = area.rewards[Math.floor(Math.random() * area.rewards.length)];
                player.addItem(dropId);
                messages.push({ text: `掉落【${GameData.items[dropId].name}】`, type: "rare" });
            }
        } else {
            // 失败
            player.hp = Math.floor(player.maxHp * 0.1);
            messages.push({ text: `你被${enemyName}击败，重伤逃遁！`, type: "danger" });
            messages.push({ text: "一位前辈救了你一命...", type: "system" });
        }

        return messages;
    },

    // 应用随机事件
    applyRandomEvent(player, event, messages) {
        switch (event.type) {
            case "gain":
                const stones = event.stones[0] + Math.floor(Math.random() * (event.stones[1] - event.stones[0]));
                player.spiritStones += stones;
                messages.push({ text: `获得 ${stones} 灵石`, type: "success" });
                break;
            case "exp":
                const exp = event.exp[0] + Math.floor(Math.random() * (event.exp[1] - event.exp[0]));
                player.exp += exp;
                messages.push({ text: `获得 ${exp} 点修为`, type: "success" });
                break;
            case "item":
                player.addItem(event.itemId);
                messages.push({ text: `获得【${GameData.items[event.itemId].name}】`, type: "rare" });
                break;
            case "damage":
                const dmg = event.damage[0] + Math.floor(Math.random() * (event.damage[1] - event.damage[0]));
                const realDmg = Math.max(1, dmg - Math.floor(player.totalDefense * 0.3));
                player.hp = Math.max(1, player.hp - realDmg);
                messages.push({ text: `受到 ${realDmg} 点伤害`, type: "danger" });
                break;
        }
    },

    // 获取可探索区域
    getAvailableArea(player, offset = 0) {
        const available = GameData.areas.filter(a => a.minLevel <= player.realmIndex + offset);
        if (available.length === 0) return null;
        return available[available.length - 1];
    }
};
