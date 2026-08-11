/* ===== 游戏数据定义 ===== */

const GameData = {

    // 境界定义
    realms: [
        { name: "凡人",       level: 0,  expNeeded: 100,   hpBase: 100,  mpBase: 50,   lifespan: 100,  attackBase: 5,   defenseBase: 2   },
        { name: "练气一层",   level: 1,  expNeeded: 200,   hpBase: 200,  mpBase: 100,  lifespan: 150,  attackBase: 15,  defenseBase: 8   },
        { name: "练气二层",   level: 2,  expNeeded: 350,   hpBase: 280,  mpBase: 140,  lifespan: 150,  attackBase: 22,  defenseBase: 12  },
        { name: "练气三层",   level: 3,  expNeeded: 500,   hpBase: 380,  mpBase: 190,  lifespan: 160,  attackBase: 32,  defenseBase: 18  },
        { name: "筑基初期",   level: 4,  expNeeded: 800,   hpBase: 600,  mpBase: 300,  lifespan: 200,  attackBase: 55,  defenseBase: 30  },
        { name: "筑基中期",   level: 5,  expNeeded: 1200,  hpBase: 850,  mpBase: 420,  lifespan: 220,  attackBase: 80,  defenseBase: 45  },
        { name: "筑基后期",   level: 6,  expNeeded: 1800,  hpBase: 1200, mpBase: 600,  lifespan: 250,  attackBase: 115, defenseBase: 65  },
        { name: "金丹初期",   level: 7,  expNeeded: 3000,  hpBase: 2000, mpBase: 1000, lifespan: 400,  attackBase: 200, defenseBase: 110 },
        { name: "金丹中期",   level: 8,  expNeeded: 5000,  hpBase: 3000, mpBase: 1500, lifespan: 500,  attackBase: 320, defenseBase: 180 },
        { name: "金丹后期",   level: 9,  expNeeded: 8000,  hpBase: 4500, mpBase: 2200, lifespan: 600,  attackBase: 480, defenseBase: 270 },
        { name: "元婴初期",   level: 10, expNeeded: 15000, hpBase: 8000, mpBase: 4000, lifespan: 1000, attackBase: 800, defenseBase: 450 },
        { name: "元婴中期",   level: 11, expNeeded: 25000, hpBase: 12000,mpBase: 6000, lifespan: 1200, attackBase: 1200,defenseBase: 680 },
        { name: "元婴后期",   level: 12, expNeeded: 40000, hpBase: 18000,mpBase: 9000, lifespan: 1500, attackBase: 1800,defenseBase: 1000},
        { name: "化神",       level: 13, expNeeded: 80000, hpBase: 35000,mpBase: 18000,lifespan: 2000, attackBase: 3200,defenseBase: 1800},
        { name: "大乘",       level: 14, expNeeded: 200000,hpBase: 80000,mpBase: 40000,lifespan: 5000, attackBase: 8000,defenseBase: 4500},
        { name: "渡劫",       level: 15, expNeeded: 500000,hpBase: 200000,mpBase:100000,lifespan: 10000,attackBase: 20000,defenseBase: 11000},
        { name: "仙人",       level: 16, expNeeded: 9999999,hpBase:999999,mpBase:500000,lifespan: 99999,attackBase: 99999,defenseBase: 99999}
    ],

    // 灵根定义
    spiritRoots: [
        { name: "废灵根",   rarity: "common",    weight: 30, expMulti: 0.3, desc: "五行杂灵根，修炼极其缓慢" },
        { name: "杂灵根",   rarity: "common",    weight: 25, expMulti: 0.5, desc: "四属性灵根，修炼速度较慢" },
        { name: "双灵根",   rarity: "uncommon",  weight: 20, expMulti: 0.8, desc: "双属性灵根，修炼速度尚可" },
        { name: "单灵根",   rarity: "rare",      weight: 12, expMulti: 1.2, desc: "单属性灵根，修炼天赋上佳" },
        { name: "天灵根",   rarity: "epic",      weight: 8,  expMulti: 1.8, desc: "天生灵根，修炼速度极快" },
        { name: "异灵根",   rarity: "epic",      weight: 4,  expMulti: 2.2, desc: "变异灵根，蕴含特殊力量" },
        { name: "仙灵根",   rarity: "legendary", weight: 1,  expMulti: 3.5, desc: "万古无一的绝世仙灵根" }
    ],

    // 物品定义
    items: {
        // 丹药
        "pill_qi":       { name: "聚气丹",   type: "pill", desc: "增加50点修为",       effect: { exp: 50 },      price: 20  },
        "pill_hp":       { name: "回春丹",   type: "pill", desc: "恢复100点气血",      effect: { hp: 100 },    price: 15  },
        "pill_mp":       { name: "回灵丹",   type: "pill", desc: "恢复80点灵力",       effect: { mp: 80 },     price: 15  },
        "pill_break":    { name: "破境丹",   type: "pill", desc: "突破成功率+20%",     effect: { breakBonus: 20 }, price: 100 },
        "pill_longevity":{ name: "延寿丹",   type: "pill", desc: "增加50年寿元",       effect: { lifespan: 50 }, price: 200 },
        "pill_gold":     { name: "金丹",     type: "pill", desc: "增加500点修为",      effect: { exp: 500 },   price: 150 },
        // 材料
        "herb_ling":     { name: "灵芝草",   type: "material", desc: "常见炼丹材料",     price: 5   },
        "herb_xuan":     { name: "玄冰花",   type: "material", desc: "稀有炼丹材料",     price: 30  },
        "herb_long":     { name: "龙血草",   type: "material", desc: "珍贵炼丹材料",     price: 80  },
        "ore_tie":       { name: "玄铁矿",   type: "material", desc: "炼器基础材料",     price: 25  },
        // 装备
        "sword_wood":    { name: "木剑",     type: "equip", slot: "weapon", desc: "攻击+5",    effect: { attack: 5 },   price: 30  },
        "sword_iron":    { name: "铁剑",     type: "equip", slot: "weapon", desc: "攻击+15",   effect: { attack: 15 },  price: 100 },
        "sword_xuan":    { name: "玄铁剑",   type: "equip", slot: "weapon", desc: "攻击+40",   effect: { attack: 40 },  price: 350 },
        "sword_ling":    { name: "灵光剑",   type: "equip", slot: "weapon", desc: "攻击+100",  effect: { attack: 100 }, price: 1000},
        "robe_cloth":    { name: "布衣",     type: "equip", slot: "armor",  desc: "防御+3",    effect: { defense: 3 },  price: 20  },
        "robe_leather":  { name: "皮甲",     type: "equip", slot: "armor",  desc: "防御+10",   effect: { defense: 10 }, price: 80  },
        "robe_xuan":     { name: "玄丝法袍", type: "equip", slot: "armor",  desc: "防御+30",   effect: { defense: 30 }, price: 300 },
        "robe_ling":     { name: "灵纹法袍", type: "equip", slot: "armor",  desc: "防御+80",   effect: { defense: 80 }, price: 900 }
    },

    // 功法定义
    skills: {
        "skill_basic":    { name: "吐纳术",     desc: "最基础的修炼之法",         type: "cultivate", expBonus: 1.0,  price: 0    },
        "skill_fire":     { name: "焚火诀",     desc: "火属性功法，修炼较快",     type: "cultivate", expBonus: 1.5,  price: 200  },
        "skill_ice":      { name: "寒冰真经",   desc: "冰属性功法，攻防兼备",     type: "cultivate", expBonus: 1.8,  price: 500  },
        "skill_thunder":  { name: "雷霆万钧",   desc: "雷属性功法，威力巨大",     type: "cultivate", expBonus: 2.2,  price: 1200 },
        "skill_dragon":   { name: "化龙诀",     desc: "上古功法，修炼极快",       type: "cultivate", expBonus: 3.0,  price: 5000 },
        "skill_sword_1":  { name: "基础剑法",   desc: "入门剑法",               type: "combat", attackBonus: 10,  price: 50   },
        "skill_sword_2":  { name: "御剑术",     desc: "以灵力御剑，攻击+30",     type: "combat", attackBonus: 30,  price: 200  },
        "skill_sword_3":  { name: "万剑归宗",   desc: "万剑齐发，攻击+80",       type: "combat", attackBonus: 80,  price: 800  },
        "skill_body_1":   { name: "铁布衫",     desc: "基础体修功法，防御+10",   type: "combat", defenseBonus: 10, price: 50   },
        "skill_body_2":   { name: "金钟罩",     desc: "高级体修功法，防御+35",   type: "combat", defenseBonus: 35, price: 300  },
        "skill_body_3":   { name: "不灭金身",   desc: "传说体修功法，防御+100",  type: "combat", defenseBonus: 100,price: 1500 }
    },

    // 探索区域（根据境界解锁）
    areas: [
        { name: "新手村",     minLevel: 0,  enemies: ["野鸡", "野兔", "山贼"],           boss: "山贼头目",  rewards: ["herb_ling", "sword_wood", "robe_cloth"] },
        { name: "青云山脉",   minLevel: 1,  enemies: ["灵狐", "毒蛇", "妖狼"],           boss: "妖狼王",    rewards: ["herb_ling", "herb_xuan", "sword_iron", "robe_leather"] },
        { name: "万妖森林",   minLevel: 4,  enemies: ["树妖", "花妖", "虎妖"],           boss: "万妖之王",  rewards: ["herb_xuan", "herb_long", "sword_xuan", "robe_xuan"] },
        { name: "幽冥深渊",   minLevel: 7,  enemies: ["鬼修", "幽冥兽", "暗影魔"],       boss: "幽冥魔君",  rewards: ["herb_long", "ore_tie", "sword_ling", "robe_ling"] },
        { name: "天劫秘境",   minLevel: 10, enemies: ["天劫兽", "远古傀儡", "仙兽残影"], boss: "远古仙兽",  rewards: ["herb_long", "pill_gold", "pill_longevity"] },
        { name: "混沌虚空",   minLevel: 13, enemies: ["虚空裂缝", "混沌兽", "天魔"],     boss: "混沌之主",  rewards: ["pill_gold", "pill_longevity", "pill_break"] }
    ],

    // 宗门任务类型
    sectMissions: [
        { name: "采集灵药",   desc: "前往山林采集灵药",       difficulty: 1, rewardExp: 30,   rewardStones: 10, rewardItem: "herb_ling" },
        { name: "斩杀妖兽",   desc: "清除附近的妖兽威胁",     difficulty: 2, rewardExp: 60,   rewardStones: 25, rewardItem: null },
        { name: "护送商队",   desc: "护送宗门商队前往城镇",   difficulty: 2, rewardExp: 50,   rewardStones: 40, rewardItem: null },
        { name: "探索遗迹",   desc: "探索新发现的古代遗迹",   difficulty: 3, rewardExp: 120,  rewardStones: 60, rewardItem: "herb_xuan" },
        { name: "守卫山门",   desc: "抵御外敌入侵宗门",       difficulty: 3, rewardExp: 100,  rewardStones: 50, rewardItem: null },
        { name: "剿灭魔修",   desc: "追踪并剿灭作恶的魔修",   difficulty: 4, rewardExp: 200,  rewardStones: 100,rewardItem: "pill_break" },
        { name: "秘境探索",   desc: "进入危险秘境寻找宝物",   difficulty: 5, rewardExp: 500,  rewardStones: 250,rewardItem: "herb_long" }
    ],

    // 随机事件
    randomEvents: [
        { text: "你在路边发现了一个破旧的储物袋！",                    type: "gain",   stones: [5, 20] },
        { text: "一位路过的老者见你资质不凡，指点了你几句修炼之法。",   type: "exp",    exp: [20, 80] },
        { text: "你遇到了一只受伤的灵狐，帮它治疗后它送来了灵草。",     type: "item",   itemId: "herb_ling" },
        { text: "你踩到了隐藏的陷阱，受了些伤。",                       type: "damage", damage: [10, 30] },
        { text: "你发现了一处灵气浓郁的洞府，修炼事半功倍！",           type: "exp",    exp: [50, 150] },
        { text: "你遇到了一位散修，他用灵石换了一些丹药给你。",         type: "gain",   stones: [10, 50] },
        { text: "突然天降陨石，你险些被砸中！",                         type: "damage", damage: [20, 60] },
        { text: "你在一处古洞中发现了一本功法残页！",                   type: "exp",    exp: [100, 300] },
        { text: "你遇到了一位炼器师，他赠送了你一些材料。",             type: "item",   itemId: "ore_tie" },
        { text: "你在战斗中领悟了一丝剑意！",                          type: "exp",    exp: [80, 200] },
        { text: "你误入了瘴气区域，气血下降。",                         type: "damage", damage: [15, 45] },
        { text: "你发现了一株百年灵芝！",                               type: "item",   itemId: "herb_xuan" },
        { text: "一位神秘商人给了你一些灵石。",                         type: "gain",   stones: [30, 100] },
        { text: "你遇到了一位同道中人，切磋之后各有收获。",             type: "exp",    exp: [40, 120] },
        { text: "你被一群山贼伏击，奋力杀出重围。",                    type: "damage", damage: [25, 70] }
    ],

    // 炼丹配方
    alchemyRecipes: [
        { name: "聚气丹",   resultId: "pill_qi",    materials: [["herb_ling", 2]],                successRate: 80 },
        { name: "回春丹",   resultId: "pill_hp",    materials: [["herb_ling", 1], ["herb_xuan", 1]], successRate: 70 },
        { name: "回灵丹",   resultId: "pill_mp",    materials: [["herb_ling", 1], ["herb_xuan", 1]], successRate: 70 },
        { name: "破境丹",   resultId: "pill_break", materials: [["herb_xuan", 2], ["herb_long", 1]], successRate: 40 },
        { name: "延寿丹",   resultId: "pill_longevity", materials: [["herb_long", 3]],            successRate: 30 },
        { name: "金丹",     resultId: "pill_gold",  materials: [["herb_long", 2], ["herb_xuan", 3]], successRate: 25 }
    ]
};
