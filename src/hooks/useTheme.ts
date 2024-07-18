// import { useEffect, useState } from 'react';

// export const useTheme = () => {
//   const [theme, setTheme] = useState<'light' | 'dark'>(
//     (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
//   );

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//   };

//   useEffect(() => {
//     document.body.setAttribute('data-theme', theme);
//   }, [theme]);

//   return [theme, toggleTheme] as const;
// };


