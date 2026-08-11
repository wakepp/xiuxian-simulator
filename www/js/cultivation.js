/* ===== 修炼系统 ===== */

const Cultivation = {

    // 打坐修炼
    meditate(player) {
        const baseExp = 10 + player.realmIndex * 5;
        const exp = Math.floor(baseExp * player.cultivateExpBonus);
        player.exp += exp;
        const mpCost = Math.floor(5 + player.realmIndex * 2);
        player.mp = Math.max(0, player.mp - mpCost);
        player.age += 1;

        const messages = [];
        messages.push({ text: `你盘膝而坐，运转${GameData.skills[player.activeCultivateSkill].name}，灵气缓缓涌入体内...`, type: "system" });
        messages.push({ text: `修为增加 ${exp} 点`, type: "success" });

        // 随机小事件
        if (Math.random() < 0.15) {
            const bonusExp = Math.floor(exp * 0.5);
            player.exp += bonusExp;
            messages.push({ text: "你进入顿悟状态，修为大增！", type: "rare" });
            messages.push({ text: `额外获得 ${bonusExp} 点修为`, type: "success" });
        }

        if (player.mp <= 0) {
            messages.push({ text: "灵力耗尽，修炼效率降低，需要休息恢复。", type: "danger" });
        }

        return messages;
    },

    // 尝试突破
    async breakthrough(player) {
        const messages = [];
        const realm = player.realm;
        const nextRealm = GameData.realms[player.realmIndex + 1];

        if (!nextRealm) {
            messages.push({ text: "你已达至高境界，无法再突破。", type: "system" });
            return messages;
        }

        if (player.exp < player.expNeeded) {
            messages.push({ text: `修为不足，无法突破！当前修为：${player.exp}/${player.expNeeded}`, type: "danger" });
            return messages;
        }

        // 计算突破成功率
        let successRate = 50;
        const rootData = player.spiritRootData;
        if (rootData) {
            if (rootData.rarity === "legendary") successRate += 30;
            else if (rootData.rarity === "epic") successRate += 20;
            else if (rootData.rarity === "rare") successRate += 10;
        }
        successRate += player.breakBonus;
        player.breakBonus = 0;
        successRate = Math.min(95, successRate);

        messages.push({ text: `你开始冲击${nextRealm.name}的瓶颈...`, type: "system" });
        messages.push({ text: `突破成功率：${successRate}%`, type: "info" });

        const roll = Math.random() * 100;
        if (roll < successRate) {
            // 突破成功
            player.realmIndex++;
            player.exp = 0;
            player.recalcStats();
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            messages.push({ text: `突破成功！你已晋升为【${nextRealm.name}】！`, type: "legendary" });
            messages.push({ text: `气血上限：${player.maxHp}  灵力上限：${player.maxMp}`, type: "success" });
            messages.push({ text: `寿元增加至：${player.lifespan}年`, type: "success" });
        } else {
            // 突破失败
            const expLoss = Math.floor(player.exp * 0.2);
            player.exp -= expLoss;
            const hpLoss = Math.floor(player.maxHp * 0.3);
            player.hp = Math.max(1, player.hp - hpLoss);
            messages.push({ text: "突破失败！灵力反噬！", type: "danger" });
            messages.push({ text: `损失修为 ${expLoss} 点，气血下降 ${hpLoss}`, type: "danger" });
        }

        return messages;
    },

    // 炼丹
    alchemy(player, recipeIndex) {
        const recipe = GameData.alchemyRecipes[recipeIndex];
        const messages = [];

        if (!recipe) {
            messages.push({ text: "无效的炼丹配方。", type: "system" });
            return messages;
        }

        // 检查材料
        for (const [itemId, count] of recipe.materials) {
            if (!player.hasItem(itemId, count)) {
                const itemName = GameData.items[itemId].name;
                messages.push({ text: `材料不足：${itemName}（需要${count}个）`, type: "danger" });
                return messages;
            }
        }

        // 消耗材料
        for (const [itemId, count] of recipe.materials) {
            player.removeItem(itemId, count);
        }

        // 判定成功
        const roll = Math.random() * 100;
        if (roll < recipe.successRate) {
            player.addItem(recipe.resultId);
            const itemName = GameData.items[recipe.resultId].name;
            messages.push({ text: `炉火纯青，丹成！获得【${itemName}】`, type: "legendary" });
        } else {
            messages.push({ text: "炼丹失败，材料化为灰烬...", type: "danger" });
            // 小概率出额外产物
            if (roll > recipe.successRate - 15) {
                player.addItem("pill_qi");
                messages.push({ text: "炉中余温炼出一颗聚气丹！", type: "rare" });
            }
        }

        return messages;
    },

    // 自然恢复
    rest(player) {
        const hpRecover = Math.floor(player.maxHp * 0.1);
        const mpRecover = Math.floor(player.maxMp * 0.2);
        player.heal(hpRecover);
        player.restoreMp(mpRecover);
        return [
            { text: "你稍作休息，调息恢复...", type: "system" },
            { text: `气血恢复 ${hpRecover}，灵力恢复 ${mpRecover}`, type: "success" }
        ];
    }
};
