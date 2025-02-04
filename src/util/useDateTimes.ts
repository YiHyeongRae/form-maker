function separteDate(fullDateStr: string) {
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  const year = new Date(fullDateStr).getFullYear();
  const month = new Date(fullDateStr).getMonth() + 1;
  const date = new Date(fullDateStr).getDate();
  const day = new Date(fullDateStr).getDay();
  const dayStr = days[day];
  const dateStr = fullDateStr;

  return { year, month, date, day, dayStr, dateStr };
}
export default separteDate;
