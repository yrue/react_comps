import {useState} from 'react';

// Question:
// 1. which node to use

// Requirements:
// 1. validation - string -> empty
// 2. format - .2
// 3. show value

// what if any of the field is empty?

// enum
const INPUT_FIELDS = {
    P: 'loan-amount',
    APR: 'apr',
    TERM: 'loan-term'
  }
  
  // in comp or out?
  const format = (value: string) => {
    return /\d{3}/.test(value) ? Number(value).toFixed(2) : value;
  }
  
  const isValid = (value: string) => {
    return value.length !== 0 && !isNaN(Number(value))
  }
  
  const calculateM = ({p, i, n}) => {
    // TODO: handle Math.pow(1+i, n) - 1 === 0?
    // TODO: fix later
    return (p*(i*Math.pow(1+i, n)))/(Math.pow(1+i, n) - 1)
  }

const MortgageCalculator = () => {
    const [params, setParams] = useState({}) // [Question]: 3 states or 1?
    const handleInputChange = ({target: {name, value}}) => {
      setParams(prev => ({...prev, [name]: isValid(value) ? value : ''}))
    }
  
    console.log({params})
  
    const p = Number(params[INPUT_FIELDS.P] || '')
    const apr = Number(params[INPUT_FIELDS.APR] || '')
    const term = Number(params[INPUT_FIELDS.TERM] || '')
    console.log({p, apr, term})
    const i = apr/100/12;
    const n = term*12;
    const monthlyMortgagePayment = calculateM({p, i, n}) // format
    const invalidInputNames = Object.entries(params).filter(([name, value]) => {
          console.log({name, value}, value === '')
          return value === ''
        }).map(([name]) => name)
  
    // console.log(Object.entries(params).filter(([name, value])))
  
    return (
      <>
      <form style={{display:'flex', flexDirection: 'column'}} onChange={handleInputChange}>
        <label htmlFor={INPUT_FIELDS.P}>Loan amount ($)</label>
        <input id={INPUT_FIELDS.P} name={INPUT_FIELDS.P} type="text" />
        <label htmlFor={INPUT_FIELDS.APR}>Annual interest rate (%)</label>
        <input id={INPUT_FIELDS.APR} name={INPUT_FIELDS.APR} type="text" />
        <label htmlFor={INPUT_FIELDS.TERM}>Loan term (in years)</label>
        <input id={INPUT_FIELDS.TERM} name={INPUT_FIELDS.TERM} type="text" />
        <div>Invalid input for {invalidInputNames.join(',')}</div>
        {/* [Question] use a button? */}
      </form>
  
      <div>
        <p>Monthly mortgage payment: ${format(monthlyMortgagePayment)}</p>
        <p>Total payment amount: {n}</p>
        <p>Total interest paid: {}</p>
      </div>
      </>
    );
};

export default MortgageCalculator;
