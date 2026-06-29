'use client';
import { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString([], { month: '2-digit', day: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-end select-none">
      <span style={{ color: 'var(--color-accent)', fontSize: 20, fontFamily: 'var(--font-family)', lineHeight: 1 }}>
        {time}
      </span>
      <span style={{ color: 'var(--color-text-dim)', fontSize: 14, fontFamily: 'var(--font-family)' }}>
        {date}
      </span>
    </div>
  );
}
