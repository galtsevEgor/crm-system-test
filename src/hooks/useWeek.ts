// src/hooks/useWorkWeek.ts
import { useState, useEffect } from 'react';
import { getWeek, addHours } from 'date-fns';

export const useWeek = () => {
  const [workWeek, setWorkWeek] = useState<number>(() => {
    const now = new Date();
    const adjustedDate = addHours(now, -11);
    return getWeek(adjustedDate);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const adjustedDate = addHours(now, -11);
      setWorkWeek(getWeek(adjustedDate));
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return workWeek;
};

