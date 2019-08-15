import React from "react";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";

export default function BarChartFeature(props) {
    console.log("VictoryBar: ", VictoryBar);
    console.log("my props: ", props);

    const data = [
        { quarter: "1", value: props.acousticness },
        { quarter: "2", value: props.danceability },
        { quarter: "3", value: props.energy },
        { quarter: "4", value: props.instrumentalness },
        { quarter: "5", value: props.liveness },
        { quarter: "6", value: props.speechiness },
        { quarter: "7", value: props.valence }
    ];

    return (
        <div clssName="Chart">
            <h1>BarChart</h1>
            <VictoryChart domainPadding={30} theme={VictoryTheme.material}>
                <VictoryAxis
                    tickValues={[1, 2, 3, 4, 5, 6, 7]}
                    tickFormat={["1", "2", "3", "4", "5", "6", "7"]}
                />
                <VictoryAxis dependentAxis tickFormat={x => `${x * 10}`} />
                <VictoryBar
                    fixLabelOverlap={true}
                    data={data}
                    alignment="middle"
                    // data accessor for x values
                    x="quarter"
                    // data accessor for y values
                    y="value"
                />
            </VictoryChart>
            <p>
                1 = Acousticness, 2 = Danceability, 3 = Energy, 4 =
                Instrumentalness, 5 = Liveness, 6 = Speechiness, 7 = Positivity
            </p>
        </div>
    );
}
