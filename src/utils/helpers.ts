export const formatPlate = (plate?: string) => {
    if (!plate) return '';
    return plate.replace(/([A-Za-z])(?=\d)|(\d)(?=[A-Za-z])/g, '$& ');
};
