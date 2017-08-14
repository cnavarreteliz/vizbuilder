import mondrianClient from "helpers/mondrian";

export function getData(cubeName) {
    
    const prm = mondrianClient
        .cube(cubeName)
        .then(cube =>
            mondrianClient.query(
                cube.query
                    .drilldown("Year", "Year") // Second dimension
                    .drilldown("Occupation", "Occupation", "Occupation group") // Third dimension
                    .measure("Salary Sum") // First dimension
                    .cut("[Year].[Year].[Year].&[2016]")
            ), "jsonrecords"
        )
        .then(res => ({
            axes: res.data.axes,
            values: res.data.values,
            axis_dimensions: res.data.axis_dimensions
          })
        );
    
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