import { useState } from 'react';
import styles from './FlightBooker.module.scss'

export enum Options {
    oneWay = 'One Way',
    return = 'Return'
}

type InputDate = string;
type InputDates = InputDate[];
type DateObj = Record<Options, InputDates>

const compareDate = (dates: InputDates, minDate: string): string => {
    for (const date of dates) {
        if (date < minDate) return `Input '${date}' is earlier than '${minDate}'.`
    }
    return ''
}

export const getDateISOString = (date: Date): string => date.toISOString().slice(0, 10);
const getToday = (): string => getDateISOString(new Date());

enum InputName {
    departure = 'departure',
    arrive = 'arrive'
}

const FlightBooker = () => {
    const [option, setOption] = useState<Options>(Options.return);
    const [dateObj, setDateObj] = useState<DateObj>({ [Options.oneWay]: [''], [Options.return]: ['', ''] });
    const [errors, setErrors] = useState<string[]>([])
    const [bookedMsg, setBookedMsg] = useState<string>('');
    const validate = (dates: InputDates): string[] => {
        const errors = []
        // no earlier than today
        let result = compareDate(dates, getToday());
        if (result) {
            errors.push(result)
        }

        result = dates.length == 2 ? compareDate([dates[1]], dates[0]) : '';
        // if return exist, no earlier than departure date
        if (result) {
            errors.push(result)
        }

        return errors
    }
    const errorMsg = errors.join(' ');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name;
        const newVal = e.target.value;
        const newDates = [...dateObj[option]];
        const index = inputName === InputName.departure ? 0 : 1;
        newDates[index] = newVal;
        setDateObj({ ...dateObj, [option]: newDates })
        setErrors(validate(newDates))

    }
    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={(e) => {
                e.preventDefault()
                let msg;
                if (option === Options.oneWay) {
                    msg = `You have booked a one-way flight on ${dateObj[option][0]}`
                } else {
                    msg = `You have booked a return flight, departing on ${dateObj[option][0]} and returning on ${dateObj[option][1]}`
                }
                setBookedMsg(msg)
            }}>
                <label htmlFor='flight'>Flight options</label>
                <select id='flight' title='Option selector' value={option} className={styles.field} onChange={(e) => {
                    setOption(e.target.value as Options)
                }}>
                    {Object.values(Options).map((opt) => (
                        <option key={opt}>{opt}</option>
                    ))}
                </select>
                <div className={styles.field}>
                    <label htmlFor='departure'>Departure</label>
                    <input id='departure' type='date' value={dateObj[option][0]} name={InputName.departure} onChange={handleInputChange} />
                </div >
                {option === Options.return && (
                    <div className={styles.field}>
                        <label htmlFor='arrive'>Arrive</label>
                        <input id='arrive' type='date' value={dateObj[option][1]} name={InputName.arrive} onChange={handleInputChange} />
                    </div>
                )}
                {errorMsg && <p>{errorMsg}</p>}
                <button>Submit</button>
            </form>
            {bookedMsg && <p>{bookedMsg}</p>}
        </div>
    );
};

export default FlightBooker;
