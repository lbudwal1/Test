const STARS = [
  [105,52,1.2,0.0],[238,80,0.9,1.5],[388,44,1.4,0.8],[528,70,1.0,2.2],[672,36,1.3,0.4],
  [822,60,0.8,3.1],[980,48,1.1,1.9],[1130,72,1.3,0.6],[1290,50,1.0,2.8],[1420,65,0.9,1.2],
  [68,145,0.8,1.7],[210,128,1.1,0.3],[368,158,0.7,2.5],[510,125,1.2,1.0],[660,148,0.9,3.3],
  [800,134,1.0,2.0],[950,154,0.8,0.7],[1100,128,1.2,1.5],[1252,144,0.9,0.9],[1400,138,0.7,2.4],
  [160,218,0.7,1.3],[320,200,0.9,0.5],[490,228,0.8,2.9],[650,210,0.7,1.8],[860,224,0.9,0.2],
];

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#07021a"/>
            <stop offset="22%"  stopColor="#190748"/>
            <stop offset="46%"  stopColor="#6b1e7e"/>
            <stop offset="67%"  stopColor="#c23e1c"/>
            <stop offset="82%"  stopColor="#f97316"/>
            <stop offset="100%" stopColor="#fbbf24"/>
          </linearGradient>
          <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fef9c3" stopOpacity="1"/>
            <stop offset="35%"  stopColor="#fde047" stopOpacity="0.65"/>
            <stop offset="68%"  stopColor="#fb923c" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="#ef4444"  stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1e2335"/>
            <stop offset="100%" stopColor="#0c0b14"/>
          </linearGradient>
          <filter id="b24"><feGaussianBlur stdDeviation="24"/></filter>
          <filter id="b8" ><feGaussianBlur stdDeviation="8"/></filter>
          <filter id="b4" ><feGaussianBlur stdDeviation="4"/></filter>
        </defs>

        {/* Sky */}
        <rect width="1440" height="900" fill="url(#sky)"/>

        {/* Sun glow + disc */}
        <ellipse cx="720" cy="615" rx="280" ry="94" fill="url(#sunHalo)" filter="url(#b24)" opacity="0.92"/>
        <circle  cx="720" cy="620" r="54" fill="#fef9c3"/>
        <circle  cx="720" cy="616" r="46" fill="#fde047"/>
        <circle  cx="720" cy="612" r="38" fill="#fbbf24"/>
        <rect x="0" y="604" width="1440" height="22" fill="#f97316" opacity="0.09" filter="url(#b8)"/>

        {/* Stars */}
        {STARS.map(([sx,sy,r,d],i) => (
          <circle key={i} cx={sx} cy={sy} r={r} fill="white" style={{
            opacity: 0.7,
            animation: `twinkle ${2.5+(i%5)*0.5}s ${d}s ease-in-out infinite`,
          }}/>
        ))}

        {/* Clouds */}
        <g opacity="0.50" style={{animation:'cloudDrift 55s linear infinite'}}>
          <ellipse cx="300" cy="380" rx="120" ry="32" fill="#e86880" filter="url(#b4)"/>
          <ellipse cx="365" cy="362" rx="82"  ry="26" fill="#f07a6a" filter="url(#b4)"/>
          <ellipse cx="242" cy="374" rx="68"  ry="23" fill="#e86880" filter="url(#b4)"/>
        </g>
        <g opacity="0.40" style={{animation:'cloudDrift 70s 12s linear infinite'}}>
          <ellipse cx="960" cy="320" rx="135" ry="38" fill="#c45888" filter="url(#b4)"/>
          <ellipse cx="1025" cy="302" rx="92" ry="30" fill="#d46092" filter="url(#b4)"/>
          <ellipse cx="895"  cy="312" rx="75" ry="26" fill="#c45888" filter="url(#b4)"/>
        </g>
        <g opacity="0.32" style={{animation:'cloudDrift 44s 25s linear infinite'}}>
          <ellipse cx="1290" cy="425" rx="100" ry="28" fill="#e87245" filter="url(#b4)"/>
          <ellipse cx="1355" cy="408" rx="70"  ry="22" fill="#f08050" filter="url(#b4)"/>
        </g>

        {/* Mountains — far */}
        <path d="M0,648 L90,520 L165,568 L248,504 L330,548 L415,490 L488,536 L565,480
                 L645,528 L722,472 L800,516 L878,469 L956,511 L1036,459 L1114,502
                 L1194,455 L1278,500 L1360,464 L1440,487 L1440,648 Z"
              fill="#3c1d72" opacity="0.86"/>
        {/* Mountains — mid */}
        <path d="M0,694 L82,578 L165,624 L252,556 L345,606 L432,550 L524,598 L614,544
                 L702,592 L788,538 L870,584 L954,532 L1040,577 L1126,524 L1215,570
                 L1302,518 L1395,564 L1440,534 L1440,694 Z"
              fill="#1c1149" opacity="0.93"/>
        {/* Mountains — near */}
        <path d="M0,742 L90,616 L186,682 L282,609 L388,657 L490,604 L604,652 L716,606
                 L830,646 L942,600 L1056,642 L1162,596 L1274,638 L1382,598 L1440,622
                 L1440,742 Z"
              fill="#0e0827"/>

        {/* Ground */}
        <rect x="0" y="734" width="1440" height="166" fill="url(#gnd)"/>
        <ellipse cx="720" cy="736" rx="544" ry="18" fill="#f97316" opacity="0.13" filter="url(#b8)"/>
      </svg>
    </div>
  );
}
