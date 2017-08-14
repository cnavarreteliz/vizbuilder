import mondrianClient from "helpers/mondrian";

function setDrilldownDim(dimensions) {
    switch(dimensions) {
        case 'occupation':
            return { output1: 'Occupation', output2: 'Occupation', output3: 'Occupation group' }
        case 'gender':
            return { output1: 'Gender', output2: 'Gender', output3: 'Gender' }
    }
}

export function getData(cubeName, dimension, metric="Salary Sum") {
    
    const prm = mondrianClient
        .cube(cubeName)
        .then(cube => {
            let drilldownOpt = setDrilldownDim(dimension)
            let prmValues = mondrianClient.query(
                cube.query
                    .drilldown("Year", "Year") // Second dimension
                    .drilldown(drilldownOpt.output1, drilldownOpt.output2, drilldownOpt.output3) // Third dimension
                    .measure(metric) // First dimension
                    .cut("[Year].[Year].[Year].&[2016]")
            ).then(res => res.data)
            return Promise.all([cube, prmValues])
        })
        
    
    /*
    const prmAll = Promise.all([prm]).then(values => ({
        data: values
    }));
    */

    return {
        type: "GET_DATA",
        promise: prm
    };
    
}