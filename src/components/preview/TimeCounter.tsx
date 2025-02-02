"use client";

import React from "react";
import { differenceInSeconds } from "date-fns";

interface TimeCounterProps {
  startDate: string;
}

export default function TimeCounter({ startDate }: TimeCounterProps) {
  const [timeElapsed, setTimeElapsed] = React.useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const updateCounter = () => {
      const start = new Date(startDate);
      const now = new Date();

      // Se a data inicial for futura, não calcula
      if (now < start) return;

      // Calcula a diferença total em segundos
      const totalSeconds = differenceInSeconds(now, start);

      // Calcula cada unidade
      const secondsInMinute = 60;
      const secondsInHour = secondsInMinute * 60;
      const secondsInDay = secondsInHour * 24;
      const secondsInMonth = secondsInDay * 30;
      const secondsInYear = secondsInDay * 365;

      const years = Math.floor(totalSeconds / secondsInYear);
      const remainingAfterYears = totalSeconds % secondsInYear;

      const months = Math.floor(remainingAfterYears / secondsInMonth);
      const remainingAfterMonths = remainingAfterYears % secondsInMonth;

      const days = Math.floor(remainingAfterMonths / secondsInDay);
      const remainingAfterDays = remainingAfterMonths % secondsInDay;

      const hours = Math.floor(remainingAfterDays / secondsInHour);
      const remainingAfterHours = remainingAfterDays % secondsInHour;

      const minutes = Math.floor(remainingAfterHours / secondsInMinute);
      const seconds = remainingAfterHours % secondsInMinute;

      setTimeElapsed({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    // Atualiza imediatamente e depois a cada segundo
    updateCounter();
    const interval = setInterval(updateCounter, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-black/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">{timeElapsed.years.toString().padStart(2, "0")}</div>
        <div className="text-sm text-white/60 mt-1">anos</div>
      </div>
      <div className="bg-black/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">{timeElapsed.months.toString().padStart(2, "0")}</div>
        <div className="text-sm text-white/60 mt-1">meses</div>
      </div>
      <div className="bg-black/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">{timeElapsed.days.toString().padStart(2, "0")}</div>
        <div className="text-sm text-white/60 mt-1">dias</div>
      </div>
      <div className="bg-black/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">{timeElapsed.hours.toString().padStart(2, "0")}</div>
        <div className="text-sm text-white/60 mt-1">horas</div>
      </div>
      <div className="bg-black/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">{timeElapsed.minutes.toString().padStart(2, "0")}</div>
        <div className="text-sm text-white/60 mt-1">minutos</div>
      </div>
      <div className="bg-black/50 rounded-lg p-4 text-center">
        <div className="text-3xl font-bold text-white">{timeElapsed.seconds.toString().padStart(2, "0")}</div>
        <div className="text-sm text-white/60 mt-1">segundos</div>
      </div>
    </div>
  );
}
