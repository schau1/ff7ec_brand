// python -m http.server

const MY_HW_MATK = 0;
const MY_HW_PATK = 0;
const MY_HW_HP = 0;
const MY_HW_HEAL = 0;
const MY_HW_WEP = 0;

// It really doesn't matter what these values are since we're comparing 2 things andd they're constant but whatever
const BOOST_MP_ABILITY_PERCENT = 0.8
const BOOST_ABILITY_PERCENT = 0.4
const BOOST_ELEM_PERCENT = 1
const ENEMY_DEFENSE = 100;
const STANCE = 0.50;
const MIN_VARIANCE = 0.984375;
const MAX_VARIANCE = 1.015625;

// enum for radio
const PATK = 0 
const MATK = 1
const SKILL = 2

function getRadioOption(elemName) {
    var ele = document.getElementsByName(elemName);

    for (var i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            return i;
    }

    return -1;
}
function runCompareMagical() {
    runCompare(false);
}

function runComparePhysical() {
    runCompare(true);
}

function runCompare(isPhysical) {
    var damage = getBrandDmg(1, isPhysical);
    var damage2 = getBrandDmg(2, isPhysical);
    var percentBetter = 0;
    var outputStr;

//    console.log("Brand 1: " + damage);
//    console.log("Brand 2: " + damage2);

    if (damage > damage2) {
        percentBetter = (((damage - damage2) / damage2) * 100).toFixed(2);
        outputStr = "Result: Brand 1 is " + percentBetter + "% better than Brand 2.";
    }
    else if (damage == damage2) {
        outputStr = "Result: Both brands are the same.";
    }
    else {
        percentBetter = (((damage2 - damage) / damage) * 100).toFixed(2);
        outputStr = "Result: Brand 2 is " + percentBetter + "% better than Brand 1.";
    }

    var element = document.getElementById("result");
    element.innerHTML = ''
    var item = document.createElement("h3");
    item.innerHTML = outputStr;
    element.appendChild(item);
}

function getBrandDmg(brand, isPhysical) {
    let [effect1, effect2, effect3] = getBrandInfoName(brand);
    let [value1, value2, value3] = getBrandInfoValue(brand);
    let [patk, hwPatk, matk, hwMatk, skill, hwSkill] = getCharInfo();

/*    console.log(patk)
    console.log(hwPatk)
    console.log(matk)
    console.log(hwMatk)
    console.log(skill)
    console.log(hwSkill)*/

    var brandAtk = 0; var brandCskill = 0;

    if (effect1 == SKILL) { brandCskill += value1; }
    if (effect2 == SKILL) { brandCskill += value2; }
    if (effect3 == SKILL) { brandCskill += value3; }

    if (isPhysical) {
        if (effect1 == PATK) { brandAtk += value1; }
        if (effect2 == PATK) { brandAtk += value2; }
        if (effect3 == PATK) { brandAtk += value3; }
        damage = calcBrandDmg(patk, hwPatk, skill, hwSkill, brandAtk, brandCskill);
    }
    else {
        if (effect1 == MATK) { brandAtk += value1; }
        if (effect2 == MATK) { brandAtk += value2; }
        if (effect3 == MATK) { brandAtk += value3; }
        damage = calcBrandDmg(matk, hwMatk, skill, hwSkill, brandAtk, brandCskill);
    }

    return damage;
}

function getCharInfo() {
    var patk = document.getElementById('charPatk').value;
    var hwPatk = document.getElementById('charHwPatk').value;
    var matk = document.getElementById('charMatk').value;
    var hwMatk = document.getElementById('charHwMatk').value;
    var skill = document.getElementById('charSkill').value;
    var hwSkill = document.getElementById('charHwSkill').value;

    if (patk == '') {
        patk = 0;
    }

    if (hwPatk == '') {
        hwPatk = 0;
    }

    if (matk == '') {
        matk = 0;
    }

    if (hwMatk == '') {
        hwMatk = 0;
    }

    if (skill == '') {
        skill = 0;
    }

    if (hwSkill == '') {
        hwSkill = 0;
    }

    return [parseInt(patk), parseFloat(hwPatk), parseInt(matk), parseFloat(hwMatk), parseInt(skill), parseFloat(hwSkill)]
}

function getBrandInfoName(brand) {
    var effect1, effect2, effect3;

    if (brand == 1) {
        effect1 = getRadioOption('op1effec1')
        effect2 = getRadioOption('op1effec2')
        effect3 = getRadioOption('op1effec3')
    }
    else {  // brand 2
        effect1 = getRadioOption('op2effec1')
        effect2 = getRadioOption('op2effec2')
        effect3 = getRadioOption('op3effec3')
    }

    return [effect1, effect2, effect3]
}

function getBrandInfoValue(brand) {
    var value1, value2, value3;

    if (brand == 1) {
        value1 = document.getElementById('b1eff1').value;
        value2 = document.getElementById('b1eff2').value;
        value3 = document.getElementById('b1eff3').value;
    }
    else {  // brand 2
        value1 = document.getElementById('b2eff1').value;
        value2 = document.getElementById('b2eff2').value;
        value3 = document.getElementById('b2eff3').value;
    }

    if (value1 == '') { value1 = 0; }
    if (value2 == '') { value2 = 0; }
    if (value3 == '') { value3 = 0; }

    return [parseFloat(value1), parseFloat(value2), parseFloat(value3)]
}

function calcBrandDmg(charPMatk, hwPmatkBonus, skillPotency, hwWeapBonus, brandPMatk, brandCskill) {
/*    console.log("Value:")
    console.log("char atk: " + charPMatk)
    console.log("hw atk: " + hwPmatkBonus)
    console.log("skill: " + skillPotency)
    console.log("hw skill: " + hwWeapBonus)
    console.log("brand atk: " + brandPMatk)
    console.log("brand skill: " + brandCskill)*/

    var totalPMatk = charPMatk + Math.floor(brandPMatk * (1 + hwPmatkBonus/100));
    var totalSkillPot = Math.floor(skillPotency + skillPotency * brandCskill / 100);
    totalSkillPot = totalSkillPot / 100

//    console.log("new patk: " + totalPMatk)
//    console.log("new skill: " + totalSkillPot)

    return calculateSkillDamage(totalPMatk, BOOST_MP_ABILITY_PERCENT, BOOST_ABILITY_PERCENT, BOOST_ELEM_PERCENT, totalSkillPot, hwWeapBonus / 100, ENEMY_DEFENSE);
}

/*
*    mpatk: magic or physical stat, already counted HW
*    boostMPabilityPercent: magic or physical ability percent
*    boostElementalPercent: the elemental % boost of that weapon
*    enemyDefense: mdef or pdef of the enemy against
*    
*    Basically ignore all resistance and buffs/debuffs. Those belong in the dmg calculator. Here we are only calculating
*    regular damage to see what we should equip
*/
function calculateSkillDamage(mpatk, boostMPabilityPercent, boostAbilityPercent, boostElementalPercent, skillPotency, hwWeapBonus, enemyDefense) {
    var minSkillDamage;
    var maxSkillDamage;
    var basicSkillDamage;


    var skill = 50 * mpatk * skillPotency * (1 + hwWeapBonus) * (1 + STANCE) * (1 + (boostElementalPercent + boostAbilityPercent + boostMPabilityPercent)) / (enemyDefense * 2.2 + 100);
    minSkillDamage = skill * MIN_VARIANCE;
    maxSkillDamage = skill * MAX_VARIANCE;
    basicSkillDamage = Math.floor((minSkillDamage + maxSkillDamage) / 2);

    return basicSkillDamage;

}
