// Konstanta pro maximální počet kliků (dle tabulky)
const MAX_CLICKS = 60;
// Maximální povolená požadovaná dávka pro tento nástroj
const MAX_DESIRED_DOSE = 15; // mg
// Typy per a jejich referenční dávka
const penTypes = [2.5, 5, 7.5, 10, 12.5, 15];

// Získání odkazů na HTML elementy
const penSelect = document.getElementById('penSelect');
const doseInput = document.getElementById('doseInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Naplnění možností pro výběr pera
penTypes.forEach(penValue => {
    const option = document.createElement('option');
    option.value = penValue;
    option.textContent = `Pero ${penValue} mg`;
    penSelect.appendChild(option);
});

// Funkce pro výpočet a zobrazení výsledku
function calculateClicks() {
    const selectedPenValue = parseFloat(penSelect.value);
    const desiredDose = parseFloat(doseInput.value);
    const formattedDesiredDoseInput = desiredDose.toString().replace('.',','); // Pro zobrazení v chybě

    // 1. Základní validace vstupu
    if (isNaN(desiredDose) || desiredDose < 0) {
        resultDiv.innerHTML = '❗️ Chyba: Zadejte prosím platnou kladnou dávku v mg.';
        resultDiv.className = 'result-error';
        return;
    }
    if (isNaN(selectedPenValue) || selectedPenValue <= 0) {
        resultDiv.innerHTML = '❗️ Chyba: Vyberte prosím platný typ pera.';
        resultDiv.className = 'result-error';
        return;
    }

    // 2. Nová kontrola maximální požadované dávky
    if (desiredDose > MAX_DESIRED_DOSE) {
        resultDiv.innerHTML = `❗️ Požadovaná dávka (${formattedDesiredDoseInput} mg) překračuje maximální hodnotu (${MAX_DESIRED_DOSE} mg) podporovanou tímto nástrojem.<br>Pro takto vysoké dávkování se <strong>vždy poraďte se svým lékařem</strong>.`;
        resultDiv.className = 'result-error';
        return; // Ukončíme funkci zde
    }

    // Pokračujeme ve výpočtu, pouze pokud dávka prošla kontrolou

    // Výpočet dávky na klik pro dané pero
    const mgPerClick = selectedPenValue / MAX_CLICKS;

    if (mgPerClick <= 0) {
         resultDiv.innerHTML = '❗️ Chyba: Nelze vypočítat dávku na klik.';
         resultDiv.className = 'result-error';
         return;
    }

    let calculatedClicks = 0;
    let roundedClicks = 0;
    let actualDose = 0;
    const epsilon = 1e-9;

    if (desiredDose === 0) {
        calculatedClicks = 0;
        roundedClicks = 0;
        actualDose = 0;
    } else {
        calculatedClicks = desiredDose / mgPerClick;
        roundedClicks = Math.round(calculatedClicks);
        roundedClicks = Math.max(0, roundedClicks);
        actualDose = roundedClicks * mgPerClick;
    }

    const doseDecimalPlaces = (actualDose < 1 && actualDose !== 0) ? 3 : 2;
    const formattedActualDose = actualDose.toFixed(doseDecimalPlaces).replace('.', ',');
    const formattedDesiredDose = desiredDose.toString().replace('.',',');

    let resultHTML = "";
    let actualDoseClass = 'actual-dose';
    if (desiredDose > 0 && Math.abs(actualDose - desiredDose) > epsilon) {
        actualDoseClass += ' dose-discrepancy';
    }

    if (roundedClicks <= MAX_CLICKS) {
        resultHTML = `Pro požadovanou dávku <strong>${formattedDesiredDose} mg</strong> (Pero ${selectedPenValue} mg):<br>`;
        resultHTML += `➡️ Nastavte <span class="clicks">${roundedClicks} kliků</span>.`;
        if (desiredDose > 0) {
             resultHTML += `<br><span class="${actualDoseClass}">(Tento počet kliků odpovídá dávce ${formattedActualDose} mg).</span>`;
        }
    } else {
        const clicks_step1 = MAX_CLICKS;
        const clicks_step2 = roundedClicks - MAX_CLICKS;
        const dose_step1 = clicks_step1 * mgPerClick;
        const dose_step2 = clicks_step2 * mgPerClick;

        const formattedDoseStep1 = dose_step1.toFixed(doseDecimalPlaces).replace('.', ',');
        const formattedDoseStep2 = dose_step2.toFixed(doseDecimalPlaces).replace('.', ',');

        resultHTML = `Pro požadovanou dávku <strong>${formattedDesiredDose} mg</strong> (Pero ${selectedPenValue} mg) je potřeba více aplikací (celkem ${roundedClicks} kliků, odpovídá ${formattedActualDose} mg):<br>`;
        resultHTML += `<strong class="multi-step-header">1. Aplikace:</strong> <span class="clicks-multi">${clicks_step1} kliků</span> (${formattedDoseStep1} mg).<br>`;
        resultHTML += `<strong class="multi-step-header">2. Aplikace:</strong> <span class="clicks-multi">${clicks_step2} kliků</span> (${formattedDoseStep2} mg).`;

        if (clicks_step2 > MAX_CLICKS) {
             resultHTML += `<br><span class="warning">⚠️ POZOR: Druhá aplikace (${clicks_step2} kliků) také překračuje maximum pera! Možná bude potřeba další rozdělení nebo konzultace s lékařem.</span>`;
        }
        if (desiredDose > 0 && Math.abs(actualDose - desiredDose) > epsilon) {
             resultHTML += `<br><span class="${actualDoseClass}">(Celková dávka ${formattedActualDose} mg se mírně liší od požadované ${formattedDesiredDose} mg).</span>`;
        }
    }

    resultDiv.innerHTML = resultHTML;
    resultDiv.className = 'result-success';
}

// Přidání posluchače události na tlačítko
calculateBtn.addEventListener('click', calculateClicks);

// Inicializace výchozího textu v poli pro výsledek
resultDiv.textContent = 'Zadejte hodnoty a klikněte na tlačítko.';
resultDiv.className = '';