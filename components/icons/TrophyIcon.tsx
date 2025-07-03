import React from 'react';

export const TrophyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Zm-4.5-4.5a3.75 3.75 0 0 0-7.5 0h7.5Zm-7.5 0a3.75 3.75 0 0 1 7.5 0h-7.5Zm1.5-9a.75.75 0 0 0-.75.75V14.25h1.5V5.25a.75.75 0 0 0-.75-.75Zm4.5 0a.75.75 0 0 0-.75.75V14.25h1.5V5.25a.75.75 0 0 0-.75-.75Zm-6.75 0h1.5v9h-1.5v-9Zm6 0h1.5v9h-1.5v-9Zm-3.75 0h1.5v9h-1.5v-9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3.75m0 0a3.75 3.75 0 0 0-3.75-3.75H6a3.75 3.75 0 0 0-3.75 3.75v3.75m15 0v-3.75a3.75 3.75 0 0 0-3.75-3.75H15.75a3.75 3.75 0 0 0-3.75 3.75M12 21h-3.75m3.75 0h3.75" />
    </svg>
);
