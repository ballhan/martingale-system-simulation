function simulateRoulette() {
  const initialBalance = parseFloat(
    document.getElementById("initialBalance").value
  );
  const spins = parseInt(document.getElementById("spins").value);
  const singleUnit = parseFloat(document.getElementById("singleUnit").value);

  let totalMoney = initialBalance;
  let currentBet = singleUnit;

  const results = [];
  const moneyFluctuations = [];
  const betHistory = [];
  let redCount = 0;

  for (let i = 0; i < spins && totalMoney >= currentBet; i++) {
    betHistory.push(currentBet);

    const result = spinWheel();

    if (isRed(result)) {
      totalMoney += currentBet;
      currentBet = singleUnit;
      redCount++;
    } else {
      totalMoney -= currentBet;
      currentBet = doubleDownBet(currentBet);
    }

    results.push(result);
    moneyFluctuations.push(totalMoney);
  }

  const outOfMoney = totalMoney < currentBet;

  displayLogs(
    results,
    betHistory,
    moneyFluctuations,
    totalMoney,
    outOfMoney,
    redCount
  );
}

function displayLogs(
  results,
  betHistory,
  moneyFluctuations,
  totalMoney,
  outOfMoney,
  redCount
) {
  const logsElement = document.getElementById("logs");
  logsElement.innerHTML = "<h5>Logs:</h5>";

  const roundCount = results.length;

  if (outOfMoney) {
    logsElement.innerHTML += `<strong>OUT OF FUNDS at spin ${roundCount}, better luck next time</strong>`;
  }

  const redPercentage = ((100 * redCount) / roundCount).toFixed(2);
  logsElement.innerHTML += `<p class='log total-money'>${redCount} Reds(${redPercentage}%), End Balance: <strong>$${totalMoney.toFixed(
    2
  )}</strong></p>`;

  for (let i = 0; i < roundCount; i++) {
    const iconClass =
      results[i] === 0 || results[i] === 37
        ? "fas fa-circle green-icon"
        : isRed(results[i])
        ? "fas fa-circle red-icon"
        : "fas fa-circle black-icon";

    const betMessage = `Bet $${betHistory[i]}, `;
    const resultMessage = isRed(results[i])
      ? `<strong> WIN +$${betHistory[i]}</strong>`
      : `<strong> LOSS -$${betHistory[i]} </strong>`;
    const message = betMessage + resultMessage;

    logsElement.innerHTML += `<p class='log'>${
      i + 1
    }:    <i class='${iconClass} icon'></i>${getResultText(
      results[i]
    )},  ${message}, <strong>Balance - $${moneyFluctuations[i].toFixed(
      2
    )}</strong></p>`;
  }
}

function spinWheel() {
  return Math.floor(Math.random() * 38); // 38 for 0 and 00
}

function doubleDownBet(previousBet) {
  return previousBet * 2;
}

function isRed(number) {
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  return redNumbers.includes(number);
}

function getResultText(result) {
  return result === 0 ? "0" : result === 37 ? "00" : result;
}
