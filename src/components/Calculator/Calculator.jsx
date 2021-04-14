import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.scss";
import "rsuite/dist/styles/rsuite-default.min.css";
import { Slider, InputGroup, Input, RadioGroup, Radio } from "rsuite";
import { clientUtilities } from "../clientUtilities";

const loanAmountStyles = {
  width: 300,
  marginBottom: 10,
};

function Calculator() {
  const [userLoanAmount, setUserLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState(12);
  const [interestRate, setInterestRate] = useState("10");
  const [repaymentOption, setRepaymentOption] = useState("interestOnly");

  const [cryptoData, setCryptoData] = useState([]);

  const cryptoCompareApi =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20dash%2C%20ethereum%2C%20litecoin%2C%20dogecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false";

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(cryptoCompareApi);
      setCryptoData(result.data);
    };
    fetchData();
  }, []);

  const handleOnBlur = (e) => {
    const loanRange = parseInt(userLoanAmount);
    console.log(`loanRange`, loanRange);
    if (loanRange < 5000) {
      console.log("Loan amount must be greater than $5,000");
    } else if (loanRange > 25000000) {
      console.log("Loan amount must be less than $25,000,000");
    }
    setUserLoanAmount(e.target.value);
  };
  //   console.log(`userLoanAmount`, typeof userLoanAmount);

  // principal & interest calculations
  const loanAmount = Number(userLoanAmount.replace(/[^0-9\.-]+/g, ""));
  const interestRateNumber = parseInt(interestRate) / 1200;
  const monthlyPayment =
    (loanAmount * interestRateNumber) /
    (1 - Math.pow(1 / (1 + interestRateNumber), loanTerm));
  const totalLoanCost = monthlyPayment * loanTerm;
  const totalInterest = totalLoanCost - loanAmount;

  // interest only calculations
  const interestOnlyTotalInterest = loanAmount * interestRateNumber * loanTerm;
  const interestOnlyTotalLoanCost = loanAmount + interestOnlyTotalInterest;
  const interestOnlyMonthlyPayment = interestOnlyTotalInterest / loanTerm;
  const interestOnlyLastPayment =
    interestOnlyTotalLoanCost - interestOnlyMonthlyPayment * (loanTerm - 1);

  // principal & interest currency formatted
  const totalLoanCostCurrencyFormat = clientUtilities.formatMoney(
    Math.round(totalLoanCost)
  );
  const loanAmountCurrencyFormat = clientUtilities.formatMoney(
    parseInt(userLoanAmount)
  );
  const monthlyPaymentCurrencyFormat = clientUtilities.formatMoney(
    Math.round(monthlyPayment)
  );
  const totalInterestCurrencyFormat = clientUtilities.formatMoney(
    Math.round(totalInterest)
  );

  // interest only formatted options
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

  // collateral calculations
  const collateralNeeded = (2 / 3) * loanAmount + loanAmount;
  const collateralNeededCurrencyFormat = clientUtilities.formatMoney(
    Math.round(collateralNeeded)
  );

  const coinDisplay = cryptoData.map((item) => {
    const coinId = item.image;
    const coinPrice = clientUtilities.formatMoney(
      collateralNeeded / item.current_price
    );
    // clientUtilities.formatMoney(item.current_price);
    const coinName = item.symbol.toUpperCase();

    return (
      <div>
        <img className="loan-calculator__coin-symbol" src={coinId} alt="" />{" "}
        {coinPrice} {coinName}
      </div>
    );
  });

  return (
    <div>
      <h1>Loan Calculator</h1>
      <div className="loan-calculator__container">
        <div className="loan-calculator__input-display">
          <p>How much do you want to borrow?</p>

          <InputGroup
            type="number"
            defaultValue={5000}
            min={5000}
            max={25000000}
            inside
            styles={loanAmountStyles}
            onChange={(e) => {
              setUserLoanAmount(e.target.value);
            }}
            onBlur={handleOnBlur}
          >
            <InputGroup.Addon>$</InputGroup.Addon>
            <Input placeholder="Enter amount" />
          </InputGroup>
          <p>How long do you need to pay back?</p>
          <Slider
            type="range"
            defaultValue={12}
            step={1}
            graduated
            progress
            min={3}
            max={36}
            onChange={(e) => {
              setLoanTerm(e);
            }}
          />
          <br />
          <b>{loanTerm} Months</b>
          <p>Loan-to-Value (LTV)</p>
          <RadioGroup
            name="loanToValue"
            inline
            appearance="picker"
            defaultValue="10"
            onChange={(e) => {
              setInterestRate(e);
            }}
          >
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value="7"
            >
              30%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value="8"
            >
              40%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value="9"
            >
              50%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value="10"
            >
              60%
            </Radio>
            <Radio
              className="loan-calculator__ltv-selections"
              type="number"
              value="11"
            >
              70%
            </Radio>
          </RadioGroup>
          <p>Repayment Option</p>
          <RadioGroup
            name="repaymentOptions"
            inline
            appearance="picker"
            defaultValue="interestOnly"
          >
            <Radio
              value="interestOnly"
              onClick={() => setRepaymentOption("interestOnly")}
            >
              Interest Only
            </Radio>
            <Radio
              value="interestPlusPrincipal"
              onClick={() => setRepaymentOption("interestPlusPrincipal")}
            >
              Principal & Interest
            </Radio>
          </RadioGroup>
        </div>
        {repaymentOption === "interestOnly" ? (
          <div className="loan-calculator__calculation-display">
            <p>Monthly Payment ({loanTerm - 1} Months)</p>
            {interestOnlyMonthlyPaymentCurrencyFormat}
            <p>Last Payment</p>
            {interestOnlyLastPaymentCurrencyFormat}
            <p>Loan Amount</p>
            {loanAmountCurrencyFormat}
            <p>Interest Rate</p>
            {interestRate}.00%
            <p>Total Loan Cost</p>
            {interestOnlyTotalLoanCostCurrencyFormat}
            <p>Interest</p>
            {interestOnlyTotalInterestCurrencyFormat}
            <p>Collateral Needed </p>
            {collateralNeededCurrencyFormat} USD worth of:
            {coinDisplay}
          </div>
        ) : (
          <div className="loan-calculator__calculation-display">
            <p>Monthly Payment ({loanTerm} Months)</p>
            {monthlyPaymentCurrencyFormat}
            <p>Loan Amount</p>
            {loanAmountCurrencyFormat}
            <p>Interest Rate</p> {interestRate}.00%
            <p>Total Loan Cost</p>
            {totalLoanCostCurrencyFormat}
            <p>Interest</p>
            {totalInterestCurrencyFormat}
            <p>Collateral Needed</p>
            {collateralNeededCurrencyFormat} USD worth of:
            {coinDisplay}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
