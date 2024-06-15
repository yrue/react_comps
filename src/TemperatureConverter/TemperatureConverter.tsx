import { useState } from 'react';

/**
 * 1. Initially, both fields are empty. When a number value is entered into a text input, the other input will be calculated and reflected.
 * 2. Round to 4 decimal places where necessary. 💎 Regexp \d, toFixed()
 * 3. If a non-numerical string is entered into one input, the other input will be blank. 💎 Number()
 * @returns 
 */
const TemperatureConverter = () => {
    const [celsiusValue, setCelsiusValue] = useState<string>('');
    const [fahrenheitValue, setFahrenheitValue] = useState<string>('');
    // [Question]: merge onChange into a single handler? GFE approach extract convert() -> depends

    const format = (number: number|null): string => {
        if (!number) return '';
        // Show 4 d.p. if number has more than 4 decimal places.
        const formattedValue = /\.\d{5}/.test(number.toString())
            ? Number(number).toFixed(4)
            : number;
        return formattedValue.toString()
    }

    const isValid = (value: string): boolean => {
        return !isNaN(Number(value)) && value.length > 0
    }

    return (
        <>
            <div>
                <label htmlFor='celsius'>Celsius</label>
                <input id='celsius' value={celsiusValue} onChange={e => {
                    const newValue = e.target.value;
                    setCelsiusValue(newValue)
                    const newFahrenheit = isValid(newValue) ? 1.8 * parseFloat(newValue || '0') + 32 : null;
                    setFahrenheitValue(format(newFahrenheit)); // [Question]: when to put format? here or when rendering?
                }} />
            </div>
            <div>
                <label htmlFor='fahrenheit'>Fahrenheit</label>
                <input id='fahrenheit' value={fahrenheitValue} onChange={e => {
                    const newValue = e.target.value;
                    setFahrenheitValue(newValue)
                    const newCelsiusValue = isValid(newValue) ? (parseFloat(newValue) - 32) / 1.8 : null;
                    setCelsiusValue(format(newCelsiusValue));
                }} />
            </div>

        </>);
};

export default TemperatureConverter;
