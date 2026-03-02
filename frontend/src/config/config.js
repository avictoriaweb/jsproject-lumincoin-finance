const host = process.env.HOST;
const config = {
    host: host,
    api: host + "/api",
    chartColors: [
        '#DC3545', // Red (Danger)
        '#FD7E14', // Orange
        '#FFC107', // Yellow (Warning)
        '#20C997', // Teal
        '#0D6EFD', // Blue (Primary)
        '#6610F2', // Indigo
        '#6F42C1', // Purple
        '#D63384', // Pink
        '#198754', // Green (Success)
        '#0DCAF0', // Cyan (Info)
        '#ADB5BD', // Gray (Secondary)
        '#212529',  // Dark (Black)
        '#E83E8C', // Berry
        '#FD1D1D', // Bright Red
        '#FF8503', // Amber
        '#94D82D', // Lime
        '#339AF0', // Sky Blue
        '#A55EEA', // Lavender
        '#868E96', // Steel Gray
        '#495057', // Anthracite
        '#B0413E', // Terracotta
        '#4B0082'  // Deep Indigo
],
}

export default config;