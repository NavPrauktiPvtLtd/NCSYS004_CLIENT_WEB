
// import { PageRoutes } from "./@types/index.";




//date formatting

export const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  let mm = String(date.getMonth() + 1);
  let dd = String(date.getDate());

  if (Number(dd) < 10) dd = `0${dd}`;
  if (Number(mm) < 10) mm = `0${mm}`;

  return `${dd}-${mm}-${yyyy}`;
};

//date to age
export function calculateAge(birthDate: Date): number {
  const currentDate = new Date();
  const birthYear = birthDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  let age = currentYear - birthYear;

  const birthMonth = birthDate.getMonth();
  const currentMonth = currentDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentDay = currentDate.getDate();

  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }

  return age;
}

export const sleep = (seconds: number) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const roundedNumber = (number: number | undefined) => {
  if (!number) {
    return null;
  }
  return number.toFixed(2);
};

export const getRandomNumber = (min: number, max: number) => {
  return Number((Math.random() * (max - min) + min).toFixed(1));
};
