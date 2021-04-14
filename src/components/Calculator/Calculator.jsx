import React, { useState, useEffect } from "react";
import "rsuite/dist/styles/rsuite-default.min.css";
import { Slider, InputGroup, Input, RadioGroup, Radio } from "rsuite";

const loanAmountStyles = {
  width: 300,
  marginBottom: 10,
};

function Calculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState(12);
  const [interestRate, setInterestRate] = useState("10");
  const [repaymentOption, setRepaymentOption] = useState("interestOnly");
  return (
    <div>
      <h1>Loan Calculator</h1>
      <div className="loan-calculator__container">
        <div className="loan-calculator__input-container">
          <p>How much do you want to borrow?</p>
        </div>
        <div className="loan-calculator__display-container">
          <InputGroup
            type="number"
            defaultValue={5000}
            min={5000}
            max={25000000}
            inside
            styles={loanAmountStyles}
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
            <p>({loanTerm - 1} Months)</p>
            <p>Last Payment</p>
            <p>Loan Amount</p>
            <p>Interest Rate</p>
            {interestRate}%<p>Total Loan Cost</p>
            <p>Interest</p>
            <p>Collateral Needed </p>
            $$ USD worth of: cryptoValues
          </div>
        ) : (
          <div className="loan-calculator__calculation-display">
            <p>({loanTerm} Months)</p>
            <p>Loan Amount</p>
            <p>Interest Rate</p> {interestRate}%<p>Total Loan Cost</p>
            <p>Interest</p>
            <p>Collateral Needed</p>
            $$ USD worth of:
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;
