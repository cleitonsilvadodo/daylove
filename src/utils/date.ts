export function formatDate(date: string, mode: string = "padrao"): string {
  if (!date) return "";

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  switch (mode) {
    case "padrao":
      return `${day} de ${months[month]} de ${year}`;
    case "classico":
      return `${day.toString().padStart(2, "0")}.${(month + 1)
        .toString()
        .padStart(2, "0")}.${year}`;
    case "simples":
      return `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    default:
      return `${day} de ${months[month]} de ${year}`;
  }
}

export function calculateTimeElapsed(startDate: string) {
  if (!startDate) return null;

  const start = new Date(startDate);
  const now = new Date();

  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = Math.floor((diffDays % 365) % 30);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
  };
}
