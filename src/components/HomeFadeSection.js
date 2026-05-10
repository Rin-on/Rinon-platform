import React from 'react';
import { ChevronDown } from 'lucide-react';

const HomeFadeSection = ({ children, className = '' }) => {
    const ref = React.useRef(null);
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.05 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}>
            {children}
        </div>
    );
};

const ScrollHint = () => {
    const ref = React.useRef(null);
    const [visible, setVisible] = React.useState(true);
    React.useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (!entry.isIntersecting) setVisible(false); },
            { threshold: 0 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className={`hidden md:flex justify-center py-3 transition-opacity duration-500 ${visible ? 'opacity-60' : 'opacity-0'}`}>
            <ChevronDown className="w-5 h-5 text-gray-400 animate-bob" />
        </div>
    );
};

export { HomeFadeSection, ScrollHint };
export default HomeFadeSection;
