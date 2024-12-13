export function formatInstagramCount(count: number): string {
  if (count >= 1000000) {
    const millions = (count / 1000000).toFixed(1);
    // Remove trailing .0 if present
    return `${millions.endsWith('.0') ? millions.slice(0, -2) : millions}M`;
  } else if (count >= 10000) {
    // For numbers >= 10K, show no decimal places
    return `${Math.floor(count / 1000)}K`;
  } else if (count >= 1000) {
    // For numbers between 1K and 9999, show one decimal place
    const thousands = (count / 1000).toFixed(1);
    return `${thousands.endsWith('.0') ? thousands.slice(0, -2) : thousands}K`;
  }
  return count.toString();
}
