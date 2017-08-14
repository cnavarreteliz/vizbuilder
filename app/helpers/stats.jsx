import mondrianClient from "helpers/mondrian";

export function getData(cubeName) {
    
    const prm = mondrianClient
        .cube(cubeName)
        .then(cube => {
            console.log(cube)
            let prmValues = mondrianClient.query(
                cube.query
                    .drilldown("Year", "Year") // Second dimension
                    .drilldown("Occupation", "Occupation", "Occupation group") // Third dimension
                    .measure("Salary Sum") // First dimension
                    .measure("Salary Median")
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