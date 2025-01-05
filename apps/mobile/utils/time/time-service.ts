export const formatSecondsAsTimer = (counter: number) => {
  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor((counter % 3600) / 60);
  const seconds = counter % 60;

  let timeString = '';

  if (hours > 0) {
    timeString += `${hours}:`;
  }
  timeString += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return timeString;
};

export const calculateAge = (birthday: Date): number => {
  const today = new Date();
  const month = today.getMonth() - birthday.getMonth();
  let age = today.getFullYear() - birthday.getFullYear();

  if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }

  return age;
};
