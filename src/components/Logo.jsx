import logoIcon from '../assets/logo-icon.png';

const iconSizes = {
  sm: 'h-9 w-9',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
  xl: 'h-14 w-14',
};

const textSizes = {
  sm: { main: 'text-[11px] leading-tight', sub: 'text-[7px] mt-1' },
  md: { main: 'text-sm sm:text-[15px] leading-none', sub: 'text-[9px] mt-1.5' },
  lg: { main: 'text-base leading-none', sub: 'text-[9px] mt-1.5' },
  xl: { main: 'text-lg sm:text-xl leading-none', sub: 'text-[10px] mt-2' },
};

export default function Logo({
  size = 'md',
  variant = 'light',
  layout = 'horizontal',
  subtitle = 'Pty Ltd',
  showText = true,
  className = '',
}) {
  const isDark = variant === 'dark';
  const isStacked = layout === 'stacked';

  return (
    <div
      className={[
        'flex items-center',
        isStacked ? 'flex-col text-center gap-2.5' : 'gap-3',
        className,
      ].join(' ')}
      aria-label="Global Goods & Services Pty Ltd"
    >
      <img
        src={logoIcon}
        alt=""
        aria-hidden="true"
        className={`shrink-0 object-contain ${iconSizes[size]}`}
      />

      {showText && (
        <div className={`flex flex-col ${isStacked ? 'items-center' : 'text-left'}`}>
          <span
            className={[
              'font-heading font-black tracking-tight uppercase',
              textSizes[size].main,
              isDark ? 'text-white' : 'text-brand-navy',
            ].join(' ')}
          >
            Global Goods <span className="text-brand-teal">&amp;</span> Services
          </span>
          <span
            className={[
              'font-mono uppercase tracking-[0.2em] font-bold leading-none',
              textSizes[size].sub,
              'text-brand-green',
            ].join(' ')}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
