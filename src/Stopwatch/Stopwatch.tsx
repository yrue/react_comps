import {useState, useRef} from 'react';

const Stopwatch = () => {
    // set type for timestamp
    const [timestamp, setTimestamp] = useState<number>(0);
    // same props for both timer status and timer?
    const lastTickTime = useRef<number>(0);
    const [timerId, setTimerId] = useState<number>(0);

    const formatTime = (milliseconds: number): string => {
        let time = milliseconds;
        const parts = {hour: 0, minutes: 0, seconds: 0, ms: 0};
        const MS_IN_SECOND = 1000;
        const SECOND_IN_MINUTE = 60;
        const MINUTE_IN_HOUR = 60;
        const MS_IN_HOUR = MS_IN_SECOND * SECOND_IN_MINUTE * MINUTE_IN_HOUR;
        const MS_IN_MINUTE = MS_IN_SECOND * SECOND_IN_MINUTE;

        if (time > MS_IN_HOUR) {
            parts.hour = Math.floor(time / MS_IN_HOUR);
            time %= MS_IN_HOUR;
        }

        if (time > MS_IN_MINUTE) {
            parts.minutes = Math.floor(time / MS_IN_MINUTE);
            time %= MS_IN_MINUTE;
        }

        if (time > MS_IN_SECOND) {
            parts.seconds = Math.floor(time / MS_IN_SECOND);
            time %= MS_IN_SECOND;
        }

        parts.ms = time;

        return `${parts.hour.toString().padStart(2, '0')}:${parts.minutes.toString().padStart(2, '0')}:${parts.seconds.toString().padStart(2, '0')}.${parts.ms.toString().padStart(3, '0')}`;
    }

    const isRunning = timerId !== 0;
    const toggleTimer = () => {
        if (isRunning) {
            stopTimer();
        } else {
            startTimer();
        }
    }

    const startTimer = () => {
        lastTickTime.current = Date.now();
        setTimerId(window.setInterval(() => {
            const now = Date.now();
            const timePassed = now - lastTickTime.current;
            setTimestamp((prev) => prev + timePassed);
            lastTickTime.current = now;
        }, 1));
    }
    const stopTimer = () => {
        clearInterval(timerId);
        setTimerId(0);
    }

    return (
        <>
            <div className={styles.stopwatch}>
                <div>{formatTime(timestamp)}</div>
                <div className={styles.buttons}>
                    <button onClick={() => toggleTimer()}>{isRunning? 'Stop' : 'Start'}</button>
                    <button onClick={() => {
                        stopTimer()
                        setTimestamp(0)
                        }}>Reset</button>
                </div>
            </div>
        </>
    );
};

export default Stopwatch;
