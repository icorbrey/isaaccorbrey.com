export const getPublishedOnText = (date?: Date) => {
    return !!date
        ? `Published on ${new Date(date).toLocaleDateString("en-US", {
            timeZone: "UTC",
            year: "numeric",
            day: "numeric",
            month: "long",
        })}`
        : "Draft";
}
