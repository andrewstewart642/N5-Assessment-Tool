export type PaperSittingTimeParts = {
  hour24:
    number;

  minute:
    number;
};


export function parsePaperSittingTime(
  value:
    string
): PaperSittingTimeParts | null {
  const trimmed =
    value.trim();

  if (
    !trimmed
  ) {
    return null;
  }


  /*
   * Modern 24-hour format.
   */

  const twentyFourHourMatch =
    trimmed.match(
      /^(\d{1,2}):(\d{2})$/
    );

  if (
    twentyFourHourMatch
  ) {
    const hour24 =
      Number(
        twentyFourHourMatch[
          1
        ]
      );

    const minute =
      Number(
        twentyFourHourMatch[
          2
        ]
      );

    if (
      hour24 >= 0 &&
      hour24 <= 23 &&
      minute >= 0 &&
      minute <= 59
    ) {
      return {
        hour24,
        minute,
      };
    }

    return null;
  }


  /*
   * Historical 12-hour format.
   */

  const twelveHourMatch =
    trimmed.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

  if (
    !twelveHourMatch
  ) {
    return null;
  }

  let hour =
    Number(
      twelveHourMatch[
        1
      ]
    );

  const minute =
    Number(
      twelveHourMatch[
        2
      ]
    );

  const meridiem =
    twelveHourMatch[
      3
    ].toUpperCase();

  if (
    hour < 1 ||
    hour > 12 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  if (
    meridiem ===
      "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  if (
    meridiem ===
      "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  return {
    hour24:
      hour,

    minute,
  };
}


export function formatPaperSittingTime({
  hour24,
  minute,
}: PaperSittingTimeParts): string {
  return `${String(
    hour24
  ).padStart(
    2,
    "0"
  )}:${String(
    minute
  ).padStart(
    2,
    "0"
  )}`;
}


export function getPaperSittingTimeDraft(
  value:
    string
): {
  hour:
    string;

  minute:
    string;
} {
  const parsed =
    parsePaperSittingTime(
      value
    );

  if (
    !parsed
  ) {
    return {
      hour:
        "",

      minute:
        "",
    };
  }

  return {
    hour:
      String(
        parsed.hour24
      ).padStart(
        2,
        "0"
      ),

    minute:
      String(
        parsed.minute
      ).padStart(
        2,
        "0"
      ),
  };
}


export function isValidPaperSittingTimeDraft({
  hour,
  minute,
}: {
  hour:
    string;

  minute:
    string;
}): boolean {
  if (
    !/^\d{1,2}$/.test(
      hour
    ) ||
    !/^\d{1,2}$/.test(
      minute
    )
  ) {
    return false;
  }

  const parsedHour =
    Number(
      hour
    );

  const parsedMinute =
    Number(
      minute
    );

  return (
    parsedHour >= 0 &&
    parsedHour <= 23 &&
    parsedMinute >= 0 &&
    parsedMinute <= 59
  );
}


export function formatPaperSittingTimeDraft({
  hour,
  minute,
}: {
  hour:
    string;

  minute:
    string;
}): string | null {
  if (
    !isValidPaperSittingTimeDraft({
      hour,
      minute,
    })
  ) {
    return null;
  }

  return formatPaperSittingTime({
    hour24:
      Number(
        hour
      ),

    minute:
      Number(
        minute
      ),
  });
}


export function getClockHour12(
  hour24:
    number
): number {
  const hour12 =
    hour24 %
    12;

  return hour12 ===
    0
    ? 12
    : hour12;
}


export function getClockMeridiem(
  hour24:
    number
): "AM" | "PM" {
  return hour24 >= 12
    ? "PM"
    : "AM";
}


export function buildHour24FromClock({
  hour12,
  meridiem,
}: {
  hour12:
    number;

  meridiem:
    "AM" | "PM";
}): number {
  let hour =
    hour12 %
    12;

  if (
    meridiem ===
    "PM"
  ) {
    hour += 12;
  }

  return hour;
}