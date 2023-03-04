import { FC, useEffect, useState } from "react"
import * as dateFns from "date-fns"
interface DateRange {
  startDate: Date | null
  endDate: Date | null
}

interface Props {
  initialRange?: DateRange
  onUpdate?: (dateRange: DateRange) => void
}

const DateRangePicker: FC<Props> = ({ initialRange, onUpdate }) => {
  const [currCalendar, setCurrCalendar] = useState<Array<number | null>>([])
  const [nextCalendar, setNextCalendar] = useState<Array<number | null>>([])
  const [currMonth, setCurrMonth] = useState<number>(new Date().getMonth())
  const [currYear, setCurrYear] = useState<number>(new Date().getFullYear())

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: initialRange?.startDate ?? new Date(),
    endDate: initialRange?.endDate ?? dateFns.add(new Date(), { days: 20 }),
  })

  // Thanks to https://github.com/date-fns/date-fns/issues/366#issuecomment-270408980
  const isBetween = (
    date: Date,
    from: Date,
    to: Date,
    inclusivity: "()" | "[]" | "(]" | "[)" = "()"
  ) => {
    if (!["()", "[]", "(]", "[)"].includes(inclusivity)) {
      throw new Error("Inclusivity parameter must be one of (), [], (], [)")
    }

    const isBeforeEqual = inclusivity[0] === "[",
      isAfterEqual = inclusivity[1] === "]"

    return (
      (isBeforeEqual
        ? dateFns.isEqual(from, date) || dateFns.isBefore(from, date)
        : dateFns.isBefore(from, date)) &&
      (isAfterEqual
        ? dateFns.isEqual(to, date) || dateFns.isAfter(to, date)
        : dateFns.isAfter(to, date))
    )
  }

  const generateCalendar = ({
    month,
    year,
  }: {
    month: number
    year: number
  }) => {
    console.log({ month, year })
    const startOfMonth = dateFns.startOfMonth(new Date(year, month))
    console.log({ startOfMonth })
    const endOfMonth = dateFns.endOfMonth(new Date(year, month))
    const startDay = startOfMonth.getDay()
    const endDay = endOfMonth.getDay()
    const daysInMonth = dateFns.getDaysInMonth(startOfMonth)
    const days = [...Array(daysInMonth).keys()].map((v) => v + 1)
    const calendar = [...Array(42).keys()].map((v) => {
      if (v < startDay) {
        return null
      }
      if (v > daysInMonth + startDay - 1) {
        return null
      }
      return days[v - startDay]
    })
    return calendar
  }

  useEffect(() => {
    console.log(dateRange)
    const _currCalendar = generateCalendar({
      month: new Date(currYear, currMonth).getMonth(),
      year: new Date(currYear, currMonth).getFullYear(),
    })
    setCurrCalendar(_currCalendar)

    const _nextCalendar = generateCalendar({
      month: dateFns
        .add(new Date(currYear, currMonth), { months: 1 })
        .getMonth(),
      year: dateFns
        .add(new Date(currYear, currMonth), { months: 1 })
        .getFullYear(),
    })
    setNextCalendar(_nextCalendar)
  }, [currMonth, currYear])

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      onUpdate?.(dateRange)
    }
  }, [dateRange])

  const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="flex">
      <div className="drop-shadow-sm shadow-sm min-w-[10rem] p-3 rounded-lg border border-r-0 flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="text-lg">
            {dateFns.format(new Date(currYear, currMonth), "MMMM")}{" "}
            {new Date(currYear, currMonth).getFullYear()}
          </h3>
          <div className="flex gap-x-2 items-center">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-300 border drop-shadow-sm"
              onClick={() => {
                const d = dateFns.sub(new Date(currYear, currMonth), {
                  months: 1,
                })
                setCurrMonth(d.getMonth())
                setCurrYear(d.getFullYear())
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-300 border drop-shadow-sm"
              onClick={() => {
                const d = dateFns.add(new Date(currYear, currMonth), {
                  months: 1,
                })
                setCurrMonth(d.getMonth())
                setCurrYear(d.getFullYear())
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 p-3 gap-2 mt-3">
          {days.map((v, i) => (
            <div key={i} className="text-center w-12">
              {v}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 p-3 gap-2">
          {currCalendar.map((v, i) =>
            v ? (
              <button
                type="button"
                key={i}
                className={`rounded-lg border flex w-12 justify-center p-2 hover:bg-blue-600 hover:text-white ${
                  dateFns.isSameDay(
                    new Date(currYear, currMonth, v),
                    dateRange.startDate!
                  )
                    ? // dateRange.startDate?.isSame(
                      //   moment({ day: v, month: currMonth, year: currYear }),
                      //   "day"
                      // )
                      "bg-blue-600 text-white"
                    : ""
                } ${
                  dateFns.isSameDay(
                    new Date(currYear, currMonth, v),
                    new Date()
                  )
                    ? // moment({ day: v, month: currMonth, year: currYear }).isSame(
                      //   moment(),
                      //   "day"
                      // )
                      "ring-blue-400 ring-2"
                    : ""
                } ${
                  dateFns.isSameDay(
                    new Date(currYear, currMonth, v),
                    dateRange.endDate!
                  )
                    ? // dateRange.endDate?.isSame(
                      //   moment({ day: v, month: currMonth, year: currYear }),
                      //   "day"
                      // )
                      "bg-blue-600 text-white"
                    : ""
                } ${
                  isBetween(
                    new Date(currYear, currMonth, v),
                    dateRange.startDate!,
                    dateRange.endDate!,
                    "[]"
                  )
                    ? // moment({
                      //   day: v,
                      //   month: currMonth,
                      //   year: currYear,
                      // }).isBetween(
                      //   dateRange.startDate,
                      //   dateRange.endDate,
                      //   "day",
                      //   "()"
                      // )
                      "bg-blue-200"
                    : ""
                }`}
                onClick={() => {
                  if (!dateRange.startDate) {
                    setDateRange((d) => ({
                      ...d,
                      startDate: new Date(currYear, currMonth, v),
                      // moment({
                      //   day: v,
                      //   month: currMonth,
                      //   year: currYear,
                      // }),
                    }))
                  }
                  if (dateRange.startDate && !dateRange.endDate) {
                    setDateRange((d) => ({
                      ...d,
                      endDate: new Date(currYear, currMonth, v),
                      // moment({
                      //   day: v,
                      //   month: currMonth,
                      //   year: currYear,
                      // }),
                    }))
                  }

                  if (dateRange.startDate && dateRange.endDate) {
                    setDateRange({
                      startDate: new Date(currYear, currMonth, v),
                      // moment({
                      //   day: v,
                      //   month: currMonth,
                      //   year: currYear,
                      // }),
                      endDate: null,
                    })
                  }
                }}
              >
                {v}
              </button>
            ) : (
              <span key={i}></span>
            )
          )}
        </div>
      </div>
      <div className="drop-shadow-sm shadow-sm min-w-[10rem] p-3 rounded-lg border flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="text-lg">
            {dateFns.format(
              dateFns.add(new Date(currYear, currMonth), { months: 1 }),
              "MMMM"
            )}{" "}
            {
              dateFns
                .add(new Date(currYear, currMonth), { years: 1 })
                .getFullYear()
              // moment({ month: currMonth }).add(1, "month").year()
            }
          </h3>
          <div className="flex gap-x-2 items-center">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-300 border drop-shadow-sm"
              onClick={() => {
                const d = dateFns.sub(new Date(currYear, currMonth), {
                  months: 1,
                })
                // moment({ month: currMonth, year: currYear }).subtract(
                //   1,
                //   "month"
                // )
                setCurrMonth(d.getMonth())
                setCurrYear(d.getFullYear())
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-300 border drop-shadow-sm"
              onClick={() => {
                const d = dateFns.add(new Date(currYear, currMonth), {
                  months: 1,
                })
                // moment({ month: currMonth }).add(1, "month")
                setCurrMonth(d.getMonth())
                setCurrYear(d.getFullYear())
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 p-3 gap-2 mt-3">
          {days.map((v, i) => (
            <div key={i} className="text-center w-12">
              {v}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 p-3 gap-2">
          {nextCalendar.map((v, i) =>
            v ? (
              <button
                type="button"
                key={i}
                className={`rounded-lg border flex w-12 justify-center p-2 hover:bg-blue-600 hover:text-white ${
                  dateFns.isSameDay(
                    dateFns.add(new Date(currYear, currMonth, v), {
                      months: 1,
                    }),
                    dateRange.startDate!
                  )
                    ? // dateRange.startDate?.isSame(
                      //   moment({
                      //     day: v,
                      //     month: moment({
                      //       day: v,
                      //       month: currMonth,
                      //       year: currYear,
                      //     })
                      //       .add(1, "month")
                      //       .month(),
                      //     year: moment({ day: v, month: currMonth, year: currYear })
                      //       .add(1, "month")
                      //       .year(),
                      //   }),
                      //   "day"
                      // )
                      "bg-blue-600 text-white"
                    : ""
                } ${
                  dateFns.isSameDay(
                    dateFns.add(new Date(currYear, currMonth, v), {
                      months: 1,
                    }),
                    new Date()
                  )
                    ? // moment({
                      //   day: v,
                      //   month: moment({ day: v, month: currMonth, year: currYear })
                      //     .add(1, "month")
                      //     .month(),
                      //   year: moment({ day: v, month: currMonth, year: currYear })
                      //     .add(1, "month")
                      //     .year(),
                      // }).isSame(moment(), "day")
                      "ring-blue-400 ring-2"
                    : ""
                } ${
                  dateFns.isSameDay(
                    dateFns.add(new Date(currYear, currMonth, v), {
                      months: 1,
                    }),
                    dateRange.endDate!
                  )
                    ? // dateRange.endDate?.isSame(
                      //   moment({
                      //     day: v,
                      //     month: moment({
                      //       day: v,
                      //       month: currMonth,
                      //       year: currYear,
                      //     })
                      //       .add(1, "month")
                      //       .month(),
                      //     year: moment({ day: v, month: currMonth, year: currYear })
                      //       .add(1, "month")
                      //       .year(),
                      //   }),
                      //   "day"
                      // )
                      "bg-blue-600 text-white"
                    : ""
                } ${
                  // isBetween(new Date(currYear, currMonth, v), {}))
                  isBetween(
                    dateFns.add(new Date(currYear, currMonth, v), {
                      months: 1,
                    }),
                    dateRange.startDate!,
                    dateRange.endDate!,
                    "[]"
                  )
                    ? // moment({
                      //   day: v,
                      //   month: moment({ day: v, month: currMonth, year: currYear })
                      //     .add(1, "month")
                      //     .month(),
                      //   year: moment({ day: v, month: currMonth, year: currYear })
                      //     .add(1, "month")
                      //     .year(),
                      // }).isBetween(
                      //   dateRange.startDate,
                      //   dateRange.endDate,
                      //   "day",
                      //   "()"
                      // )
                      "bg-blue-200"
                    : ""
                }`}
                onClick={() => {
                  if (!dateRange.startDate) {
                    setDateRange((d) => ({
                      ...d,
                      startDate: dateFns.add(new Date(currYear, currMonth, v), {
                        months: 1,
                      }),
                    }))

                    //   startDate: moment({
                    //     day: v,
                    //     month: moment({
                    //       day: v,
                    //       month: currMonth,
                    //       year: currYear,
                    //     })
                    //       .add(1, "month")
                    //       .month(),
                    //     year: moment({
                    //       day: v,
                    //       month: currMonth,
                    //       year: currYear,
                    //     })
                    //       .add(1, "month")
                    //       .year(),
                    //   }),
                    // }))
                  }

                  if (dateRange.startDate && !dateRange.endDate) {
                    setDateRange((d) => ({
                      ...d,
                      endDate: dateFns.add(new Date(currYear, currMonth, v), {
                        months: 1,
                      }),

                      // endDate: moment({
                      //   day: v,
                      //   month: moment({
                      //     day: v,
                      //     month: currMonth,
                      //     year: currYear,
                      //   })
                      //     .add(1, "month")
                      //     .month(),
                      //   year: moment({
                      //     day: v,
                      //     month: currMonth,
                      //     year: currYear,
                      //   })
                      //     .add(1, "month")
                      //     .year(),
                      // }),
                    }))
                  }

                  if (dateRange.startDate && dateRange.endDate) {
                    setDateRange({
                      startDate: dateFns.add(new Date(currYear, currMonth, v), {
                        months: 1,
                      }),
                      // moment({
                      //   day: v,
                      //   month: moment({
                      //     day: v,
                      //     month: currMonth,
                      //     year: currYear,
                      //   })
                      //     .add(1, "month")
                      //     .month(),
                      //   year: moment({
                      //     day: v,
                      //     month: currMonth,
                      //     year: currYear,
                      //   })
                      //     .add(1, "month")
                      //     .year(),
                      // }),
                      endDate: null,
                    })
                  }
                }}
              >
                {v}
              </button>
            ) : (
              <span key={i}></span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
