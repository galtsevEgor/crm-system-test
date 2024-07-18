// import { useState, useEffect } from 'react';

// export const useLocale = () => {
//   const [locale, setLocale] = useState<string>(
//     () => localStorage.getItem('language') || 'en'
//   );

//   useEffect(() => {
//     localStorage.setItem('language', locale);
//   }, [locale]);

//   return [locale, setLocale] as const;
// };

