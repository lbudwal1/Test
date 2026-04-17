const STATUS_CONFIG = {
  airborne:  { label: 'In Air',    bg: 'bg-sky-100',    text: 'text-sky-700',    border: 'border-sky-300',   dot: 'bg-sky-500 animate-pulse' },
  scheduled: { label: 'Scheduled', bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-300',  dot: 'bg-blue-500' },
  boarding:  { label: 'Boarding',  bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-300', dot: 'bg-amber-500 animate-pulse' },
  landed:    { label: 'Landed',    bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300', dot: 'bg-green-500' },
  delayed:   { label: 'Delayed',   bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300',dot: 'bg-orange-500' },
  cancelled: { label: 'Cancelled', bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300',   dot: 'bg-red-500' },
  diverted:  { label: 'Diverted',  bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300',dot: 'bg-purple-500' },
  unknown:   { label: 'Unknown',   bg: 'bg-slate-100',  text: 'text-slate-600',  border: 'border-slate-300', dot: 'bg-slate-400' },
};

export default function StatusBadge({ status, delay = 0, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  const isDelayed = delay > 0 && status !== 'cancelled';
  const sizeClass = size === 'lg' ? 'px-4 py-2 text-sm gap-2' : 'px-3 py-1.5 text-xs gap-1.5';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center ${sizeClass} rounded-full border font-semibold tracking-wide uppercase ${cfg.bg} ${cfg.text} ${cfg.border}`}>
        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
      {isDelayed && (
        <span className="inline-flex items-center px-3 py-1.5 text-xs rounded-full bg-orange-100 text-orange-700 border border-orange-300 font-semibold">
          +{delay} min delay
        </span>
      )}
    </div>
  );
}
