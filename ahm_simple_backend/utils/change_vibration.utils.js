
export async function calculateVibrationValue(vibration_x, vibration_y, vibration_z, frequency = 50) {
    const magnitude = Math.sqrt(vibration_x ** 2 + vibration_y ** 2 + vibration_z ** 2);
    const result = (magnitude / (2 * Math.PI * frequency)) * 1000;
    return result;
}
// async function singleCalculateVibrationValue(vibration, frequency = 50) {
//     const magnitude = Math.sqrt(vibration ** 2);
//     const result = (magnitude / (2 * Math.PI * frequency)) * 1000;
//     return result;
// }
