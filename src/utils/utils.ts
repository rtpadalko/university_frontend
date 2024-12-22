export const formatDate = (value:string) => {
    if (value) {
        return new Intl.DateTimeFormat("ru",  {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        }).format(Date.parse(value)).replace("в ", "");
    }
}