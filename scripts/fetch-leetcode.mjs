// Diagnostic: print the stale banner error message and the actual content
// of the visualizations region.
const url = 'http://127.0.0.1:3001/leetcode';
const res = await fetch(url, { redirect: 'follow' });
const html = await res.text();

// Print the "out of date" area more loosely
const idx = html.indexOf('Stats may be out of date');
if (idx >= 0) {
  const slice = html.slice(idx, idx + 1500);
  console.log('--- Stale banner region ---');
  console.log(slice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800));
}

// Print a snippet around kpi-total-solved
const kpiIdx = html.indexOf('kpi-total-solved');
if (kpiIdx >= 0) {
  console.log('\n--- kpi-total-solved region ---');
  console.log(html.slice(kpiIdx, kpiIdx + 200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// Print around leetcode-visualizations
const visIdx = html.indexOf('leetcode-visualizations');
if (visIdx >= 0) {
  console.log('\n--- Visualizations region (text only) ---');
  const end = html.indexOf('mt-10', visIdx);
  const slice = html.slice(visIdx, end);
  console.log(slice.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 1200));
}
