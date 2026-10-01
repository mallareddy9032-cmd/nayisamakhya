/**
 * Generic browser CSV download helper.
 * Prefixed UTF-8 BOM (`\uFEFF`) so Telugu / Unicode columns open correctly in Excel.
 */

export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filenamePrefix: string,
  columnLabels?: Record<string, string>,
): boolean {
  if (!data || data.length === 0) {
    alert(
      "ఎగుమతి చేయడానికి ఎలాంటి డేటా లేదు (No data to export)",
    );
    return false;
  }

  const keys = Object.keys(data[0]);
  const headerRow = keys
    .map((k) => (columnLabels && columnLabels[k] ? columnLabels[k] : k))
    .join(",");

  const contentRows = data.map((row) =>
    keys
      .map((key) => {
        let val: unknown = row[key];
        if (typeof val === "object" && val !== null) {
          val = JSON.stringify(val);
        }
        const stringVal = String(val ?? "").replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(","),
  );

  // \uFEFF Byte Order Mark ensures Telugu script renders properly in Excel
  const csvContent = "\uFEFF" + [headerRow, ...contentRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.setAttribute(
    "download",
    `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.csv`,
  );
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
  return true;
}
