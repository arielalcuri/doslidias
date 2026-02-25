import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
    const sizes = {
        sm: 'h-8',
        md: 'h-12',
        lg: 'h-16'
    };

    return (
        <div className={`flex items-center gap-3 ${sizes[size]}`}>
            <img src="/logo.png" alt="Dos Lidias" className="h-full object-contain" />
            <span className={`font-serif tracking-widest text-[#2c3e50] ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
                DOS LIDIAS
            </span>
        </div>
    );
};

export default Logo;
