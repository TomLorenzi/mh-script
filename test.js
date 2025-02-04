import fs from 'fs';

let data = fs.readFileSync('./data.csv', 'utf8');

let lines = data.split('\n');
let result = [];
let headers = lines[0].split(';');
const listAppris = ['Apofoo', 'ColonelPavel', 'Colyseo', 'Dolcounette', 'Helline', 'La_Bli', 'Luciendeuxtrois', 'Sko0Rn', 'Soraaz', 'Zerah'];
for (let i = 1; i < lines.length; i++) {
    let obj = {};
    let currentline = lines[i].split(';');
    let missQuantity = false;
    if (!listAppris.includes(currentline[0]) && i < 1265) {
        continue;
    }
    for (let j = 0; j < headers.length + 1; j++) {
        const value = currentline[j];
        if (value === undefined) {
            break;
        }
        if (j === 2 && !isNumeric(value)) {
            obj[headers[j]] = 1;
            missQuantity = true;
        }
        let header = headers[j];
        if (missQuantity) {
            header = headers[j + 1];
        }
        obj[header] = currentline[j];
    }
    result.push(obj);
}

const wantedAnimal = ['Chien hargneux (alias Pepette)', 'Teckel galeux'];
const listReceiptForAnimals = {};
const listItemsByWinrate = {};
for (let i = 0; i < result.length; i++) {
    const listElems = [result[i].elem1, result[i].elem2, result[i].elem3].sort();
    const receipt = listElems.join('-');
    //const receipt = result[i].elem1 + '-' + result[i].elem2 + '-' + result[i].elem3;
    listReceiptForAnimals[receipt] ??= {
        'Chien hargneux (alias Pepette)': 0,
        'Teckel galeux': 0,
        'total': 0
    };
    for (const elem of listElems) {
        listItemsByWinrate[elem] ??= {
            'presence': 0,
            'winrate': 0
        };
        listItemsByWinrate[elem]['presence']++;
    }
    if (wantedAnimal.includes(result[i].animal)) {
        listReceiptForAnimals[receipt][result[i].animal]++;
        for (const elem of listElems) {
            listItemsByWinrate[elem]['winrate']++;
        }
    }
    listReceiptForAnimals[receipt]['total']++;
}

const filteredList = listReceiptForAnimals;
/*const filteredList = Object.fromEntries(
    Object.entries(listReceiptForAnimals).filter(([key, value]) => {
        return value['Chien hargneux (alias Pepette)'] > 0 || value['Teckel galeux'] > 0;
    })
);*/

const winrates = [];
for (const receipt in filteredList) {
    const winrate = (filteredList[receipt]['Chien hargneux (alias Pepette)'] + filteredList[receipt]['Teckel galeux']) / filteredList[receipt]['total'];
    const listItems = receipt.split('-');
    winrates.push({
        receipt: receipt,
        winrate: winrate,
        total: filteredList[receipt]['total']
    });
}

const winratesByItem = [];
for (const item in listItemsByWinrate) {
    const winrate = listItemsByWinrate[item]['winrate'] / listItemsByWinrate[item]['presence'];
    winratesByItem.push({
        item: item,
        winrate: winrate,
        presence: listItemsByWinrate[item]['presence']
    });
}

winrates.sort((a, b) => {
    return b.winrate - a.winrate;
});

winratesByItem.sort((a, b) => {
    return b.winrate - a.winrate;
});

console.table(winrates);     
//console.table(winratesByItem);     

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
           !isNaN(parseFloat(str))
}