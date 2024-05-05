import { Fragment, useState, useRef, useEffect, useCallback} from 'react';

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

// input validation (min/sec in the form validation)
//      must be numeric (native HTML element validation)

// Enable/Disable
//  when start, should be disabled, enable again when time is up or reset
//  when time is up or reset, disable pause/resume and reset, enable when timer is running

// responsive layout

// accessibility


const minuteInputName = 'minute'
const secondInputName = 'second'
const pad = (number: number, width: number, filledText: string) => {
    const numStr = number.toString();
    return numStr.length >= width ? number : new Array(width - numStr.length + 1).join(filledText) + number;
}

const timeObjToMs = (timeObj:{minute: number, second: number}) => {
    const {minute , second} = timeObj;
    return minute*60*1000 + second*1000;
}

const timeMsToObj = (timeInMs:number) => {
    const minute = Math.floor(timeInMs / 60 / 1000);
    const second = (timeInMs - minute * 60 * 1000) / 1000;
    return {minute, second}
}
const countDownInterval = 1000; // ms, 1sec

function CountdownTimer() {
    // could this have better name, like 'remainingTime'?
    const [time, setTime] = useState(0);
    // But when we clicking on Reset, it clear out the values rendered in x min and y sec, shouldn't this be the state value specified on the two inputs in full control way?
    // What's the usage of this?
    const targetTime = useRef(0); // no need to display on UI, in sec
    const minRef = useRef<HTMLInputElement>(null);
    const secRef = useRef<HTMLInputElement>(null);
    const [isTimerStarted, setIsTimerStarted] = useState(false);

    const stopTimer = useCallback(() => {
        setIsTimerStarted(false);
        // why do we want to keep an aditional ``targetTime` when we already have `time` which is the remaining time?
        targetTime.current = time;
    }, [setIsTimerStarted, time])

    useEffect(() => {
        const countdownTime = () => {
            // when it's counting down, click "Reset" and it still make the timer one second less -> -1:59. We should stop deducting the time here when the timer flag is already false
            const newTime = time - countDownInterval; // ms
            // terminate if reach targetTime
            if (newTime <= 0) stopTimer()
            setTime(newTime)
        
            // you don't need to remember the `time`, instead:
            setTime((currentTime) => currentTime - countDownInterval)
        }

        let timeoutId : NodeJS.Timeout;
        // let intervalId: NodeJS.Timeout;
        if (isTimerStarted){
             timeoutId = setTimeout(countdownTime, countDownInterval)

             // alternatively
            //  intervalId = setInterval(countdownTime, countDownInterval);
        }
        else
            stopTimer();
        return () => clearTimeout(timeoutId)
        // return () => clearImmediate(intervalId);
        // return () => clearTimeout(
    }, [isTimerStarted, stopTimer, time]);

    const formatTime = () => {
        const {minute, second} = timeMsToObj(time);
        return `${pad(minute, 2, '0')}:${pad(second, 2, '0')}`
    };

    const startTimer = () => {
        const minute = minRef.current?.value || '0';
        const second =secRef.current?.value || '0';
        setTime(timeObjToMs({minute: parseInt(minute), second: parseInt(second)}));
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

        // you don't need to check if it exists
        if (minRef.current) {
            minRef.current.value = '';
        }
        // you don't need to check if it exists
        if (secRef.current) {
            secRef.current.value = '';
        }

        // change display to 00:00
        targetTime.current = 0;
        setTime(0)
    };
    return (
        <Fragment>
            <label>
                <input ref={minRef} type="number" name={minuteInputName}/>
                Minutes
            </label>
            <label>
                <input ref={secRef} type="number" name={secondInputName}/>
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
