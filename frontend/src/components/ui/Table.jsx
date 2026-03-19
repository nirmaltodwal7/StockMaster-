export const Table = ({ headers, children }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border glass bg-card/40">
      <table className="w-full text-sm text-left">
        <thead className="bg-accent/40 text-muted-foreground border-b border-border">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children }) => (
  <tr className="hover:bg-accent/20 transition-colors">
    {children}
  </tr>
);

export const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
    {children}
  </td>
);
