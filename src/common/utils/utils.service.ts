import { convert } from 'html-to-text';

export const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const dbTimeStamp = {
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
};

export function getFormattedDate() {
  const currentdate = new Date();
  const datetime =
    'Last Sync: ' +
    currentdate.getDate() +
    '/' +
    (currentdate.getMonth() + 1) +
    '/' +
    currentdate.getFullYear() +
    ' @ ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds();
  return datetime;
}

export const convertEmailToText = (html: string) => {
  const result = convert(html, {
    wordwrap: 130,
  });
  return result;
};
