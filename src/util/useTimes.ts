function separateTimes(fullTimeStr: string, isAmpm?: string) {
  const hour = fullTimeStr.substring(3, 5) || null;
  const minute = fullTimeStr.substring(6, 8) || null;
  const second = fullTimeStr.substring(9, 11) || null;
  const ampm = isAmpm || null;

  return { ampm, hour, minute, second };
}
export default separateTimes;
