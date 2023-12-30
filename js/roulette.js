function simulateRoulette() {
  var initialBalance = parseFloat(
    document.getElementById("initialBalance").value
  );
  var spins = parseInt(document.getElementById("spins").value);
  const singleUnit = parseFloat(document.getElementById("singleUnit").value);

  var totalMoney = initialBalance;
  var currentBet = singleUnit;

  var results = [];
  var moneyFluctuations = [];
  var betHistory = [];
  let redCount = 0;

  for (var i = 0; i < spins && totalMoney >= currentBet; i++) {
    betHistory.push(currentBet);

    var result = spinWheel();

    if (isRed(result)) {
      totalMoney += currentBet; // You win when betting on red
      currentBet = singleUnit;
      redCount++;
    } else {
      totalMoney -= currentBet;
      currentBet = doubleDownBet(currentBet);
    }

    results.push(result);
    moneyFluctuations.push(totalMoney);
  }

  let outOfMoney;
  if (totalMoney < currentBet) {
    outOfMoney = true;
  }

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
  var logsElement = document.getElementById("logs");
  logsElement.innerHTML = "<h5>Logs:</h5>";
  if (outOfMoney) {
    logsElement.innerHTML += "<strong>OUT OF BALANCE, YOU F**KED UP</strong>";
  }
  logsElement.innerHTML +=
    `<p class='log total-money'>${redCount} Reds(${Math.floor(
      (100 * redCount) / betHistory.length
    )}%), End Balance: <strong>$` +
    totalMoney.toFixed(2) +
    "</strong></p>";

  for (var i = 0; i < results.length; i++) {
    var iconClass;

    if (results[i] === 0 || results[i] === 37) {
      iconClass = "fas fa-circle green-icon";
    } else {
      iconClass = isRed(results[i])
        ? "fas fa-circle red-icon"
        : "fas fa-circle black-icon";
    }

    let betMessage = `Bet $${betHistory[i]}, `;
    let resultMessage = isRed(results[i])
      ? `<strong> WIN +$${betHistory[i]}</strong>`
      : `<strong> LOSS -$${betHistory[i]} </strong>`;
    let message = betMessage + resultMessage;

    logsElement.innerHTML +=
      "<p class='log'>" +
      (i + 1) +
      ":    <i class='" +
      iconClass +
      " icon'></i>" +
      getResultText(results[i]) +
      ",  " +
      message +
      ", <strong>Balance - $" +
      moneyFluctuations[i].toFixed(2) +
      "</strong></p>";
  }
}

function spinWheel() {
  return Math.floor(Math.random() * 38); // 38 for 0 and 00
}

function doubleDownBet(previousBet) {
  return previousBet * 2;
}

function isRed(number) {
  // Red numbers in American roulette
  var redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
  ];
  return redNumbers.includes(number);
}

function getResultText(result) {
  if (result === 0) {
    return "0";
  } else if (result === 37) {
    return "00";
  } else {
    return result;
  }
}
