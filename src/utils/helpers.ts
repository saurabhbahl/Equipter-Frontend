export function truncateText(text: string, wordLimit: number): string {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
}
export function formatDate(isoDate: string) {
  const date = new Date(isoDate);
  // return date.toLocaleString('en-US', { timeZone: 'UTC' });
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "2-digit",
    month: "2-digit",    
    day: "2-digit",
    timeZone: "UTC",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second:"2-digit",
    hour12:false,
    timeZone: "UTC",
  });
  return `${formattedDate}, ${formattedTime}`;
}
