import { Fragment, useState, useEffect, useCallback} from 'react';

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
enum TimeInput {
    MINUTE= 'minute',
    SECOND= 'second'
}
const initialTargetTime = {[TimeInput.MINUTE]: 0, [TimeInput.SECOND]: 0};
function CountdownTimer() {
    const [remainingTime, setRemainingTime] = useState(0);
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [targetTime, setTargetTime] = useState(initialTargetTime);

    const stopTimer = useCallback(() => {
        setIsTimerStarted(false);
    }, [setIsTimerStarted])

    useEffect(() => {
        const countdownTime = () => {
            setRemainingTime(prev => {
                const newTime = prev - countDownInterval;
                // terminate if reach targetTime
                if (newTime <= 0) stopTimer()
                return newTime
            })
        }

        /**
         * Alternatively
         */
        // let timeoutId : NodeJS.Timeout;
        // if (isTimerStarted){
        //      timeoutId = setTimeout(countdownTime, countDownInterval)
        // }
        // else
        //     stopTimer();
        // return () => clearTimeout(timeoutId)

        let intervalId: NodeJS.Timeout;
        if (isTimerStarted)
            intervalId = setInterval(countdownTime, countDownInterval);
        else
            stopTimer()
        return () => clearInterval(intervalId)
    }, [isTimerStarted, stopTimer]);

    const formatTime = () => {
        const {minute, second} = timeMsToObj(remainingTime);
        return `${pad(minute, 2, '0')}:${pad(second, 2, '0')}`
    };

    const startTimer = () => {
        
        const minute = targetTime[TimeInput.MINUTE];
        const second =targetTime[TimeInput.SECOND];
        if (minute === 0 && second === 0) return; // do nothing if no value set
        setRemainingTime(timeObjToMs({minute, second}));
        setIsTimerStarted(true)
    };
    const resumeTimer = () => {
        if (remainingTime === 0) return; // do nothing if remaining time is 0
        setIsTimerStarted(true)
    }
    const toggleTimer = () => {
        if (isTimerStarted) {
            stopTimer()
        } else {
            resumeTimer()
        }
    };
    const handleReset = () => {
        // reset min, sec to 0
        setTargetTime(initialTargetTime)
        // change display to 00:00
        setRemainingTime(0)
    };
    const handleTimeChange = (e: { target: { name: keyof TimeInput; value: string; }; }) => {
        const {name, value} = e.target
        setTargetTime(prev => ({...prev, [name]: parseInt(value)}))
    }
    return (
        <Fragment>
            <label>
                <input type="number" name={minuteInputName} value={targetTime[TimeInput.MINUTE] || ''} onChange={handleTimeChange}/>
                Minutes
            </label>
            <label>
                <input type="number" name={secondInputName} value={targetTime[TimeInput.SECOND] || ''} onChange={handleTimeChange}/>
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
