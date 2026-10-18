import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
export function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('facilityops_theme');
            if (saved === 'dark' || saved === 'light')
                return saved;
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('facilityops_theme', theme);
    }, [theme]);
    function toggleTheme() {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }
    return (<button className="btn btn-secondary btn-icon" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'} aria-label="Toggle theme color">
      {theme === 'light' ? <Moon size={16}/> : <Sun size={16}/>}
    </button>);
}
