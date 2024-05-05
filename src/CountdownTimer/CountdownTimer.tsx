import { Fragment, useState, useRef, useEffect, useCallback} from 'react';
import * as React from "react";

// question:
// initial value for min, sec?
// handle 0?
// value validation?
// note:
// no textarea validation
// req:
// click start -> start timer
// click pause -> stop timer
// click resume -> continue timer
// update current timer in sec


const minuteInputName = 'minute'
const secondInputName = 'second'
const initialTargetTime = {[minuteInputName]: 0, [secondInputName]: 0};
const pad = (number: number, width: number, filledText: string) => {
    const numStr = number.toString();
    return numStr.length >= width ? number : new Array(width - numStr.length + 1).join(filledText) + number;
}
function CountdownTimer() {
    const [time, setTime] = useState({...initialTargetTime});
    const targetTime = useRef({...initialTargetTime}); // no need to display on UI, in sec
    const minRef = useRef<HTMLInputElement>(null);
    const secRef = useRef<HTMLInputElement>(null);
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const countDownInterval = 1000; // ms, 1sec

    const stopTimer = useCallback(() => {
        setIsTimerStarted(false);
        targetTime.current = time;
    }, [setIsTimerStarted, time])

    useEffect(() => {
        const countdownTime = () => {
            const newTime = time[minuteInputName]*60*1000 + time[secondInputName]*1000 - countDownInterval; // ms
            const newMin = Math.floor((newTime/1000)/60);
            const newSecond = (newTime - newMin*1000*60) / 1000
            setTime({[minuteInputName]: newMin, [secondInputName]: newSecond})

            // terminate if reach targetTime
            if (newTime <= 0) stopTimer()
        }

        let timeoutId : NodeJS.Timeout;
        if (isTimerStarted){
             timeoutId = setTimeout(countdownTime, countDownInterval)
        }
        else
            stopTimer();
        return () => clearTimeout(timeoutId)
    }, [isTimerStarted, stopTimer, time]);

    const formatTime = () => {

        return `${pad(time[minuteInputName], 2, '0')}:${pad(time[secondInputName], 2, '0')}`
    };



    const startTimer = () => {
        setTime(targetTime.current);
        setIsTimerStarted(true)
    };
    const toggleTimer = () => {
        if (isTimerStarted) {
            stopTimer()
        } else {
            startTimer()
        }
    };
    const handleReset = () => {
        // reset min, sec to 0
        // resolve TS18047 with null checker
        if (minRef.current) {
            minRef.current.value = '';
        }
        if (secRef.current) {
            secRef.current.value = '';
        }

        // change display to 00:00
        targetTime.current = {...initialTargetTime};
        setTime({...initialTargetTime})
    };
    const handleTargetTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as 'minute' | 'second'; // resolve TS7053
        targetTime.current[name] = parseInt(event.target.value);
    };
    return (
        <Fragment>
            <label>
                <input ref={minRef} type="number" onChange={handleTargetTimeChange} name={minuteInputName}/>
                Minutes
            </label>
            <label>
                <input ref={secRef} type="number" onChange={handleTargetTimeChange} name={secondInputName}/>
                Seconds
            </label>

            <button onClick={startTimer}>START</button>
            <button onClick={toggleTimer}>PAUSE / RESUME</button>
            <button onClick={handleReset}>RESET</button>

            <h1 data-testid="running-clock">{formatTime()}</h1>
        </Fragment>
    );
}

export default CountdownTimer;
