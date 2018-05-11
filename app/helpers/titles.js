export function getTitle(cube, drilldown, measure) {
    return `${cube} by ${drilldown}, sized by ${measure}`.toUpperCase();
}