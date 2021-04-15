import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";
import "rsuite/dist/styles/rsuite-default.min.css";
import {
  Slider,
  InputGroup,
  Input,
  RadioGroup,
  Radio,
  Notification,
} from "rsuite";
import { clientUtilities } from "../clientUtilities";
import NumberFormat from "react-number-format";

const Calculator = () => {
  const [userLoanAmount, setUserLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState(12);
  const [interestRate, setInterestRate] = useState(10);
  const [repaymentOption, setRepaymentOption] = useState("interestOnly");
  const [cryptoData, setCryptoData] = useState([]);

  // fetch API with useEffect
  const coinDataEndpoint =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20dash%2C%20ethereum%2C%20litecoin%2C%20dogecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(coinDataEndpoint);
      setCryptoData(result.data);
    };
    fetchData();
  }, []);

  // handle loan range of <5,000 or >25,000,000
  const handleOnBlur = (e) => {
    const loanRange = Number(userLoanAmount.replace(/[^0-9\.-]+/g, ""));
    if (loanRange < 5000) {
      loanRangeErrorNotification("error");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else if (loanRange > 25000000) {
      loanRangeErrorNotification("error");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    setUserLoanAmount(e.target.value);
  };

  // notification for incorrect loan range
  const loanRangeErrorNotification = (errorMessage) => {
    Notification[errorMessage]({
      title: "Error!",
      description: (
        <p style={{ width: 320 }} rows={3}>
          Amount must be more than $5,000 and less than $25,000,000!
          <br />
          <br />
          Page will refresh automatically.
        </p>
      ),
    });
  };

  // principal & interest calculations
  const loanAmount = Number(userLoanAmount.replace(/[^0-9\.-]+/g, ""));
  const interestRateNumber = interestRate / 1200;
  const monthlyPayment =
    (loanAmount * interestRateNumber) /
    (1 - Math.pow(1 / (1 + interestRateNumber), loanTerm));
  const totalLoanCost = monthlyPayment * loanTerm;
  const totalInterest = totalLoanCost - loanAmount;

  // principal & interest currency formatted for display
  const totalLoanCostCurrencyFormat = clientUtilities.formatMoney(
    Math.round(totalLoanCost)
  );
  const monthlyPaymentCurrencyFormat = clientUtilities.formatMoney(
    Math.round(monthlyPayment)
  );
  const totalInterestCurrencyFormat = clientUtilities.formatMoney(
    Math.round(totalInterest)
  );

  // interest only calculations
  const interestOnlyTotalInterest = loanAmount * interestRateNumber * loanTerm;
  const interestOnlyTotalLoanCost = loanAmount + interestOnlyTotalInterest;
  const interestOnlyMonthlyPayment = interestOnlyTotalInterest / loanTerm;
  const interestOnlyLastPayment =
    interestOnlyTotalLoanCost - interestOnlyMonthlyPayment * (loanTerm - 1);

  // interest only currency formatted for display
  const interestOnlyTotalInterestCurrencyFormat = clientUtilities.formatMoney(
    Math.round(interestOnlyTotalInterest)
  );
  const interestOnlyTotalLoanCostCurrencyFormat = clientUtilities.formatMoney(
    Math.round(interestOnlyTotalLoanCost)
  );
  const interestOnlyMonthlyPaymentCurrencyFormat = clientUtilities.formatMoney(
    Math.round(interestOnlyMonthlyPayment)
  );
  const interestOnlyLastPaymentCurrencyFormat = clientUtilities.formatMoney(
    Math.round(interestOnlyLastPayment)
  );

  // collateral calculation and formatted for display
  const collateralNeeded = (2 / 3) * loanAmount + loanAmount;
  const collateralNeededCurrencyFormat = clientUtilities.formatMoney(
    Math.round(collateralNeeded)
  );

  // stake salt calculation and formatted for display
  const stakeSalt = loanAmount * 0.0981522;
  const stakeSaltDisplayFormat = clientUtilities.numberWithCommas(Math.round(stakeSalt));



  const coinDisplayValues = cryptoData.map((item) => {
    const coinImage = item.image;
    const coinPrice = clientUtilities.formatMoney(
      collateralNeeded / item.current_price
    );
    const coinName = item.symbol.toUpperCase();

    return (
      <li>
        <img className="loan-calculator__coin-symbol" src={coinImage} alt="" />
        {coinPrice} {coinName}
      </li>
    );
  });

  return (
    <div>
      <h1 className="loan-calculator__title">Loan Calculator</h1>
      <div className="loan-calculator__container">
        <div className="loan-calculator__input-display-container">
          <p className="loan-calculator__input-labels">
            How much do you want to borrow?
          </p>
          <NumberFormat
            className="loan-calculator__input-containers loan-calculator__user-loan-amount-input"
            defaultValue={5000}
            min={5000}
            max={25000000}
            thousandSeparator={true}
            prefix={"$   "}
            placeholder={"$   5,000"}
            onChange={(e) => {
              setUserLoanAmount(e.target.value);
            }}
            value={userLoanAmount}
            onBlur={handleOnBlur}
          />
          <p className="loan-calculator__input-labels">
            How long do you need to pay back?
          </p>
          <Slider
            className="loan-calculator__loan-term-slider loan-calculator__input-containers"
            type="range"
            defaultValue={12}
            step={1}
            progress
            graduated
            min={3}
            max={36}
            onChange={(e) => {
              setLoanTerm(e);
            }}
          />
          <br />
          <b className="loan-calculator__loan-term-display">
            {loanTerm} months
          </b>
          <p className="loan-calculator__input-labels loan-calculator__ltv-label">
            Loan-to-Value (LTV)
          </p>
          <RadioGroup
            className="loan-calculator__input-containers loan-calculator__ltv-radio-group"
            name="loanToValue"
            inline
            appearance="picker"
            defaultValue={10}
            onChange={(e) => {
              setInterestRate(e);
            }}
          >
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value={7}
            >
              30%
            </Radio>

            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value={8}
            >
              40%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value={9}
            >
              50%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value={12}
            >
              60%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value={11}
            >
              70%
            </Radio>
          </RadioGroup>
          <p className="loan-calculator__input-labels loan">Repayment Option</p>
          <RadioGroup
            className="loan-calculator__repayment-option-radio-group"
            name="repaymentOptions"
            inline
            appearance="picker"
            defaultValue="interestOnly"
          >
            <Radio
              className="loan-calculator__repayment-options asdf"
              value="interestOnly"
              onClick={() => setRepaymentOption("interestOnly")}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Interest
              Only&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Radio>
            <Radio
              className="loan-calculator__repayment-options"
              value="interestPlusPrincipal"
              onClick={() => setRepaymentOption("interestPlusPrincipal")}
            >
              Principal & Interest
            </Radio>
          </RadioGroup>
        </div>
        <div className="loan-calculator__calculation-display-container">
          <div>
            {repaymentOption === "interestOnly" ? (
              <div>
                <p className="loan-calculator__monthly-payment-title">
                  Monthly Payment ({loanTerm - 1} Months)
                </p>
                <h3 style={{ textAlign: "left" }}>
                  {interestOnlyMonthlyPaymentCurrencyFormat}
                </h3>
                <p className="loan-calculator__currency-displays loan-calculator__last-payment">
                  Last Payment: {interestOnlyLastPaymentCurrencyFormat}
                </p>
              </div>
            ) : (
              <div>
                <div>
                  <p className="loan-calculator__monthly-payment-title">
                    Monthly Payment ({loanTerm} Months)
                  </p>
                </div>
                <h3 style={{ textAlign: "left" }}>
                  {monthlyPaymentCurrencyFormat}
                </h3>
              </div>
            )}
            <div className="loan-calculator__display-row">
              <div className="loan-calculator__display-items">
                <p className="loan-calculator__display-titles">Loan Amount</p>
                <p className="loan-calculator__currency-displays">
                  {userLoanAmount ? userLoanAmount : "$0"}
                </p>
              </div>
              <div className="loan-calculator__display-items">
                <p className="loan-calculator__display-titles">Interest Rate</p>
                <p className="loan-calculator__currency-displays">
                  {" "}
                  {interestRate}.00%
                </p>
              </div>
            </div>

            <div className="loan-calculator__display-row">
              <div className="loan-calculator__display-items">
                <p className="loan-calculator__display-titles">
                  Total Loan Cost
                </p>
                <p className="loan-calculator__currency-displays">
                  {repaymentOption === "interestOnly"
                    ? interestOnlyTotalLoanCostCurrencyFormat
                    : totalLoanCostCurrencyFormat}
                </p>
              </div>
              <div className="loan-calculator__display-items">
                <p className="loan-calculator__display-titles">Interest</p>
                <p className="loan-calculator__currency-displays">
                  {repaymentOption === "interestOnly"
                    ? interestOnlyTotalInterestCurrencyFormat
                    : totalInterestCurrencyFormat}
                </p>
              </div>
            </div>
            <p
              style={{ textAlign: "left" }}
              className="loan-calculator__display-titles loan-calculator__collateral-needed-title"
            >
              Collateral Needed
            </p>
            <p className="loan-calculator__currency-displays loan-calculator__collateral-needed-display">
              {collateralNeededCurrencyFormat} USD worth of:
            </p>
            <div className="loan-calculator__coin-display-container">
              <div className="loan-calculator__coin-display">
                {coinDisplayValues}
              </div>
            </div>
            <div className="loan-calculator__stake-salt-container">
              <p className="loan-calculator__display-titles">Stake SALT</p>
              <p className="loan-calculator__stake-salt-display">
               <b> {stakeSaltDisplayFormat} </b> ∆
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
