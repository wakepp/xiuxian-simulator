/* ===== 玩家系统 ===== */

class Player {
    constructor(name, spiritRoot) {
        this.name = name;
        this.spiritRoot = spiritRoot;
        this.realmIndex = 0;
        this.exp = 0;
        this.hp = GameData.realms[0].hpBase;
        this.maxHp = GameData.realms[0].hpBase;
        this.mp = GameData.realms[0].mpBase;
        this.maxMp = GameData.realms[0].mpBase;
        this.attack = GameData.realms[0].attackBase;
        this.defense = GameData.realms[0].defenseBase;
        this.spiritStones = 50;
        this.lifespan = GameData.realms[0].lifespan;
        this.age = 16;
        this.inventory = {};
        this.skills = ["skill_basic"];
        this.activeCultivateSkill = "skill_basic";
        this.equipment = { weapon: null, armor: null };
        this.breakBonus = 0;
    }

    get realm() {
        return GameData.realms[this.realmIndex];
    }

    get expNeeded() {
        return this.realm.expNeeded;
    }

    get spiritRootData() {
        return GameData.spiritRoots.find(r => r.name === this.spiritRoot);
    }

    get totalAttack() {
        let atk = this.attack;
        for (const skillId of this.skills) {
            const skill = GameData.skills[skillId];
            if (skill && skill.type === "combat" && skill.attackBonus) {
                atk += skill.attackBonus;
            }
        }
        if (this.equipment.weapon) {
            const item = GameData.items[this.equipment.weapon];
            if (item && item.effect && item.effect.attack) atk += item.effect.attack;
        }
        return atk;
    }

    get totalDefense() {
        let def = this.defense;
        for (const skillId of this.skills) {
            const skill = GameData.skills[skillId];
            if (skill && skill.type === "combat" && skill.defenseBonus) {
                def += skill.defenseBonus;
            }
        }
        if (this.equipment.armor) {
            const item = GameData.items[this.equipment.armor];
            if (item && item.effect && item.effect.defense) def += item.effect.defense;
        }
        return def;
    }

    get cultivateExpBonus() {
        const skill = GameData.skills[this.activeCultivateSkill];
        const rootMulti = this.spiritRootData ? this.spiritRootData.expMulti : 1;
        return (skill ? skill.expBonus : 1) * rootMulti;
    }

    addItem(itemId, count = 1) {
        if (!this.inventory[itemId]) {
            this.inventory[itemId] = 0;
        }
        this.inventory[itemId] += count;
    }

    removeItem(itemId, count = 1) {
        if (!this.inventory[itemId] || this.inventory[itemId] < count) return false;
        this.inventory[itemId] -= count;
        if (this.inventory[itemId] <= 0) delete this.inventory[itemId];
        return true;
    }

    hasItem(itemId, count = 1) {
        return (this.inventory[itemId] || 0) >= count;
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    restoreMp(amount) {
        this.mp = Math.min(this.maxMp, this.mp + amount);
    }

    takeDamage(amount) {
        const realDmg = Math.max(1, amount - this.totalDefense);
        this.hp = Math.max(0, this.hp - realDmg);
        return realDmg;
    }

    isDead() {
        return this.hp <= 0;
    }

    recalcStats() {
        const realm = this.realm;
        this.maxHp = realm.hpBase;
        this.maxMp = realm.mpBase;
        this.attack = realm.attackBase;
        this.defense = realm.defenseBase;
        this.lifespan = realm.lifespan;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
        if (this.mp > this.maxMp) this.mp = this.maxMp;
    }

    toJSON() {
        return {
            name: this.name,
            spiritRoot: this.spiritRoot,
            realmIndex: this.realmIndex,
            exp: this.exp,
            hp: this.hp,
            mp: this.mp,
            spiritStones: this.spiritStones,
            lifespan: this.lifespan,
            age: this.age,
            inventory: this.inventory,
            skills: this.skills,
            activeCultivateSkill: this.activeCultivateSkill,
            equipment: this.equipment,
            breakBonus: this.breakBonus
        };
    }

    static fromJSON(data) {
        const p = new Player(data.name, data.spiritRoot);
        p.realmIndex = data.realmIndex;
        p.exp = data.exp;
        p.hp = data.hp;
        p.mp = data.mp;
        p.spiritStones = data.spiritStones;
        p.lifespan = data.lifespan;
        p.age = data.age;
        p.inventory = data.inventory || {};
        p.skills = data.skills || ["skill_basic"];
        p.activeCultivateSkill = data.activeCultivateSkill || "skill_basic";
        p.equipment = data.equipment || { weapon: null, armor: null };
        p.breakBonus = data.breakBonus || 0;
        p.recalcStats();
        return p;
    }
}
