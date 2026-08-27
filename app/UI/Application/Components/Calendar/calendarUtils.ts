export type CalendarCell = {
  date:
    Date;

  inCurrentMonth:
    boolean;
};

export function pad2(
  value: number
): string {
  return value
    .toString()
    .padStart(
      2,
      "0"
    );
}

export function parseDateText(
  text: string
): Date | null {
  const trimmed =
    text.trim();

  if (!trimmed) {
    return null;
  }

  const isoMatch =
    trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (
    isoMatch
  ) {
    const year =
      Number(
        isoMatch[1]
      );

    const month =
      Number(
        isoMatch[2]
      );

    const day =
      Number(
        isoMatch[3]
      );

    const date =
      new Date(
        year,
        month - 1,
        day
      );

    if (
      date.getFullYear() ===
        year &&
      date.getMonth() ===
        month - 1 &&
      date.getDate() ===
        day
    ) {
      return date;
    }

    return null;
  }

  const slashMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

  if (
    slashMatch
  ) {
    const day =
      Number(
        slashMatch[1]
      );

    const month =
      Number(
        slashMatch[2]
      );

    const year =
      Number(
        slashMatch[3]
      );

    const date =
      new Date(
        year,
        month - 1,
        day
      );

    if (
      date.getFullYear() ===
        year &&
      date.getMonth() ===
        month - 1 &&
      date.getDate() ===
        day
    ) {
      return date;
    }
  }

  return null;
}

export function formatDateIso(
  date: Date
): string {
  return `${date.getFullYear()}-${pad2(
    date.getMonth() + 1
  )}-${pad2(
    date.getDate()
  )}`;
}

export function getMonthMatrix(
  viewDate: Date
): CalendarCell[][] {
  const year =
    viewDate.getFullYear();

  const month =
    viewDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const startWeekday =
    (
      firstDay.getDay() +
      6
    ) %
    7;

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const previousMonthDays =
    new Date(
      year,
      month,
      0
    ).getDate();

  const cells:
    CalendarCell[] = [];

  for (
    let index = 0;
    index <
    startWeekday;
    index += 1
  ) {
    const day =
      previousMonthDays -
      startWeekday +
      index +
      1;

    cells.push({
      date:
        new Date(
          year,
          month - 1,
          day
        ),

      inCurrentMonth:
        false,
    });
  }

  for (
    let day = 1;
    day <=
    daysInMonth;
    day += 1
  ) {
    cells.push({
      date:
        new Date(
          year,
          month,
          day
        ),

      inCurrentMonth:
        true,
    });
  }

  while (
    cells.length <
    42
  ) {
    const day =
      cells.length -
      (
        startWeekday +
        daysInMonth
      ) +
      1;

    cells.push({
      date:
        new Date(
          year,
          month + 1,
          day
        ),

      inCurrentMonth:
        false,
    });
  }

  const weeks:
    CalendarCell[][] = [];

  for (
    let index = 0;
    index <
    cells.length;
    index += 7
  ) {
    weeks.push(
      cells.slice(
        index,
        index + 7
      )
    );
  }

  return weeks;
}

export function isSameDate(
  first:
    Date | null,

  second:
    Date | null
): boolean {
  if (
    !first ||
    !second
  ) {
    return false;
  }

  return (
    first.getFullYear() ===
      second.getFullYear() &&
    first.getMonth() ===
      second.getMonth() &&
    first.getDate() ===
      second.getDate()
  );
}