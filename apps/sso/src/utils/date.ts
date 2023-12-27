/**
 * 格式化时间
 * @param {string} inputPattern 时间格式,默认为'yyyy-MM-dd hh:mm:ss'
 * @param {any} inputDate 输入时间,默认为当前
 * @return {string} 格式化的时间
 */
export const formatDate = (
  inputPattern: string = 'yyyy-MM-dd hh:mm:ss',
  inputDate: any = undefined
) => {
  const date =
    new Date(inputDate as string).toString() === 'Invalid Date'
      ? new Date()
      : new Date(inputDate as string);
  let pattern = inputPattern;
  const y = date.getFullYear().toString();
  const o = {
    M: date.getMonth() + 1, // month
    d: date.getDate(), // day
    h: date.getHours(), // hour
    m: date.getMinutes(), // minute
    s: date.getSeconds() // second
  };
  pattern = pattern.replace(/(y+)/gi, (a, b) =>
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    y.substr(4 - Math.min(4, b.length))
  );
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  for (const i in o) {
    // @ts-ignore
    pattern = pattern.replace(new RegExp(`(${i}+)`, 'g'), (a, b) =>
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      // @ts-ignore
      o[i] < 10 && b.length > 1 ? `0${o[i]}` : o[i]
    );
  }
  return pattern;
};
