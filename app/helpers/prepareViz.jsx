import { Array1D, NDArrayMathGPU } from "deeplearn";

// Group alpha percent of lowest categories
export function groupLowestCategories(data, alpha = 0.05) {
    if (data !== null && data.length > 1) {
        const math = new NDArrayMathGPU();
        const sortdata = data.sort((a, b) => { return a.value - b.value });
        const tensor = Array1D.new(sortdata.map(e => e.value));
        let total = 0
        math.scope(() => {
            total = math.sum(tensor).getValues()[0];
        });
    
        var output = []
        sortdata.reduce((a, b) => {
            if ( a + b.value > total * alpha ) {
                b.id = b.id
            } else {
                b.id = "Other categories"
            }
            output.push(b)
            return a + b.value
        }, 0)

        return output

        
    }
    else { return null }
    
}