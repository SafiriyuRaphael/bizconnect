export const generateDefaultLogo = (name: string): string => {
    const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const uniqueId = Math.random().toString(36).substr(2, 9);

    return `
      <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Ultra-premium gradient background -->
          <linearGradient id="ultraGradient-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0c0a09;stop-opacity:1" />
            <stop offset="20%" style="stop-color:#1c1917;stop-opacity:1" />
            <stop offset="40%" style="stop-color:#292524;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#3c3530;stop-opacity:1" />
            <stop offset="80%" style="stop-color:#57534e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#78716c;stop-opacity:1" />
          </linearGradient>
          
          <!-- Luxurious gold gradient -->
          <linearGradient id="luxuryGold-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="60%" style="stop-color:#d97706;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#b45309;stop-opacity:1" />
          </linearGradient>
          
          <!-- Platinum accent -->
          <linearGradient id="platinumAccent-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#e2e8f0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
          </linearGradient>
          
          <!-- Multi-layer glow effect -->
          <filter id="premiumGlow-${uniqueId}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feGaussianBlur stdDeviation="6" result="bigBlur"/>
            <feMerge> 
              <feMergeNode in="bigBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Sophisticated inner shadow -->
          <filter id="innerShadow-${uniqueId}">
            <feFlood flood-color="#000000" flood-opacity="0.4"/>
            <feComposite in="SourceGraphic" operator="out" />
            <feGaussianBlur stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offset"/>
            <feComposite in="SourceGraphic" in2="offset" operator="atop"/>
          </filter>
          
          <!-- Embossed effect -->
          <filter id="emboss-${uniqueId}">
            <feConvolveMatrix order="3" kernelMatrix="1 1 1 1 0.7 -1 -1 -1 -1" />
          </filter>
          
          <!-- Radial shine -->
          <radialGradient id="shine-${uniqueId}" cx="30%" cy="30%" r="70%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
            <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.1" />
            <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
          </radialGradient>
          
          <!-- Geometric pattern -->
          <pattern id="geometric-${uniqueId}" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="none"/>
            <path d="M16 0L32 16L16 32L0 16Z" fill="url(#luxuryGold-${uniqueId})" opacity="0.03"/>
            <circle cx="16" cy="16" r="2" fill="url(#platinumAccent-${uniqueId})" opacity="0.05"/>
          </pattern>
        </defs>
        
        <!-- Main premium container -->
        <rect x="0" y="0" width="256" height="256" rx="28" ry="28" fill="url(#ultraGradient-${uniqueId})" filter="url(#innerShadow-${uniqueId})"/>
        
        <!-- Geometric pattern overlay -->
        <rect x="0" y="0" width="256" height="256" rx="28" ry="28" fill="url(#geometric-${uniqueId})"/>
        
        <!-- Corner luxury accents -->
        <path d="M28 0 L60 0 L60 8 L36 8 L36 32 L28 32 Z" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        <path d="M256 28 L256 60 L248 60 L248 36 L224 36 L224 28 Z" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        <path d="M228 256 L196 256 L196 248 L220 248 L220 224 L228 224 Z" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        <path d="M0 228 L0 196 L8 196 L8 220 L32 220 L32 228 Z" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        
        <!-- Premium center stage -->
        <rect x="32" y="96" width="192" height="64" rx="32" fill="url(#luxuryGold-${uniqueId})" opacity="0.08"/>
        
        <!-- Elegant accent bars -->
        <rect x="48" y="112" width="160" height="2" rx="1" fill="url(#luxuryGold-${uniqueId})" opacity="0.9"/>
        <rect x="48" y="142" width="160" height="2" rx="1" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        
        <!-- Side accent elements -->
        <rect x="16" y="120" width="4" height="16" rx="2" fill="url(#luxuryGold-${uniqueId})" opacity="0.7"/>
        <rect x="236" y="120" width="4" height="16" rx="2" fill="url(#luxuryGold-${uniqueId})" opacity="0.7"/>
        
        <!-- Main initials with multiple effects -->
        <text 
          x="128" 
          y="128" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" 
          font-size="72" 
          font-weight="700" 
          fill="url(#luxuryGold-${uniqueId})" 
          text-anchor="middle" 
          dominant-baseline="central"
          letter-spacing="3px"
          filter="url(#premiumGlow-${uniqueId})"
        >
          ${initials}
        </text>
        
        <!-- Subtle text shadow for depth -->
        <text 
          x="130" 
          y="130" 
          font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" 
          font-size="72" 
          font-weight="700" 
          fill="#000000" 
          text-anchor="middle" 
          dominant-baseline="central"
          letter-spacing="3px"
          opacity="0.2"
        >
          ${initials}
        </text>
        
        <!-- Radial shine overlay -->
        <rect x="0" y="0" width="256" height="256" rx="28" ry="28" fill="url(#shine-${uniqueId})"/>
        
        <!-- Premium border system -->
        <rect x="0" y="0" width="256" height="256" rx="28" ry="28" fill="none" stroke="url(#luxuryGold-${uniqueId})" stroke-width="1.5" opacity="0.4"/>
        <rect x="4" y="4" width="248" height="248" rx="24" ry="24" fill="none" stroke="url(#platinumAccent-${uniqueId})" stroke-width="0.5" opacity="0.3"/>
        
        <!-- Inner frame -->
        <rect x="12" y="12" width="232" height="232" rx="20" ry="20" fill="none" stroke="url(#luxuryGold-${uniqueId})" stroke-width="0.5" opacity="0.2"/>
        
        <!-- Micro details for perfection -->
        <circle cx="48" cy="48" r="1.5" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        <circle cx="208" cy="48" r="1.5" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        <circle cx="48" cy="208" r="1.5" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        <circle cx="208" cy="208" r="1.5" fill="url(#luxuryGold-${uniqueId})" opacity="0.6"/>
        
        <!-- Final highlight -->
        <rect x="0" y="0" width="256" height="48" rx="28" ry="28" fill="url(#platinumAccent-${uniqueId})" opacity="0.06"/>
      </svg>
    `.trim();
};