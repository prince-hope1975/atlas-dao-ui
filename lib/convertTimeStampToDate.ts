function convertTimestampToDate(timestampNs: number): Date {
  const milliseconds = timestampNs / 1e6; // Convert nanoseconds to milliseconds
  return new Date(milliseconds);
}
export default convertTimestampToDate;