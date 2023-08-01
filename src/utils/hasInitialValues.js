export const hasInitialValues = ({values,validateField}) => {
    for (const key in values) {
        if (Object.hasOwnProperty.call(values, key)) {
            const element = values[key];
            if(element) validateField(key);
            
        }
    }
}