
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Calculator as CalculatorIcon, Edit, History } from 'lucide-react';
import CalculatorHistory from './CalculatorHistory';

interface CalculatorProps {}

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

const Calculator: React.FC<CalculatorProps> = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addToHistory = (expression: string, result: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
  };

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setIsEditing(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const performScientificOperation = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'inverse':
        result = 1 / inputValue;
        break;
      default:
        return;
    }

    const expression = `${func}(${inputValue})`;
    const resultStr = String(result);
    addToHistory(expression, resultStr);

    setDisplay(resultStr);
    setWaitingForOperand(true);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const inputValue = parseFloat(display);
      const newValue = calculate(previousValue, inputValue, operation);
      const expression = `${previousValue} ${operation} ${inputValue}`;
      const resultStr = String(newValue);
      
      addToHistory(expression, resultStr);
      
      setDisplay(resultStr);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditing) {
      setDisplay(e.target.value);
    }
  };

  const handleDisplayKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      const value = parseFloat(display);
      if (!isNaN(value)) {
        setDisplay(String(value));
      }
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setDisplay(entry.result);
    setShowHistory(false);
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const CalculatorButton: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    variant?: 'default' | 'operator' | 'function' | 'equals';
  }> = ({ onClick, className = '', children, variant = 'default' }) => {
    const baseClass = "h-16 text-xl font-semibold rounded-xl transition-all duration-150 active:scale-95 shadow-lg";
    const variantClasses = {
      default: "bg-gray-700 hover:bg-gray-600 text-white",
      operator: "bg-orange-500 hover:bg-orange-400 text-white",
      function: "bg-gray-600 hover:bg-gray-500 text-white text-sm",
      equals: "bg-orange-500 hover:bg-orange-400 text-white"
    };

    return (
      <Button
        onClick={onClick}
        className={`${baseClass} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </Button>
    );
  };

  if (showHistory) {
    return (
      <CalculatorHistory
        history={history}
        onBack={() => setShowHistory(false)}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className="bg-black/90 backdrop-blur-lg border-gray-800 p-6 rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CalculatorIcon className="text-orange-500" size={24} />
            <h1 className="text-white font-bold text-lg">Calculator</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleEdit}
              variant="ghost"
              className={`text-orange-500 hover:bg-orange-500/20 rounded-xl ${isEditing ? 'bg-orange-500/20' : ''}`}
            >
              <Edit size={20} />
            </Button>
            <Button
              onClick={() => setShowHistory(true)}
              variant="ghost"
              className="text-orange-500 hover:bg-orange-500/20 rounded-xl"
            >
              <History size={20} />
            </Button>
            <Button
              onClick={() => setIsAdvanced(!isAdvanced)}
              variant="ghost"
              className="text-orange-500 hover:bg-orange-500/20 rounded-xl"
            >
              {isAdvanced ? 'Normal' : 'Advanced'}
            </Button>
          </div>
        </div>

        {/* Display */}
        <div className="bg-gray-900/50 rounded-2xl p-6 mb-6">
          <div className="text-right">
            <div className="text-gray-400 text-sm mb-1">
              {operation && previousValue !== null ? `${previousValue} ${operation}` : ''}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={display}
                onChange={handleDisplayChange}
                onKeyPress={handleDisplayKeyPress}
                onBlur={() => setIsEditing(false)}
                className="bg-transparent text-white text-4xl font-light overflow-hidden w-full text-right outline-none"
                autoFocus
              />
            ) : (
              <div className="text-white text-4xl font-light overflow-hidden">
                {display}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Functions Row */}
        {isAdvanced && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <CalculatorButton onClick={() => performScientificOperation('sin')} variant="function">
              sin
            </CalculatorButton>
            <CalculatorButton onClick={() => performScientificOperation('cos')} variant="function">
              cos
            </CalculatorButton>
            <CalculatorButton onClick={() => performScientificOperation('tan')} variant="function">
              tan
            </CalculatorButton>
            <CalculatorButton onClick={() => performScientificOperation('log')} variant="function">
              log
            </CalculatorButton>
          </div>
        )}

        {isAdvanced && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            <CalculatorButton onClick={() => performScientificOperation('ln')} variant="function">
              ln
            </CalculatorButton>
            <CalculatorButton onClick={() => performScientificOperation('sqrt')} variant="function">
              √
            </CalculatorButton>
            <CalculatorButton onClick={() => performScientificOperation('square')} variant="function">
              x²
            </CalculatorButton>
            <CalculatorButton onClick={() => performScientificOperation('inverse')} variant="function">
              1/x
            </CalculatorButton>
          </div>
        )}

        {/* First Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <CalculatorButton onClick={clear} variant="function">
            AC
          </CalculatorButton>
          <CalculatorButton onClick={() => {}} variant="function">
            +/-
          </CalculatorButton>
          <CalculatorButton onClick={() => {}} variant="function">
            %
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation('÷')} variant="operator">
            ÷
          </CalculatorButton>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <CalculatorButton onClick={() => inputNumber('7')}>7</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber('8')}>8</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber('9')}>9</CalculatorButton>
          <CalculatorButton onClick={() => performOperation('×')} variant="operator">
            ×
          </CalculatorButton>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <CalculatorButton onClick={() => inputNumber('4')}>4</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber('5')}>5</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber('6')}>6</CalculatorButton>
          <CalculatorButton onClick={() => performOperation('-')} variant="operator">
            −
          </CalculatorButton>
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <CalculatorButton onClick={() => inputNumber('1')}>1</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber('2')}>2</CalculatorButton>
          <CalculatorButton onClick={() => inputNumber('3')}>3</CalculatorButton>
          <CalculatorButton onClick={() => performOperation('+')} variant="operator">
            +
          </CalculatorButton>
        </div>

        {/* Fifth Row */}
        <div className="grid grid-cols-4 gap-3">
          <CalculatorButton onClick={() => inputNumber('0')} className="col-span-2">
            0
          </CalculatorButton>
          <CalculatorButton onClick={inputDecimal}>.</CalculatorButton>
          <CalculatorButton onClick={handleEquals} variant="equals">
            =
          </CalculatorButton>
        </div>
      </Card>
    </div>
  );
};

export default Calculator;
