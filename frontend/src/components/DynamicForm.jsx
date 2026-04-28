import { useState, useCallback } from "react";

function TableField({ field, value, onChange }) {
  const columns = field.columns || [];
  const rows = value || [];

  const addRow = () => {
    const emptyRow = columns.reduce((acc, col) => ({ ...acc, [col.name]: "" }), {});
    onChange([...rows, emptyRow]);
  };

  const removeRow = (idx) => {
    onChange(rows.filter((_, i) => i !== idx));
  };

  const updateCell = (rowIdx, colName, val) => {
    const updated = rows.map((row, i) =>
      i === rowIdx ? { ...row, [colName]: val } : row
    );
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-white">
              {columns.map((col) => (
                <th
                  key={col.name}
                  className="px-3 py-2.5 text-left text-xs font-semibold tracking-wide"
                >
                  {col.label}
                  {col.computed && (
                    <span className="ml-1 text-xs opacity-60">(auto)</span>
                  )}
                </th>
              ))}
              <th className="px-3 py-2.5 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-6 text-center text-ink-faint text-sm"
                >
                  No rows yet — click "Add Row" below
                </td>
              </tr>
            )}
            {rows.map((row, idx) => {
              // Compute totals for budget tables
              let computedTotal = null;
              if (field.name === "budget_items") {
                const qty = parseFloat(row.quantity || 0);
                const uc = parseFloat(row.unit_cost || 0);
                computedTotal = isNaN(qty * uc) ? "—" : (qty * uc).toFixed(2);
              }

              return (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {columns.map((col) => (
                    <td key={col.name} className="px-2 py-1.5 border-t border-gray-100">
                      {col.computed ? (
                        <span className="text-ink-muted px-2">{computedTotal ?? "—"}</span>
                      ) : (
                        <input
                          type={col.name === "quantity" || col.name === "unit_cost" ? "number" : "text"}
                          className="tbl-input"
                          value={row[col.name] || ""}
                          min={0}
                          onChange={(e) => updateCell(idx, col.name, e.target.value)}
                          placeholder={col.label}
                          id={`table-${field.name}-${idx}-${col.name}`}
                        />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="p-1 rounded text-ink-faint hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      title="Remove row"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="btn-outline text-xs py-1.5 px-3"
        id={`add-row-${field.name}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Row
      </button>
    </div>
  );
}

export default function DynamicForm({ schema, formData, onChange }) {
  if (!schema) return null;

  const handleChange = useCallback(
    (name, value) => {
      onChange({ ...formData, [name]: value });
    },
    [formData, onChange]
  );

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {schema.fields?.map((field) => {
        const { name, label, type, required, placeholder } = field;

        return (
          <div key={name}>
            <label htmlFor={`field-${name}`} className="field-label">
              {label}
              {required && <span className="field-required">*</span>}
            </label>

            {type === "table" ? (
              <TableField
                field={field}
                value={formData[name]}
                onChange={(val) => handleChange(name, val)}
              />
            ) : type === "textarea" ? (
              <textarea
                id={`field-${name}`}
                className="field-input resize-none"
                rows={3}
                value={formData[name] || ""}
                placeholder={placeholder || ""}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            ) : (
              <input
                id={`field-${name}`}
                type={type || "text"}
                className="field-input"
                value={formData[name] || ""}
                placeholder={placeholder || ""}
                onChange={(e) => handleChange(name, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </form>
  );
}
