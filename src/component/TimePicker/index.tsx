import { useState } from "react";
import { times } from "lodash";
import separateTimes from "../../util/useTimes";

type TimePickerTypes = {
  fixedHeight?: string;
  type?: "half" | "full";

  select: {
    selected: string;
    ampm: string;
    setter: Function;
  };
  use: {
    hour: boolean;
    minute: boolean;
    second: boolean;
  };

  perSecond?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12;
  perItems?: number;
  closeFunc: Function;
};

function index({
  fixedHeight = "h-[120px]",
  type = "full",
  select,

  use,
  perSecond = 10,
  perItems = 4,
  closeFunc,
}: TimePickerTypes) {
  const [timeState, setTimeState] = useState({
    ampm: select.ampm || "",
    hour: separateTimes(select.selected).hour || "",
    minute: separateTimes(select.selected).minute || "",
    second: separateTimes(select.selected).second || "",
    timeStr: select.selected || "",
  });

  const heightRegex = /\[([^\]]+)\]/g;
  const regexResult = heightRegex.exec(fixedHeight);
  const pickerHeight = regexResult !== null && regexResult[1].replace("px", "");

  return (
    <div className="bg-white border rounded-md">
      <div className="p-2 text-xs text-center border-b bg-zinc-100">
        시간을 지정해주세요 [ 시간 | 분 | 오전/오후 ]
      </div>
      <div className={`flex flex-col flex-auto ${fixedHeight} `}>
        <div className={`flex gap-2 flex-auto ${fixedHeight}`}>
          {use.hour && (
            <div
              className="flex flex-col flex-auto overflow-auto text-xs time-picker"
              style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
            >
              {/* hours */}
              {times(
                type === "half" ? 13 + (perItems - 1) : 23 + (perItems - 1),
                (item: number) => {
                  return (
                    <span
                      className={`block text-center cursor-pointer ${
                        Number(item) ===
                          (timeState.hour !== "" && Number(timeState.hour)) &&
                        "bg-secondary text-white"
                      }`}
                      key={`hour-${item}`}
                      style={{
                        minHeight: Number(pickerHeight) / perItems,
                        lineHeight: `${Number(pickerHeight) / perItems}px`,
                        visibility:
                          item > (type === "half" ? 12 : 23)
                            ? "hidden"
                            : "visible",
                      }}
                      onClick={(e) => {
                        const parentEl = e.currentTarget.parentElement;

                        if (
                          parentEl &&
                          parentEl?.scrollTop !==
                            item * (Number(pickerHeight) / perItems)
                        ) {
                          parentEl.scrollTo({
                            top: item * (Number(pickerHeight) / perItems),
                            behavior: "smooth",
                          });
                        }
                        console.log(
                          "???",
                          item * (Number(pickerHeight) / perItems)
                        );
                        const hourItem = String(item < 10 ? `0${item}` : item);

                        setTimeState((prev) => {
                          return {
                            ...prev,
                            hour: hourItem,
                            timeStr: `${hourItem}:${prev.minute}`,
                          };
                        });
                        select.setter(
                          `${
                            timeState.ampm === "AM" ? "오전" : "오후"
                          } ${hourItem}:${timeState.minute}${
                            timeState.second ? ":" : ""
                          }${timeState.second}`
                        );
                      }}
                    >
                      {item < 10 ? `0${item}` : item}
                    </span>
                  );
                }
              )}
            </div>
          )}

          {use.minute && (
            <div
              className="flex flex-col flex-auto overflow-auto text-xs time-picker"
              style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
            >
              {/* minutes */}
              {times(59 + perItems, (item) => {
                return (
                  <span
                    className={`text-center cursor-pointer ${
                      timeState.minute !== "" &&
                      Number(item) === Number(timeState.minute) &&
                      "bg-secondary text-white"
                    }`}
                    key={`minute-${item}`}
                    style={{
                      visibility: item > 59 ? "hidden" : "visible",
                      minHeight: Number(pickerHeight) / perItems,
                      lineHeight: `${Number(pickerHeight) / perItems}px`,
                    }}
                    onClick={(e) => {
                      const parentEl = e.currentTarget.parentElement;

                      if (
                        parentEl &&
                        parentEl?.scrollTop !==
                          item * (Number(pickerHeight) / perItems)
                      ) {
                        parentEl.scrollTo({
                          top: item * (Number(pickerHeight) / perItems),
                          behavior: "smooth",
                        });
                      }
                      const minuteItem = String(item < 10 ? `0${item}` : item);

                      setTimeState((prev) => {
                        return {
                          ...prev,
                          minute: minuteItem,
                          timeStr: `${prev.hour}:${minuteItem}`,
                        };
                      });
                      select.setter(
                        `${timeState.ampm === "AM" ? "오전" : "오후"} ${
                          timeState.hour
                        }:${minuteItem}${timeState.second ? ":" : ""}${
                          timeState.second
                        }`
                      );
                    }}
                  >
                    {item < 10 ? `0${item}` : item}
                  </span>
                );
              })}
            </div>
          )}

          {/* seconds */}
          {use.second && (
            <div
              className="flex flex-col flex-auto overflow-auto text-xs time-picker"
              style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
            >
              {times(59 / perSecond + perItems, (item) => {
                return (
                  <span
                    className={` text-center cursor-pointer ${
                      timeState.second !== "" &&
                      Number(item * perSecond) === Number(timeState.second) &&
                      "bg-secondary text-white"
                    }`}
                    style={{
                      visibility: item > 59 / perSecond ? "hidden" : "visible",
                      minHeight: Number(pickerHeight) / perItems,
                      lineHeight: `${Number(pickerHeight) / perItems}px`,
                    }}
                    key={`hour-${item + 1}`}
                    onClick={(e) => {
                      const parentEl = e.currentTarget.parentElement;

                      if (
                        parentEl &&
                        parentEl?.scrollTop !==
                          item * (Number(pickerHeight) / perItems)
                      ) {
                        parentEl.scrollTo({
                          top: item * (Number(pickerHeight) / perItems),
                          behavior: "smooth",
                        });
                      }
                      const secondItem = String(
                        item * perSecond < 10
                          ? `0${item * perSecond}`
                          : item * perSecond
                      );

                      setTimeState((prev) => {
                        return {
                          ...prev,
                          second: secondItem,
                          timeStr: `${prev.hour}:${prev.minute}:${secondItem}`,
                        };
                      });
                      select.setter(
                        `${timeState.ampm} ${timeState.hour}:${timeState.minute}:${secondItem}`
                      );
                    }}
                  >
                    {item * perSecond < 10
                      ? `0${item * perSecond}`
                      : item * perSecond}
                  </span>
                );
              })}
            </div>
          )}

          {type === "half" && (
            <div
              className="flex flex-col flex-auto overflow-auto text-xs time-picker"
              style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
            >
              <span
                className={`text-center cursor-pointer ${
                  timeState.ampm === "AM" && "bg-secondary text-white"
                }`}
                style={{
                  minHeight: Number(pickerHeight) / perItems,
                  lineHeight: `${Number(pickerHeight) / perItems}px`,
                }}
                onClick={(e) => {
                  const parentEl = e.currentTarget.parentElement;

                  if (parentEl && parentEl?.scrollTop !== 0) {
                    parentEl.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }
                  setTimeState((prev) => {
                    return {
                      ...prev,
                      ampm: "AM",
                      timeStr: `오전 ${prev.timeStr}`,
                    };
                  });
                  select.setter(
                    `오전 ${timeState.hour}:${timeState.minute}${
                      timeState.second ? ":" : ""
                    }${timeState.second}`
                  );
                }}
              >
                오전
              </span>
              <span
                className={`text-center cursor-pointer ${
                  timeState.ampm === "PM" && "bg-secondary text-white"
                }`}
                style={{
                  minHeight: Number(pickerHeight) / perItems,
                  lineHeight: `${Number(pickerHeight) / perItems}px`,
                }}
                onClick={(e) => {
                  const parentEl = e.currentTarget.parentElement;

                  if (
                    parentEl &&
                    parentEl?.scrollTop !== Number(pickerHeight) / perItems
                  ) {
                    parentEl.scrollTo({
                      top: Number(pickerHeight) / perItems,
                      behavior: "smooth",
                    });
                  }
                  setTimeState((prev) => {
                    return {
                      ...prev,
                      ampm: "PM",
                      timeStr: `오후 ${prev.timeStr}`,
                    };
                  });
                  select.setter(
                    `오후 ${timeState.hour}:${timeState.minute}${
                      timeState.second ? ":" : ""
                    }${timeState.second}`
                  );
                }}
              >
                오후
              </span>
              {times(perItems - 1, () => {
                return (
                  <span
                    className={`text-center cursor-pointer`}
                    style={{
                      visibility: "hidden",
                      minHeight: Number(pickerHeight) / perItems,
                      lineHeight: `${Number(pickerHeight) / perItems}px`,
                    }}
                  >
                    PM
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mx-4 mt-4 mb-4">
        <button
          className="rounded-md btn btn-xs btn-outline"
          onClick={() => {
            closeFunc?.();

            select.setter("");
            setTimeState((prev) => {
              return { ...prev, ampm: "", hour: "", minute: "", second: "" };
            });
          }}
        >
          닫기
        </button>

        <button
          className="rounded-md btn btn-xs btn-outline disabled:bg-red-50"
          disabled={
            timeState.hour === "" ||
            timeState.minute === "" ||
            timeState.ampm === "" ||
            timeState.timeStr === ""
          }
          onClick={() => {
            closeFunc?.();
          }}
        >
          선택
        </button>
      </div>
    </div>
  );
}

export default index;
