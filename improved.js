import fs from 'fs';

let data = fs.readFileSync('./data-improved.csv', 'utf8');

let lines = data.split('\n');
let result = [];
let headers = lines[0].split(';');
const listAppris = ['Apofoo', 'ColonelPavel', 'Colyseo', 'Dolcounette', 'Helline', 'La_Bli', 'Luciendeuxtrois', 'Sko0Rn', 'Soraaz', 'Zerah'];
for (let i = 1; i < lines.length - 1; i++) {
    let obj = {};
    let currentline = lines[i].split(';');
    if (currentline[1] === 'Apprivoiseur') {
        continue;
    }
    for (let j = 0; j < headers.length; j++) {
        const value = currentline[j];
        if (value === undefined) {
            break;
        }
        obj[headers[j]] = currentline[j];
    }
    result.push(obj);
}

const wantedAnimal = ['Chien hargneux (alias Pepette)', 'Teckel galeux'];
const listReceiptForAnimals = {};
for (let i = 0; i < result.length; i++) {
    const receipt = result[i]['Suite d\'elements'];
    listReceiptForAnimals[receipt] ??= {
        'Chien hargneux (alias Pepette)': 0,
        'Teckel galeux': 0,
        'total': 0
    };
    if (wantedAnimal.includes(result[i].Resultat)) {
        listReceiptForAnimals[receipt][result[i].Resultat]++;
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
    winrates.push({
        receipt: receipt,
        winrate: winrate,
        total: filteredList[receipt]['total']
    });
}

winrates.sort((a, b) => {
    return b.winrate - a.winrate;
});

console.table(winrates);     

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) &&
           !isNaN(parseFloat(str))
}