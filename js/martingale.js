function simulateSingleGame() {
  const singleGameInitialBalance = parseFloat(
    document.getElementById("singleGameInitialBalance").value
  );
  const singleGameSpinCount = parseInt(
    document.getElementById("singleGameSpinCount").value
  );
  const singleGameSingleUnit = parseFloat(
    document.getElementById("singleGameSingleUnit").value
  );

  simulateHelper(
    singleGameInitialBalance,
    singleGameSingleUnit,
    singleGameSpinCount
  );
}

function simulateMultiGame() {
  const multiGameInitialBalance = parseFloat(
    document.getElementById("multiGameInitialBalance").value
  );
  const multiGameSingleUnit = parseFloat(
    document.getElementById("multiGameSingleUnit").value
  );
  const multiGameSpinCount = parseInt(
    document.getElementById("multiGameSpinCount").value
  );
  const multiGameNum = parseFloat(
    document.getElementById("multiGameNum").value
  );

  // for multiGame track win loss infomation
  const multiGameResult = [];
  for (let i = 0; i < multiGameNum; i++) {
    multiGameResult.push(
      simulateHelper(
        multiGameInitialBalance,
        multiGameSingleUnit,
        multiGameSpinCount,
        true
      )
    );
  }

  let failedNum = 0;
  let successNum = 0;
  let redPercentage = 0;

  for (let i = 0; i < multiGameResult.length; i++) {
    redPercentage += Number(multiGameResult[i].redPercentage);
    if (multiGameResult[i].rounds < multiGameSpinCount) {
      failedNum++;
    } else {
      successNum++;
    }
  }

  redPercentage = (redPercentage / multiGameNum).toFixed(2);

  displayMultiGameSummary(
    multiGameInitialBalance,
    multiGameNum,
    multiGameResult,
    multiGameNum,
    failedNum,
    successNum,
    redPercentage
  );
}

function simulateHelper(
  initialBalance,
  singleUnit,
  spinCount,
  multiGame = false
) {
  let totalMoney = initialBalance;
  let currentBet = singleUnit;

  const results = [];
  const moneyFluctuations = [];
  const betHistory = [];
  let redCount = 0;

  for (let i = 0; i < spinCount && totalMoney >= currentBet; i++) {
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

  if (!multiGame) {
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
  const redPercentage = ((100 * redCount) / betHistory.length).toFixed(2);
  return { redPercentage, totalMoney, rounds: betHistory.length };
}

function displayMultiGameSummary(
  multiGameInitialBalance,
  multiGameNum,
  multiGameResult,
  multiGameNum,
  failedNum,
  successNum,
  redPercentage
) {
  const logsElement = document.getElementById("multiGameSummary");
  const winPercentage = ((100 * successNum) / multiGameNum).toFixed(2);
  logsElement.innerHTML = "<h4>Summary:</h4>";
  logsElement.innerHTML += `<p class='mb-2'><strong>Completed ${multiGameNum} games<br/> Ran out of balance for ${failedNum} games<br/>Won money in ${successNum} games, ${winPercentage}%<br/><span style="color: red;">Reds</span>(${redPercentage}%)</span></strong></p>`;

  for (let i = 0; i < multiGameNum; i++) {
    const money = multiGameResult[i].totalMoney;
    const round = multiGameResult[i].rounds;

    if (money > multiGameInitialBalance) {
      logsElement.innerHTML += `<p class='log'>Game ${
        i + 1
      }: <span style='color: green; font-weight: bold;'>Congrats finishing with $${money}</span></p>`;
    } else {
      logsElement.innerHTML += `<p class='log'>Game ${
        i + 1
      }: <span style='color: red; font-weight: bold;'>Didn't complete game, ran out in ${round} rounds with $${money}</span></p>`;
    }
  }
}

function displayLogs(
  results,
  betHistory,
  moneyFluctuations,
  totalMoney,
  outOfMoney,
  redCount
) {
  const logsElement = document.getElementById("singleGameLogs");
  logsElement.innerHTML = "<h4 class='mb-4'>Logs:</h4>";

  const roundCount = results.length;

  if (outOfMoney) {
    logsElement.innerHTML += `<h6><strong>OUT OF FUNDS at spin ${roundCount}, better luck next time</strong><h6>`;
  }

  const redPercentage = ((100 * redCount) / roundCount).toFixed(2);
  logsElement.innerHTML += `<h6 class='mb-4'>${redCount} <span style="color: red;">Reds</span>(${redPercentage}%), End Balance: <strong>$${totalMoney.toFixed(
    2
  )}</strong></h6>`;

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
    )},  ${message}, <strong>Balance $${moneyFluctuations[i].toFixed(
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

function oddsHelper(initialBalance, singleUnit, targetGain) {
  let totalMoney = initialBalance;
  let currentBet = singleUnit;

  const results = [];
  const moneyFluctuations = [];
  const betHistory = [];
  let win = false;
  let redCount = 0;

  while (win === false && totalMoney >= currentBet) {
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
    if (totalMoney - initialBalance >= targetGain) {
      win = true;
    }
  }
  const redPercentage = ((100 * redCount) / betHistory.length).toFixed(2);
  return { redPercentage, totalMoney, rounds: betHistory.length, win };
}

function simulateOdds() {
  const oddsInitialBalance = parseFloat(
    document.getElementById("oddsInitialBalance").value
  );
  const oddsSingleUnit = parseFloat(
    document.getElementById("oddsSingleUnit").value
  );
  const oddsTargetGain = parseFloat(
    document.getElementById("oddsTargetGain").value
  );
  const oddsGameNum = parseInt(document.getElementById("oddsGameNum").value);

  let simulateResult = [];
  for (let i = 0; i < oddsGameNum; i++) {
    simulateResult.push(
      oddsHelper(oddsInitialBalance, oddsSingleUnit, oddsTargetGain)
    );
  }
  let successNum = 0;
  let redPercentageCount = 0;
  for (let i = 0; i < simulateResult.length; i++) {
    redPercentageCount += Number(simulateResult[i].redPercentage);
    if (simulateResult[i].win) {
      successNum++;
    }
  }
  winPercentage = ((100 * successNum) / oddsGameNum).toFixed(2);
  redPercentageCount = (redPercentageCount / oddsGameNum).toFixed(2);
  displayOddsSummary(
    simulateResult,
    successNum,
    winPercentage,
    redPercentageCount
  );
}

function displayOddsSummary(result, successNum, winPercentage, redPercentage) {
  const logsElement = document.getElementById("oddsSummary");
  logsElement.innerHTML = "<h4>Summary:</h4>";
  logsElement.innerHTML += `<p class='mb-2'><strong>Reached target gain in ${successNum} games(${winPercentage}%)<br/> <span style="color: red;">Reds</span>(${redPercentage}%)</span></strong></p>`;

  for (let i = 0; i < result.length; i++) {
    const money = result[i].totalMoney;
    const round = result[i].rounds;
    if (result[i].win === true) {
      logsElement.innerHTML += `<p class='log'>Game ${
        i + 1
      }: <span style='color: green; font-weight: bold;'>Reached $${money} in ${round} rounds</span></p>`;
    } else {
      logsElement.innerHTML += `<p class='log'>Game ${
        i + 1
      }: <span style='color: red; font-weight: bold;'>Didn't complete game, ran out in ${round} rounds with $${money}</span></p>`;
    }
  }
}
