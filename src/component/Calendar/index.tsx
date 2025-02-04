import { useEffect, useState } from "react";
import { map, times } from "lodash";
import separteDate from "../../util/useDateTimes";

type CalendarTypes = {
  select: {
    selected: string;
    setter: Function;
  };
  closeFunc?: Function;
  past?: string;
  future?: string;
  separater?: string;
};

function index({
  select,
  past = "",
  future = "",
  closeFunc,
  separater = "-",
}: CalendarTypes) {
  const weeksFormat = ["일", "월", "화", "수", "목", "금", "토"];
  const today = new Date(); // 현재 날짜를 나타내는 Date 객체를 저장한다.
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [date, setDate] = useState({
    today: today,
    year: currentYear,
    month: currentMonth,
  });

  const [outPut, setOutput] = useState({
    year: separteDate(select.selected).year,
    month: separteDate(select.selected).month,
    date: separteDate(select.selected).date,
    day: separteDate(select.selected).day,
    dateStr: separteDate(select.selected).dateStr,
  });

  // useEffect(() => {
  //   select.selected && setOutput(separteDate(select.selected));
  // }, [select.selected]);
  const currentMonthFirstDay = new Date(date.year, date.month, 1);
  const nextMonthFirstDay = new Date(date.year, date.month + 1, 1);

  const currentMonthLength = new Date(date.year, date.month + 1, 0).getDate();

  const currentMonthFirstWeeksFirstDay = currentMonthFirstDay.getDay();
  const nextMonthFirstWeeksFirstDay = nextMonthFirstDay.getDay();

  const monthHandler = (type: "prev" | "next") => {
    if (type === "prev") {
      if (date.month - 1 < 0) {
        setDate((prev) => {
          return { ...prev, year: prev.year - 1, month: 11 };
        });

        // setOutput((prev) => {
        //   return {
        //     ...prev,
        //     year: prev.year && prev.year - 1,
        //   };
        // });
      } else {
        setDate((prev) => {
          return { ...prev, month: prev.month - 1 };
        });
      }
    } else {
      if (date.month + 1 > 11) {
        setDate((prev) => {
          return { ...prev, year: prev.year + 1, month: 0 };
        });

        // setOutput((prev) => {
        //   return {
        //     ...prev,
        //     year: prev.year && prev.year + 1,
        //   };
        // });
      } else {
        setDate((prev) => {
          return { ...prev, month: prev.month + 1 };
        });
      }
    }
  };

  const [weeks] = useState(weeksFormat);

  const getDayOfSelected = (year: number, month: number, date: number) => {
    const monthStr = month + 1 < 11 ? `0${month}` : month;
    const dateStr = date < 10 ? `0${date}` : date;
    const fullDateStr = `${year}${separater}${monthStr}${separater}${dateStr}`;

    const day = new Date(fullDateStr).getDay();

    return { day, fullDateStr };
  };

  return (
    <>
      <div className="relative flex-auto max-w-md p-4 bg-white border rounded-md min-w-64">
        <div className="flex items-center justify-center gap-4 mb-4 text-xs">
          <button
            className="btn btn-xs btn-ghost btn-primary"
            onClick={() => monthHandler("prev")}
          >
            &lt;
          </button>
          <div>{date.year}</div>
          <>/</>
          <div>{date.month + 1}</div>
          <button
            className="btn btn-xs btn-ghost btn-primary"
            onClick={() => monthHandler("next")}
          >
            &gt;
          </button>
        </div>

        <div className="calendar">
          {/* days header */}
          <div className="flex items-center justify-between pb-1 text-xs border-b-2">
            {map(weeks, (item, index) => {
              return (
                <p className="flex-auto text-center" key={`${item}-${index}`}>
                  {item}
                </p>
              );
            })}
          </div>

          <div
            className="grid items-center grid-cols-7 gap-2 text-xs text-center"
            style={{ minHeight: 240 }}
          >
            {/* prev month date */}
            {times(currentMonthFirstWeeksFirstDay, (item) => {
              const prevMonthDaysLength = new Date(
                date.year,
                date.month,
                0
              ).getDate();

              const prevDisableCheck = `${
                date.month === 0 ? date.year - 1 : date.year
              }${separater}${date.month < 10 ? "0" : ""}${
                date.month === 0 ? 12 : date.month
              }${separater}${
                prevMonthDaysLength -
                  (currentMonthFirstWeeksFirstDay - item - 1) <
                10
                  ? "0"
                  : ""
              }${
                prevMonthDaysLength -
                (currentMonthFirstWeeksFirstDay - item - 1)
              }`;

              const pastCheckInPrev =
                new Date(past).getTime() > new Date(prevDisableCheck).getTime();
              const futureCheckInPrev =
                new Date(future).getTime() <
                new Date(prevDisableCheck).getTime();
              return (
                <p
                  id={`${date.month}-${
                    prevMonthDaysLength -
                    (currentMonthFirstWeeksFirstDay - item - 1)
                  }`}
                  className={`h-full flex items-center justify-center box-border cursor-pointer text-base-300 ${
                    pastCheckInPrev || futureCheckInPrev
                      ? "line-through italic decoration-4"
                      : ""
                  }`}
                  key={`prev-${item}`}
                  onTouchStart={(e) => e.preventDefault()}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={() => {
                    const { day, fullDateStr } = getDayOfSelected(
                      date.year,
                      date.month,
                      prevMonthDaysLength -
                        (currentMonthFirstWeeksFirstDay - item - 1)
                    );

                    if (
                      (past !== "" &&
                        new Date(fullDateStr).getTime() <
                          new Date(past).getTime()) ||
                      (future !== "" &&
                        new Date(fullDateStr).getTime() >
                          new Date(future).getTime())
                    ) {
                      // setAlert(true);
                    } else {
                      monthHandler("prev");

                      setOutput((prev) => {
                        return {
                          ...prev,
                          month: date.month - 1,
                          date:
                            prevMonthDaysLength -
                            (currentMonthFirstWeeksFirstDay - item - 1),
                          day: day,
                          dateStr: fullDateStr,
                        };
                      });
                      select.setter(fullDateStr);
                    }
                  }}
                >
                  {prevMonthDaysLength -
                    (currentMonthFirstWeeksFirstDay - item - 1)}
                </p>
              );
            })}
            {/* current month date */}
            {times(currentMonthLength, (item) => {
              const currentDisableCheck = `${
                date.month + 1 === 0 ? date.year - 1 : date.year
              }${separater}${date.month + 1 < 10 ? "0" : ""}${
                date.month + 1 === 0 ? 12 : date.month + 1
              }${separater}${item + 1 < 10 ? "0" : ""}${item + 1}`;

              const pastCheckInCurrent =
                new Date(past).getTime() >
                new Date(currentDisableCheck).getTime();

              const futureCheckInCurrent =
                new Date(future).getTime() <
                new Date(currentDisableCheck).getTime();
              return (
                <p
                  className={`rounded-md h-full flex items-center justify-center box-border cursor-pointer ${
                    pastCheckInCurrent || futureCheckInCurrent
                      ? "line-through italic decoration-4"
                      : ""
                  }
                  ${
                    today.getMonth() === date.month &&
                    date.today.getDate() === item + 1 &&
                    "text-secondary font-bold"
                  } ${
                    separteDate(select.selected).year === date.year &&
                    separteDate(select.selected).month === date.month + 1 &&
                    separteDate(select.selected).date === item + 1 &&
                    "bg-secondary !text-white"
                  }
                  `}
                  key={`current-${item}`}
                  id={`${date.month + 1}-${item + 1}`}
                  // onTouchStart={(e) => e.stopPropagation()}
                  // onMouseDown={(e) => {
                  //   e.stopPropagation();
                  // }}
                  onClick={() => {
                    const { day, fullDateStr } = getDayOfSelected(
                      date.year,
                      date.month + 1,
                      item + 1
                    );
                    if (
                      (past !== "" &&
                        new Date(fullDateStr).getTime() <
                          new Date(past).getTime()) ||
                      (future !== "" &&
                        new Date(fullDateStr).getTime() >
                          new Date(future).getTime())
                    ) {
                      // setAlert(true);
                    } else {
                      setOutput((prev) => {
                        return {
                          ...prev,
                          month: date.month,
                          date: item + 1,
                          day: day,
                          dateStr: fullDateStr,
                        };
                      });
                      select.setter(fullDateStr);
                    }
                  }}
                >
                  {item + 1}
                </p>
              );
            })}

            {/* next month date */}
            {7 - nextMonthFirstWeeksFirstDay !== 7 &&
              times(7 - nextMonthFirstWeeksFirstDay, (item) => {
                const nextDisableCheck = `${
                  date.month + 2 > 12 ? date.year + 1 : date.year
                }${separater}${date.month + 2 < 10 ? "0" : ""}${
                  date.month + 2 > 12 ? 1 : date.month + 2
                }${separater}${item + 1 < 10 ? "0" : ""}${item + 1}`;

                const pastCheckInNext =
                  new Date(past).getTime() >=
                  new Date(nextDisableCheck).getTime();
                const futureCheckInNext =
                  new Date(future).getTime() <=
                  new Date(nextDisableCheck).getTime();
                return (
                  <p
                    className={`box-border flex items-center justify-center h-full cursor-pointer text-base-300 ${
                      pastCheckInNext || futureCheckInNext
                        ? "line-through italic decoration-4"
                        : ""
                    }`}
                    key={`next-${item}`}
                    onTouchStart={(e) => e.preventDefault()}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      const { day, fullDateStr } = getDayOfSelected(
                        date.year,
                        date.month + 2,
                        item + 1
                      );
                      if (
                        (past !== "" &&
                          new Date(fullDateStr).getTime() <
                            new Date(past).getTime()) ||
                        (future !== "" &&
                          new Date(fullDateStr).getTime() >
                            new Date(future).getTime())
                      ) {
                        // setAlert(true);
                      } else {
                        monthHandler("next");

                        setOutput((prev) => {
                          return {
                            ...prev,
                            month: date.month + 1,
                            date: item + 1,
                            day: day,
                            dateStr: fullDateStr,
                          };
                        });
                        select.setter(fullDateStr);
                      }
                    }}
                  >
                    {item + 1}
                  </p>
                );
              })}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="rounded-md btn btn-xs btn-outline"
              onClick={() => {
                closeFunc?.();
                select.setter("");
                setOutput((prev) => {
                  return {
                    ...prev,
                    month: 0,
                    date: 0,
                    day: 0,
                    dateStr: "",
                  };
                });
              }}
            >
              닫기
            </button>

            <button
              className="rounded-md btn btn-xs btn-outline disabled:bg-red-50"
              disabled={outPut.dateStr === ""}
              onClick={() => {
                closeFunc?.();
              }}
            >
              선택
            </button>
          </div>
        </div>

        {/* <div className="absolute top-[20px] left-0 flex justify-center w-full gap-32">
          <button
            className="btn btn-xs btn-ghost btn-primary"
            onClick={() => monthHandler("prev")}
          >
            &lt;
          </button>

          <button
            className="btn btn-xs btn-ghost btn-primary"
            onClick={() => monthHandler("next")}
          >
            &gt;
          </button>
        </div> */}
        {/* <button
          className="absolute top-[1rem] right-[1rem] btn btn-xs btn-ghost"
          onClick={() => {
            closeFunc?.();
          }}
        >
         
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button> */}
      </div>
    </>
  );
}

export default index;
