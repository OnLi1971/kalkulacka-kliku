// Konstanta pro maximální počet kliků (dle tabulky)
const MAX_CLICKS = 60;
// Typy per a jejich referenční dávka (předpokládáme, že název pera XX mg odpovídá dávce při MAX_CLICKS)
const penTypes = [2.5, 5, 7.5, 10, 12.5, 15];

// Získání odkazů na HTML elementy
const penSelect = document.getElementById('penSelect');
const doseInput = document.getElementById('doseInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Naplnění možností pro výběr pera
penTypes.forEach(penValue => {
    const option = document.createElement('option');
    option.value = penValue; // Hodnota je číslo (např. 15)
    option.textContent = `Pero ${penValue} mg`; // Zobrazovaný text
    penSelect.appendChild(option);
});

// Funkce pro výpočet a zobrazení výsledku
function calculateClicks() {
    const selectedPenValue = parseFloat(penSelect.value);
    const desiredDose = parseFloat(doseInput.value);

    // Validace vstupu
    if (isNaN(desiredDose) || desiredDose < 0) {
        resultDiv.textContent = '❗️ Chyba: Zadejte prosím platnou kladnou dávku v mg.';
        resultDiv.className = 'result-error';
        return;
    }
    if (isNaN(selectedPenValue) || selectedPenValue <= 0) {
        resultDiv.textContent = '❗️ Chyba: Vyberte prosím platný typ pera.';
        resultDiv.className = 'result-error';
        return;
    }

    // Výpočet dávky na klik pro dané pero
    const mgPerClick = selectedPenValue / MAX_CLICKS;

    if (mgPerClick <= 0) {
         resultDiv.textContent = '❗️ Chyba: Nelze vypočítat dávku na klik.';
         resultDiv.className = 'result-error';
         return;
    }

    let calculatedClicks = 0;
    let roundedClicks = 0;
    let actualDose = 0;

    if (desiredDose === 0) {
        calculatedClicks = 0;
        roundedClicks = 0;
        actualDose = 0;
    } else {
        calculatedClicks = desiredDose / mgPerClick;
        roundedClicks = Math.round(calculatedClicks);
        // Zajistíme, aby kliky nebyly záporné (pro případ extrémně malého mgPerClick a malé dávky)
        roundedClicks = Math.max(0, roundedClicks);
        actualDose = roundedClicks * mgPerClick;
    }

    // Formátování skutečné dávky na rozumný počet desetinných míst
    // (více míst pro menší dávky)
    const actualDoseDecimalPlaces = (actualDose < 1) ? 3 : 2;
    const formattedActualDose = actualDose.toFixed(actualDoseDecimalPlaces).replace('.', ',');
    const formattedDesiredDose = desiredDose.toString().replace('.',','); // Pro zobrazení

    // Sestavení výsledného HTML
    let resultHTML = `Pro požadovanou dávku <strong>${formattedDesiredDose} mg</strong> (Pero ${selectedPenValue} mg):<br>`;
    resultHTML += `➡️ Nastavte <span class="clicks">${roundedClicks} kliků</span>.`;
    resultHTML += `<br><span class="actual-dose">(Tento počet kliků odpovídá dávce cca ${formattedActualDose} mg).</span>`;

    // Přidání varování, pokud počet kliků překročí maximum
    let warningMessage = "";
    if (roundedClicks > MAX_CLICKS) {
        warningMessage = `<br><span class="warning">⚠️ POZOR: Počet kliků (${roundedClicks}) překračuje maximum (${MAX_CLICKS}) dle tabulky!</span>`;
        resultHTML += warningMessage;
    }

    resultDiv.innerHTML = resultHTML;
    resultDiv.className = 'result-success'; // Nastavíme třídu pro úspěšný výsledek
}

// Přidání posluchače události na tlačítko
calculateBtn.addEventListener('click', calculateClicks);

// Inicializace výchozího textu v poli pro výsledek
resultDiv.textContent = 'Zadejte hodnoty a klikněte na tlačítko.';
resultDiv.className = ''; // Reset třídy