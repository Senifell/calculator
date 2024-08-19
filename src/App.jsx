import { useState } from 'react';
import './App.css';

function App() {
  const [output, setOutput] = useState("0");
  const [formula, setFormula] = useState("");
  const [lastIsInteger, setLastIsInteger] = useState(true);
  const [evaluated, setEvaluated] = useState(false);

  const calculateInteger = (e) => {
    const value = e.target.value;

    if (!isNaN(value)) {
      if (evaluated) {
        setOutput(value);
        setFormula(value);
        setEvaluated(false);
      } else {
        if (lastIsInteger) {
          setOutput(prevValue => prevValue === "0" ? value : prevValue + value);
          setFormula(prevValue => prevValue === "0" ? value : prevValue + value);
        } else {
          setOutput(value);
          setFormula(prevValue => prevValue + value);
        }
        setLastIsInteger(true);
      }
    }
  };

  const clearAll = () => {
    setFormula("");
    setOutput("0");
    setLastIsInteger(true);
    setEvaluated(false);
  };

  const calculateOperator = (e) => {
    const value = e.target.value;

    if (isNaN(value)) {
      if (evaluated) {
        setFormula(output + value);
        setOutput(value);
        setEvaluated(false);
        return;
      }

      setOutput(value);

      setFormula(prevValue => {
        const lastChar = prevValue.slice(-1);
        const secondLastChar = prevValue.slice(-2, -1);

        if (!/[+\-*/]/.test(lastChar)) {
          return prevValue + value;
        }

        if (/[+\-*/]/.test(lastChar) && !/[+\-*/]/.test(secondLastChar)) {
          if (value === "-") {
            return prevValue + value;
          } else {
            return prevValue.slice(0, -1) + value;
          }
        }

        if (/[+\-*/]/.test(lastChar) && /[+\-*/]/.test(secondLastChar)) {
          if (value === "-" && secondLastChar === "-" && lastChar === "-") {
            return prevValue;
          } else {
            return prevValue.slice(0, -2) + value;
          }
        }

        return prevValue + value;
      });

      setLastIsInteger(false);
    }
  };

  const calculateDecimal = () => {
    setOutput(prevValue => {
      const parts = prevValue.split(/([+\-*/])/);
      const lastPart = parts[parts.length - 1];

      if (!prevValue || /[+\-*/]$/.test(prevValue)) {
        setFormula(prevFormula => {
          if (prevFormula.length === 0 || /[+\-*/]$/.test(prevFormula)) {
            return prevFormula + "0.";
          }
          return prevFormula;
        });
        return prevValue + "0.";
      }

      if (lastPart.includes(".")) {
        return prevValue;
      }

      const newOutput = prevValue + ".";

      setFormula(prevFormula => {
        const partsForFormula = prevFormula.split(/([+\-*/])/);
        const lastPartForFormula = partsForFormula[partsForFormula.length - 1];
        if (lastPartForFormula.includes(".")) {
          return prevFormula;
        }
        return prevFormula + ".";
      });

      return newOutput;
    });
  };

  const calculateAll = () => {
    if (/^[+\-*/]*$/.test(formula) || formula.trim() === "") {
      setOutput("Error");
      setFormula("Error");
      return;
    }

    let expression = formula
      .replace(/x/g, "*")
      .replace(/--/g, "+");

    try {
      let result = eval(expression);
      if (!isFinite(result)) {
        throw new Error("Math Error");
      }

      result = Math.round(result * 1000000000) / 1000000000;

      setFormula(`${expression}=${result}`);
      setOutput(result.toString());
      setEvaluated(true);
    } catch (error) {
      setFormula("Error");
      setOutput("Error");
    }
  };

  return (
    <div className='calculator'>
      <div className='formulaScreen'>{formula}</div>
      <div className='outputScreen' id="display">{output}</div>
      <div>
        <button className='longButton' id="clear" value="AC" onClick={clearAll}>AC</button>
        <button id="divide" value="/" onClick={calculateOperator}>/</button>
        <button id="multiply" value="*" onClick={calculateOperator}>x</button>
        <button id="seven" value="7" onClick={calculateInteger}>7</button>
        <button id="eight" value="8" onClick={calculateInteger}>8</button>
        <button id="nine" value="9" onClick={calculateInteger}>9</button>
        <button id="subtract" value="-" onClick={calculateOperator}>-</button>
        <button id="four" value="4" onClick={calculateInteger}>4</button>
        <button id="five" value="5" onClick={calculateInteger}>5</button>
        <button id="six" value="6" onClick={calculateInteger}>6</button>
        <button id="add" value="+" onClick={calculateOperator}>+</button>
        <button id="one" value="1" onClick={calculateInteger}>1</button>
        <button id="two" value="2" onClick={calculateInteger}>2</button>
        <button id="three" value="3" onClick={calculateInteger}>3</button>
        <button className='longButton' id="zero" value="0" onClick={calculateInteger}>0</button>
        <button id="decimal" value="." onClick={calculateDecimal}>.</button>
        <button className='highButton' id="equals" value="=" onClick={calculateAll}>=</button>
      </div>
    </div>
  );
}

export default App;
