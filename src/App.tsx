/* eslint-disable react-hooks/rules-of-hooks */
import "./App.css";
import MainLogo from "../public/logo.png";
import Calendar from "./component/Calendar";
import { useState } from "react";
import { map } from "lodash";
import TimePicker from "./component/TimePicker";
import useDateTimes from "./util/useDateTimes";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [isAgree, setIsAgree] = useState(false);
  const [order, setOrder] = useState({
    name: "",
    phone: "",
    pickupDate: "",
    pickupTime: "",
    cakeSize: "",
    cakeSheet: "",
    cakeInnerCream: "",
    cakeTopping: "",
    way: "",
    detail: "",
  });
  // const date = new Date();
  // const year = date.getFullYear();
  // const monthStr =
  //   date.getMonth() + 1 < 11 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  // const dateStr = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  // const today = `${year}-${monthStr}-${dateStr}`;

  const [calender, setCalendar] = useState(false);
  const [timepicker, setTimepicker] = useState(false);

  const sizeArr = [
    "한입케이크 (500원크기) 1개",
    "한입케이크 (500원크기) 2개",
    "도시락 (지름 9cm)",
    "미니 (지름11cm)",
    "1호 (지름15cm)",
    "2호 (지름18cm)",
    "1호 2단 (1호 + 도시락)",
    "2호 2단 (2호 + 미니)",
  ];
  const sheetArr = [
    { sheet: "바닐라", price: 0 },
    { sheet: "초코", price: 1000 },
  ];

  const creamArr = [
    { cream: "우유생크림", price: 0 },
    { cream: "오레오크림", price: 1500 },
    { cream: "초코크림", price: 3000 },
    { cream: "블루베리크림", price: 2000 },
    // { cream: "라즈베리크림", price: 2000, status: "SOLD_OUT" },
  ];

  const toppingArr = [
    { topping: "없음", price: 0 },
    // { topping: "초콜릿칩", price: 1500 },
    { topping: "오레오쿠키", price: 1500 },
  ];

  return (
    <div className="bg-[#fafafa]">
      <main className="px-5 py-4 overflow-hidden touch-pan-y max-w-[720px] mx-auto bg-white">
        <div className="flex items-center justify-center">
          <div className="w-64">
            <img className="w-full" src={MainLogo} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xs text-center break-keep">
            카카오톡 채널에서 <br />
            모든메뉴글 및 주의사항을 꼭 읽어주세요!
            <br />
            모두 읽고 동의하셔야 주문서 작성이 가능합니다.
          </div>
          <label className="justify-center gap-2 cursor-pointer label">
            <span className="text-xs label-text text-error">
              모든메뉴글 및 주의사항 동의
            </span>
            <input
              type="checkbox"
              checked={isAgree}
              className="checkbox [--chkbg:oklch(var(--er))] [--chkfg:oklch(var(--b1))]"
              onChange={() => setIsAgree((prev) => !prev)}
            />
          </label>

          <label className="flex items-center text-xs input input-bordered ">
            <span className="min-w-20">성함</span>
            <input
              type="text"
              disabled={!isAgree}
              className="grow"
              placeholder="주문하시는분 성함"
              value={order.name || ""}
              onChange={(e) =>
                setOrder((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          </label>

          <label className="flex items-center text-xs input input-bordered">
            <span className="min-w-20">연락처</span>
            <input
              type="text"
              disabled={!isAgree}
              className="grow"
              value={order.phone || ""}
              placeholder=" - 없이 입력"
              maxLength={13}
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/[^0-9]/g, "");

                // 하이픈 추가
                let formattedNumber = "";
                if (onlyNumber.length <= 3) {
                  // 3자리 이하: 그대로
                  formattedNumber = onlyNumber;
                } else if (onlyNumber.length <= 7) {
                  // 4~7자리: 010-xxxx
                  formattedNumber = onlyNumber.replace(
                    /(\d{3})(\d{1,4})/,
                    "$1-$2"
                  );
                } else {
                  // 8자리 이상: 010-xxxx-xxxx
                  formattedNumber = onlyNumber.replace(
                    /(\d{3})(\d{4})(\d{1,4})/,
                    "$1-$2-$3"
                  );
                }
                setOrder((prev) => {
                  return { ...prev, phone: formattedNumber };
                });
              }}
            />
          </label>

          <label className="flex items-center text-xs input input-bordered">
            <span className="min-w-20">픽업날짜</span>
            <input
              type="text"
              disabled={!isAgree}
              className="grow"
              value={order.pickupDate}
              inputMode="none"
              style={{ caretColor: "transparent" }}
              placeholder="클릭해서 고르기"
              onClick={() => {
                document.getElementById("sheet")?.removeAttribute("open");
                document.getElementById("topping")?.removeAttribute("open");
                document.getElementById("cream")?.removeAttribute("open");
                document.getElementById("size")?.removeAttribute("open");

                setCalendar(true);
              }}
            />
          </label>

          <div
            className="fixed z-[99999] top-0 left-0 w-full h-full"
            style={{
              visibility: calender ? "visible" : "hidden",
              opacity: calender ? 1 : 0,
              transition: "all .2s linear",
            }}
          >
            <div className="p-4 w-full absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%]">
              <Calendar
                select={{
                  selected: order.pickupDate,
                  setter: (date: string) =>
                    setOrder((prev) => {
                      return { ...prev, pickupDate: date };
                    }),
                }}
                past={"2025-05-27"}
                future="2025-05-27"
                closeFunc={() => setCalendar(false)}
              />
            </div>
          </div>

          <div className="text-xs text-center">
            선택이 불가한 날짜는
            <br />
            <span className="underline underline-offset-4 text-error">
              예약 마감
            </span>
            &nbsp;되었습니다!
          </div>
          <label className="flex items-center text-xs input input-bordered">
            <span className="min-w-20">픽업시간</span>
            <input
              disabled={!isAgree}
              type="text"
              className="grow"
              value={order.pickupTime}
              placeholder="클릭해서 고르기"
              inputMode="none"
              style={{ caretColor: "transparent" }}
              onClick={() => {
                document.getElementById("sheet")?.removeAttribute("open");
                document.getElementById("topping")?.removeAttribute("open");
                document.getElementById("cream")?.removeAttribute("open");
                document.getElementById("size")?.removeAttribute("open");

                setTimepicker(true);
              }}
            />
          </label>

          <div
            className="fixed z-[99999] top-0 left-0 w-full h-full "
            style={{
              visibility: timepicker ? "visible" : "hidden",
              opacity: timepicker ? 1 : 0,
              transition: "all .2s linear",
            }}
          >
            <div className="p-4  w-full absolute top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] ">
              {timepicker && (
                <TimePicker
                  type="half"
                  select={{
                    selected: order.pickupTime,
                    setter: (time: string) =>
                      setOrder((prev) => {
                        return { ...prev, pickupTime: time };
                      }),
                    ampm:
                      order.pickupTime !== ""
                        ? order.pickupTime.includes("오후")
                          ? "PM"
                          : "AM"
                        : "",
                  }}
                  use={{ hour: true, minute: true, second: false }}
                  closeFunc={() => setTimepicker(false)}
                />
              )}
            </div>
          </div>
          <label
            className="flex items-center text-xs input input-bordered"
            style={{
              pointerEvents: !isAgree ? "none" : "initial",
              borderColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/1))"
                : "var(--fallback-bc,oklch(var(--bc)/0.2))",
              backgroundColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))"
                : "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
              color: !isAgree
                ? "var(--fallback-bc,oklch(var(--bc)/0.4))"
                : "inherit",
            }}
          >
            <span className="min-w-20">사이즈</span>
            <details
              id="size"
              className="flex-auto dropdown"
              onClick={() => {
                document.getElementById("sheet")?.removeAttribute("open");
                document.getElementById("topping")?.removeAttribute("open");
                document.getElementById("cream")?.removeAttribute("open");
              }}
            >
              <summary
                className="w-full font-normal justify-start pl-0 ml-0 btn text-xs btn-ghost hover:!bg-transparent"
                style={{
                  color: order.cakeSize === "" ? "#aeaeae" : "inherit",
                  opacity: !isAgree ? "0.9" : "1",
                }}
              >
                {order.cakeSize === "" ? "클릭해서 고르기" : order.cakeSize}
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {map(sizeArr, (item, index) => {
                  return (
                    <li key={item + index}>
                      <a
                        onClick={() => {
                          document
                            .getElementById("size")
                            ?.removeAttribute("open");

                          if (item.includes("한입")) {
                            setOrder((prev) => {
                              return {
                                ...prev,
                                cakeSize: item,
                                cakeInnerCream: "",
                                cakeTopping: "",
                              };
                            });
                          } else {
                            setOrder((prev) => {
                              return { ...prev, cakeSize: item };
                            });
                          }
                        }}
                        className="text-xs active:!bg-secondary"
                      >
                        {item}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </details>
          </label>
          <label
            className="flex items-center text-xs input input-bordered"
            style={{
              pointerEvents: !isAgree ? "none" : "initial",
              borderColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/1))"
                : "var(--fallback-bc,oklch(var(--bc)/0.2))",
              backgroundColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))"
                : "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
              color: !isAgree
                ? "var(--fallback-bc,oklch(var(--bc)/0.4))"
                : "inherit",
            }}
          >
            <span className="min-w-20">빵 시트</span>
            <details
              id="sheet"
              className="flex-auto dropdown"
              onClick={() => {
                document.getElementById("topping")?.removeAttribute("open");
                document.getElementById("cream")?.removeAttribute("open");
                document.getElementById("size")?.removeAttribute("open");
              }}
            >
              <summary
                className="w-full font-normal justify-start pl-0 ml-0 btn text-xs btn-ghost hover:!bg-transparent"
                style={{
                  color: order.cakeSheet === "" ? "#aeaeae" : "inherit",
                  opacity: !isAgree ? "0.9" : "1",
                }}
              >
                {order.cakeSheet === "" ? "클릭해서 고르기" : order.cakeSheet}
              </summary>
              {/* <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {map(sheetArr, (item, index) => {
                  return (
                    <li key={item + index}>
                      <a
                        onClick={() => {
                          document
                            .getElementById("sheet")
                            ?.removeAttribute("open");
                          setOrder((prev) => {
                            return { ...prev, cakeSheet: item };
                          });
                        }}
                        className="text-xs active:!bg-secondary"
                      >
                        {item}
                      </a>
                    </li>
                  );
                })}
              </ul> */}
              {/* 
도시락/미니 초코시트 1000
1호 초코시트 2000
2호 초코시트 3000
*/}
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow">
                {map(sheetArr, (item, index) => {
                  return (
                    <li key={item.sheet + index}>
                      <a
                        onClick={() => {
                          document
                            .getElementById("sheet")
                            ?.removeAttribute("open");
                          setOrder((prev) => {
                            return {
                              ...prev,
                              cakeSheet: `${item.sheet}(+${item.price} ~)`,
                            };
                          });
                        }}
                        className="text-xs active:!bg-secondary"
                      >
                        {item.sheet}
                        {item.price !== 0 && (
                          <span className="text-xs text-error">
                            ( +
                            {String(item.price).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            )}
                            {" ~"})
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </details>
          </label>
          <label
            className="flex items-center text-xs input input-bordered"
            style={{
              pointerEvents: !isAgree ? "none" : "initial",
              borderColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/1))"
                : "var(--fallback-bc,oklch(var(--bc)/0.2))",
              backgroundColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))"
                : "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
              color: !isAgree
                ? "var(--fallback-bc,oklch(var(--bc)/0.4))"
                : "inherit",
            }}
          >
            <span className="min-w-20">샌딩크림</span>

            <details
              id="cream"
              className="flex-auto dropdown"
              onClick={() => {
                document.getElementById("sheet")?.removeAttribute("open");
                document.getElementById("size")?.removeAttribute("open");
                document.getElementById("topping")?.removeAttribute("open");
              }}
            >
              <summary
                className="w-full font-normal justify-start pl-0 ml-0 btn text-xs btn-ghost hover:!bg-transparent"
                style={{
                  color: order.cakeInnerCream === "" ? "#aeaeae" : "inherit",
                  opacity: !isAgree ? "0.9" : "1",
                }}
              >
                {order.cakeInnerCream === ""
                  ? "클릭해서 고르기"
                  : order.cakeInnerCream}
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] p-2 shadow">
                {map(creamArr, (item, index) => {
                  return (
                    <li
                      key={item.cream + index}
                      style={{
                        pointerEvents:
                          order.cakeSize.includes("한입") &&
                          item.cream !== "우유생크림"
                            ? "none"
                            : "initial",
                        color:
                          order.cakeSize.includes("한입") &&
                          item.cream !== "우유생크림"
                            ? "#eaeaea"
                            : "initial",
                      }}
                    >
                      <a
                        onClick={() => {
                          document
                            .getElementById("cream")
                            ?.removeAttribute("open");
                          setOrder((prev) => {
                            return {
                              ...prev,
                              cakeInnerCream: `${item.cream}(+${item.price} ~)`,
                            };
                          });
                        }}
                        className="text-xs active:!bg-secondary"
                      >
                        {item.cream}
                        {item.price !== 0 && (
                          <span
                            className="text-xs text-error"
                            style={{
                              color:
                                order.cakeSize.includes("한입") &&
                                item.cream !== "우유생크림"
                                  ? "#eaeaea"
                                  : "initial",
                            }}
                          >
                            ( +
                            {String(item.price).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            )}
                            {" ~"})
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </details>
          </label>

          <label
            className="flex items-center text-xs input input-bordered"
            style={{
              pointerEvents: !isAgree ? "none" : "initial",
              borderColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/1))"
                : "var(--fallback-bc,oklch(var(--bc)/0.2))",
              backgroundColor: !isAgree
                ? "var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)))"
                : "var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)))",
              color: !isAgree
                ? "var(--fallback-bc,oklch(var(--bc)/0.4))"
                : "inherit",
            }}
          >
            <span className="min-w-20">토핑</span>

            <details
              id="topping"
              className="flex-auto dropdown"
              onClick={() => {
                document.getElementById("sheet")?.removeAttribute("open");
                document.getElementById("size")?.removeAttribute("open");
                document.getElementById("cream")?.removeAttribute("open");
              }}
            >
              <summary
                className="w-full font-normal justify-start pl-0 ml-0 btn text-xs btn-ghost hover:!bg-transparent"
                style={{
                  color: order.cakeTopping === "" ? "#aeaeae" : "inherit",
                  opacity: !isAgree ? "0.9" : "1",
                }}
              >
                {order.cakeTopping === ""
                  ? "클릭해서 고르기"
                  : order.cakeTopping}
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                {map(toppingArr, (item, index) => {
                  return (
                    <li
                      key={item.topping + index}
                      style={{
                        pointerEvents:
                          order.cakeSize.includes("한입") &&
                          !item.topping.includes("없음")
                            ? "none"
                            : "initial",
                        color:
                          order.cakeSize.includes("한입") &&
                          !item.topping.includes("없음")
                            ? "#eaeaea"
                            : "initial",
                      }}
                    >
                      <a
                        onClick={() => {
                          document
                            .getElementById("topping")
                            ?.removeAttribute("open");
                          setOrder((prev) => {
                            return {
                              ...prev,
                              cakeTopping: `${item.topping}(+${item.price} ~)`,
                            };
                          });
                        }}
                        className="text-xs active:!bg-secondary"
                      >
                        {item.topping}
                        {item.price !== 0 && (
                          <span className="text-xs text-error">
                            ( +
                            {String(item.price).replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ","
                            )}
                            {" ~"})
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </details>
          </label>

          <label className=" form-control">
            <div className="mb-2 text-xs text-center break-keep">
              타업체 디자인, 타업체 글씨체, 컬러등 동일하게 나오지 않습니다.
              <br />
              최대한 참고해서&nbsp;
              <span className="underline underline-offset-4 text-error">
                사랑방 스타일
              </span>
              &nbsp;로 제작되어요!
            </div>
            {/* 
            <label className="justify-center gap-2 cursor-pointer label">
              <span className="text-xs label-text text-error">확인</span>
              <input
                type="checkbox"
                checked={isAgree}
                className="checkbox [--chkbg:oklch(var(--er))] [--chkfg:oklch(var(--b1))]"
                // onChange={() => setIsAgree((prev) => !prev)}
              />
            </label> */}
            {/* <div className=" label">
              <span className="text-xs label-text">디자인 설명</span>
            </div> */}
            <textarea
              disabled={!isAgree}
              className="h-32 p-4 mt-2 text-xs resize-none textarea textarea-bordered focus:outline-secondary "
              placeholder={`디자인 설명 자세히 부탁드려요!\n
레터링이시면 레터링 문구!\n`}
              value={order.detail || ""}
              onChange={(e) => {
                setOrder((prev) => {
                  return { ...prev, detail: e.target.value };
                });
              }}
            ></textarea>
            {/* <div className="label">
            <span className="label-text-alt">Your bio</span>
            <span className="label-text-alt">Alt label</span>
          </div> */}
          </label>
          <label className="flex items-center text-xs input input-bordered">
            <span className="min-w-20">유입 경로</span>

            <input
              disabled={!isAgree}
              type="text"
              className="grow"
              placeholder="인스타,네이버,소개,방문 ···"
              value={order.way || ""}
              onChange={(e) =>
                setOrder((prev) => {
                  return { ...prev, way: e.target.value };
                })
              }
            />
          </label>

          <div className="mt-2 text-xs text-center">
            사진첨부는 복사한 주문서와 함께
            <br />
            <span className="underline underline-offset-4 text-error">
              채널 대화방
            </span>
            &nbsp;에서 전송해주세요!
          </div>

          <div className="flex w-full mt-2">
            <button
              type="button"
              disabled={
                order.name === "" ||
                order.phone === "" ||
                order.pickupDate === "" ||
                order.pickupTime === "" ||
                order.cakeSize === "" ||
                order.cakeSheet === "" ||
                order.cakeInnerCream === "" ||
                order.cakeTopping === "" ||
                order.way === "" ||
                order.detail === "" ||
                !isAgree
              }
              className="w-full !rounded-md btn btn-square btn-secondary disabled:bg-red-50"
              onClick={() => {
                window.navigator.clipboard
                  .writeText(
                    `\n\n<사랑방 제작케이크 주문서>\n0. 모든메뉴글 및 주의사항 동의 : o\n1. 성함 : ${
                      order.name
                    }\n2. 연락처 : ${order.phone}\n3. 픽업희망일 : ${
                      useDateTimes(order.pickupDate).month
                    }월 ${useDateTimes(order.pickupDate).date}일 ${
                      useDateTimes(order.pickupDate).dayStr
                    } ${order.pickupTime}\n4. 케이크 사이즈 : ${
                      order.cakeSize
                    }\n5. 케이크빵(메뉴보시고 필수작성) : ${
                      order.cakeSheet
                    }\n6. 속크림(메뉴보시고 필수작성) : ${
                      order.cakeInnerCream
                    }\n7. 속크림 토핑(선택) : ${
                      order.cakeTopping
                    }\n8. 디자인 설명 : ${order.detail}\n9. 알게된 경로 : ${
                      order.way
                    }\n10. 보냉백은 필요시 매장구매\n\n`
                  )
                  .then(() => {
                    alert("주문서가 복사되었습니다.");
                  });
              }}
            >
              주문서 복사하기
            </button>
          </div>
        </div>
        {(timepicker || calender) && (
          <div
            className="w-full h-full fixed z-[8888] left-0 top-0"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          ></div>
        )}
        <Analytics />
      </main>
    </div>
  );
}

export default App;
