export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-navy-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, accent = false }) {
  return (
    <Card>
      <p className="text-sm text-navy-600">{label}</p>
      <p className={`text-3xl font-display mt-1 ${accent ? 'text-clay-500' : 'text-navy-900'}`}>
        {value}
      </p>
    </Card>
  );
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-navy-700 text-white hover:bg-navy-600',
    secondary: 'bg-navy-50 text-navy-700 hover:bg-navy-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-navy-600 hover:bg-navy-50',
  };
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ label, className = '', ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="block mb-1 font-medium text-navy-700">{label}</span>}
      <input
        className={`w-full border border-navy-100 rounded-md px-3 py-2 focus:border-navy-700 outline-none ${className}`}
        {...props}
      />
    </label>
  );
}

export function Select({ label, options, className = '', ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="block mb-1 font-medium text-navy-700">{label}</span>}
      <select
        className={`w-full border border-navy-100 rounded-md px-3 py-2 focus:border-navy-700 outline-none bg-white ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Table({ columns, rows, emptyMessage = 'No records yet.' }) {
  if (!rows || rows.length === 0) {
    return <p className="text-navy-400 text-sm py-8 text-center">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-navy-600 border-b border-navy-100">
            {columns.map((col) => (
              <th key={col.key} className="py-2 pr-4 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i} className="border-b border-navy-50 hover:bg-navy-50/50">
              {columns.map((col) => (
                <td key={col.key} className="py-2 pr-4">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({ children, tone = 'default' }) {
  const tones = {
    default: 'bg-navy-50 text-navy-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display text-navy-900">{title}</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-navy-700" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
