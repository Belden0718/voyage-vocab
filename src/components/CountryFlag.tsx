import React from 'react';

interface CountryFlagProps {
  code: string; // 'US' | 'GB' | 'UK' | 'AU' | 'en-US' | 'en-GB' | 'en-AU'
  className?: string;
  title?: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  className = "w-4 h-3 inline-block rounded-[2px] shadow-2xs border border-slate-200/70 align-middle shrink-0 overflow-hidden",
  title
}) => {
  const norm = code.toUpperCase().replace('EN-', '');

  if (norm === 'GB' || norm === 'UK') {
    return (
      <span className={className} title={title || "英國國旗 (UK/GB)"} aria-label="UK flag">
        <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none" className="block w-full h-full">
          <clipPath id="uk-clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
          <clipPath id="uk-diag"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
          <g clipPath="url(#uk-clip)">
            <path d="M0 0v30h60V0z" fill="#012169" />
            <path d="M0 0l60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
            <path d="M0 0l60 30m0-30L0 30" clipPath="url(#uk-diag)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
            <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
          </g>
        </svg>
      </span>
    );
  }

  if (norm === 'AU') {
    return (
      <span className={className} title={title || "澳洲國旗 (AU)"} aria-label="Australia flag">
        <svg viewBox="0 0 60 30" width="100%" height="100%" preserveAspectRatio="none" className="block w-full h-full">
          <rect width="60" height="30" fill="#00008b" />
          {/* Union Jack in upper hoist quarter */}
          <g transform="scale(0.5)">
            <clipPath id="au-uk-clip"><path d="M0 0v30h60V0z"/></clipPath>
            <clipPath id="au-uk-diag"><path d="M30 15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>
            <g clipPath="url(#au-uk-clip)">
              <path d="M0 0v30h60V0z" fill="#012169" />
              <path d="M0 0l60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
              <path d="M0 0l60 30m0-30L0 30" clipPath="url(#au-uk-diag)" stroke="#C8102E" strokeWidth="4" />
              <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
              <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
            </g>
          </g>
          {/* Commonwealth Star */}
          <circle cx="15" cy="22" r="3.5" fill="#ffffff" />
          {/* Southern Cross stars */}
          <circle cx="45" cy="24" r="1.8" fill="#ffffff" />
          <circle cx="38" cy="13" r="1.8" fill="#ffffff" />
          <circle cx="45" cy="6" r="1.8" fill="#ffffff" />
          <circle cx="51" cy="11" r="1.8" fill="#ffffff" />
          <circle cx="48" cy="18" r="1.2" fill="#ffffff" />
        </svg>
      </span>
    );
  }

  // Default: US Flag (美式英語)
  return (
    <span className={className} title={title || "美國國旗 (US)"} aria-label="US flag">
      <svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="none" className="block w-full h-full">
        <g fillRule="evenodd">
          <path fill="#bd3d44" d="M0 0h640v480H0z"/>
          <path stroke="#ffffff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
          <path fill="#192f5d" d="M0 0h280v258.5H0z"/>
          <g fill="#ffffff" transform="translate(10, 10)">
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(10, 10)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(60, 10)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(110, 10)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(160, 10)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(210, 10)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(35, 50)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(85, 50)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(135, 50)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(185, 50)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(10, 90)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(60, 90)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(110, 90)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(160, 90)"/>
            <polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9" transform="scale(0.8) translate(210, 90)"/>
          </g>
        </g>
      </svg>
    </span>
  );
};
