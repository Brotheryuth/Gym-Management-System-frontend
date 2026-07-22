import React, { useState } from 'react';
import './BackendStatusMascot.css';

/**
 * BackendStatusMascot
 * Animated mascot peeking over the login card holding a dynamic status sign.
 * Ducks smoothly and slowly behind the login card when hovered with a goofy smirking expression.
 * 
 * @param {object} props
 * @param {'connecting' | 'connected' | 'offline'} props.status - Current backend connection state
 * @param {function} [props.onRetry] - Optional manual retry handler
 */
export default function BackendStatusMascot({ status = 'connecting', onRetry }) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          badgeClass: 'status-badge-green',
          badgeText: 'Connected',
          signText: "We're back online and ready to go!",
          expression: 'happy'
        };
      case 'offline':
        return {
          badgeClass: 'status-badge-red',
          badgeText: 'Offline',
          signText: "Server is sleeping right now. Waking it up now...",
          expression: 'concerned'
        };
      case 'connecting':
      default:
        return {
          badgeClass: 'status-badge-yellow',
          badgeText: 'Waking Up',
          signText: 'Hold on a sec! Backend server is spinning up (~30s)...',
          expression: 'waking'
        };
    }
  };

  const config = getStatusConfig();
  const currentExpression = isHovered ? 'smirk' : config.expression;

  return (
    <div
      className={`mascot-container mascot-status-${status} ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Hover over me to see me hide!"
    >
      {/* Signboard speech card held up by mascot */}
      <div className="mascot-signboard">
        <div className="mascot-sign-header">
          <span className={`mascot-status-dot ${config.badgeClass}`} />
          <span className="mascot-status-label">{config.badgeText}</span>
        </div>
        <p className="mascot-sign-text">{config.signText}</p>

        {status !== 'connected' && onRetry && (
          <button
            type="button"
            className="mascot-retry-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            title="Force retry connection"
          >
            Check Now
          </button>
        )}
      </div>

      {/* SVG Doodle Character Peeking Over the Card */}
      <svg
        className="mascot-character-svg"
        viewBox="0 0 160 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Arm holding sign */}
        <path
          d="M 46 80 C 44 55, 52 38, 58 22"
          stroke="#1E1E1E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 58 22 C 54 18, 62 16, 60 22"
          stroke="#1E1E1E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right Arm holding sign */}
        <path
          d="M 114 80 C 116 55, 108 38, 102 22"
          stroke="#1E1E1E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 102 22 C 106 18, 98 16, 100 22"
          stroke="#1E1E1E"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Head & Body Outline */}
        <path
          d="M 45 105 C 45 70, 52 45, 80 45 C 108 45, 115 70, 115 105"
          fill="#FFFFFF"
          stroke="#1E1E1E"
          strokeWidth="3.8"
          strokeLinecap="round"
        />

        {/* Cheeks */}
        <circle cx="60" cy="72" r="5" fill="#F472B6" opacity="0.45" />
        <circle cx="100" cy="72" r="5" fill="#F472B6" opacity="0.45" />

        {/* Goofy / Smirking Expression when hovered */}
        {currentExpression === 'smirk' && (
          <>
            {/* Cheeky Smirking Eyes (Smug / Mischievous squint) */}
            <path d="M 63 64 Q 69 58 75 64" stroke="#1E1E1E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <line x1="64" y1="65" x2="74" y2="65" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="91" cy="63" r="3.2" fill="#1E1E1E" />
            {/* Raised mischievous eyebrow */}
            <path d="M 86 56 Q 91 53 96 56" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Asymmetric Goofy Side-Smirk Smile */}
            <path d="M 71 76 Q 78 83 87 72" stroke="#1E1E1E" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 86 70 L 89 74" stroke="#1E1E1E" strokeWidth="2.2" strokeLinecap="round" />
          </>
        )}

        {/* Happy Expression */}
        {currentExpression === 'happy' && (
          <>
            {/* Happy Eyes ^ ^ */}
            <path d="M 64 65 Q 69 59 74 65" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 86 65 Q 91 59 96 65" stroke="#1E1E1E" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Cute Smile */}
            <path d="M 75 75 Q 80 81 85 75" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Concerned Expression */}
        {currentExpression === 'concerned' && (
          <>
            {/* Concerned Eyes */}
            <circle cx="69" cy="65" r="2.8" fill="#1E1E1E" />
            <circle cx="91" cy="65" r="2.8" fill="#1E1E1E" />
            {/* Wavy mouth */}
            <path d="M 74 76 Q 77 74 80 76 T 86 76" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Waking Expression */}
        {currentExpression === 'waking' && (
          <>
            {/* Attentive blinking eyes */}
            <g className="mascot-eyes-blink">
              <circle cx="69" cy="64" r="3" fill="#1E1E1E" />
              <circle cx="91" cy="64" r="3" fill="#1E1E1E" />
            </g>
            {/* Cute small oval mouth */}
            <ellipse cx="80" cy="74" rx="2.5" ry="3.5" fill="#1E1E1E" />
          </>
        )}
      </svg>
    </div>
  );
}
