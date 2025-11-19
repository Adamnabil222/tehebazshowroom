
import React from 'react';

export const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const CompanyLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g>
            <path d="M 20,80 L 20,20 L 80,20 L 80,80 z" fill="none" stroke="currentColor" strokeWidth="5"/>
            <path d="M 35,65 L 35,35 L 50,35" fill="none" stroke="currentColor" strokeWidth="5"/>
            <path d="M 50,50 L 65,50" fill="none" stroke="currentColor" strokeWidth="5"/>
            <path d="M 65,65 L 65,35" fill="none" stroke="currentColor" strokeWidth="5"/>
        </g>
    </svg>
);

export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.92-9.91zM17.13 15.13c-.23-.11-.92-.45-1.06-.51-.14-.05-.25-.08-.35.08-.1.16-.4.51-.49.61-.09.1-.18.11-.33.04-.15-.08-1.02-.38-1.95-1.2-1.02-1.02-1.53-2.27-1.68-2.65-.15-.38-.01-.58.07-.66.08-.08.18-.21.27-.31.09-.1.12-.16.18-.28.06-.11.03-.21-.01-.29s-.35-.85-.48-1.16c-.13-.31-.26-.27-.35-.27-.09 0-.2.03-.3.03s-.28.13-.42.28c-.14.15-.54.53-.54 1.29 0 .76.55 1.5.63 1.61.08.11.92 1.47 2.23 2.08.31.15.55.23.74.3.34.12.56.1.75.06.22-.04.92-.38 1.05-.71.13-.34.13-.63.09-.71-.04-.08-.15-.13-.33-.24z" />
    </svg>
  );