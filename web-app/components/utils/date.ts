export const parseDate = (date?: string) => {
    if(!date) return undefined;
    if(date.length !== 10) return undefined;
    const [day, month, year] = date.includes(".") ? date.split(".") : date.split("/");
    return new Date(Number(year), Number(month) - 1, Number(day));
}