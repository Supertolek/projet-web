function convert() {
    const amount = document.getElementById("amount").value;
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;
    const resultElement = document.getElementById("result");

    if (amount === "" || amount <= 0) {
        resultElement.innerText = "Veuillez entrer un montant valide.";
        return;
    }

    
    const rates = {
        "USD": { "EUR": 0.92, "GBP": 0.79 },
        "EUR": { "USD": 1.09, "GBP": 0.86 },
        "GBP": { "USD": 1.27, "EUR": 1.16 }
    };

    if (fromCurrency === toCurrency) {
        resultElement.innerText = "Les devises sont identiques.";
        return;
    }

    const convertedAmount = (amount * rates[fromCurrency][toCurrency]).toFixed(2);
    resultElement.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
}
