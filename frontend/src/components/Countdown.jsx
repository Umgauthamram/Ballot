import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const Countdown = ({ targetDate, showIcon = true }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const update = () => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                setTimeLeft('ENDED');
                setIsEnded(true);
                setIsUrgent(false);
                return;
            }

            // Check for last 5 minutes (300,000 ms)
            if (distance < 5 * 60 * 1000) {
                setIsUrgent(true);
            } else {
                setIsUrgent(false);
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(
                (days > 0 ? `${days}d ` : '') +
                `${hours}h ${minutes}m ${seconds}s`
            );
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    if (isEnded) return <span className="text-red-500 font-bold">ENDED</span>;

    return (
        <span className={`font-mono font-bold flex items-center gap-2 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
            {showIcon && <Clock size={14} />}
            {timeLeft}
        </span>
    );
};

export default Countdown;
