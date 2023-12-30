import { useState, useEffect } from 'react';
import calculateTimeInSeconds from '../Helpers/TimerHelper';
import '../../../styles/Main.css';

type Props = {
    timeInSeconds: number,
}

function Main(props:Props) {
    const {timeInSeconds} = props
    const [timeArray, setTimeArray] = useState<Array<number|string>>([]);

    useEffect(() => {
        setTimeArray(calculateTimeInSeconds(timeInSeconds));
    }, [timeInSeconds]); 

    return(
        <main className="stopwatch-container">
            <section className="timer-display">
                <p id="hour">{timeArray[0]}</p>
                <span>:</span>
                <p id="minute">{timeArray[1]}</p>
                <span>:</span>
                <p id="second">{timeArray[2]}</p>
            </section>
        </main>
    );
}

export default Main;