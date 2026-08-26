function pad2(
  value: number
): string {
  return value
    .toString()
    .padStart(
      2,
      "0"
    );
}

export function parseAssessmentDateInput(
  input: string
): Date | null {
  const trimmed =
    input.trim();

  if (!trimmed) {
    return null;
  }

  const isoMatch =
    trimmed.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

  if (isoMatch) {
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
  }

  const displayMatch =
    trimmed.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

  if (
    displayMatch
  ) {
    const day =
      Number(
        displayMatch[1]
      );

    const month =
      Number(
        displayMatch[2]
      );

    const year =
      Number(
        displayMatch[3]
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

export function formatAssessmentDisplayDate(
  date: Date
): string {
  return `${pad2(
    date.getDate()
  )}/${pad2(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
}

export function normaliseAssessmentDisplayDate(
  input: string
): string {
  const parsed =
    parseAssessmentDateInput(
      input
    );

  return parsed
    ? formatAssessmentDisplayDate(
        parsed
      )
    : "";
}

export function getTodayAssessmentDisplayDate(): string {
  return formatAssessmentDisplayDate(
    new Date()
  );
}

function getOrdinalDay(
  day: number
): string {
  const mod10 =
    day % 10;

  const mod100 =
    day % 100;

  if (
    mod10 === 1 &&
    mod100 !== 11
  ) {
    return `${day}st`;
  }

  if (
    mod10 === 2 &&
    mod100 !== 12
  ) {
    return `${day}nd`;
  }

  if (
    mod10 === 3 &&
    mod100 !== 13
  ) {
    return `${day}rd`;
  }

  return `${day}th`;
}

export function formatAssessmentCoverDate(
  input: string
): string {
  if (!input) {
    return "";
  }

  const date =
    parseAssessmentDateInput(
      input
    );

  if (!date) {
    return input;
  }

  const weekday =
    date.toLocaleDateString(
      "en-GB",
      {
        weekday:
          "long",
      }
    );

  const month =
    date.toLocaleDateString(
      "en-GB",
      {
        month:
          "long",
      }
    );

  const day =
    getOrdinalDay(
      date.getDate()
    );

  return `${weekday}, ${day} ${month}`;
}

export function buildAssessmentTimeRange(
  startTime: string,
  endTime: string
): string {
  if (
    startTime &&
    endTime
  ) {
    return `${startTime} - ${endTime}`;
  }

  if (startTime) {
    return startTime;
  }

  if (endTime) {
    return endTime;
  }

  return "";
}