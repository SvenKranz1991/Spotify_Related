import React from "react";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";

// Import VictoryPie

// function getTotalValue(
//     acousticness,
//     danceability,
//     energy,
//     instrumentalness,
//     liveness,
//     speechiness,
//     valence
// ) {
//     return (
//         acousticness +
//         danceability +
//         energy +
//         instrumentalness +
//         liveness +
//         speechiness +
//         valence
//     );
// }
//
// function getPercent(val, total) {
//     return (val / total) * 100;
// }

export default function BarChartFeature(props) {
    console.log("VictoryBar: ", VictoryBar);
    console.log("my props: ", props);

    // let total = getTotalValue(
    //     props.acousticness,
    //     props.danceability,
    //     props.energy,
    //     props.instrumentalness,
    //     props.liveness,
    //     props.speechiness,
    //     props.valence
    // );
    //
    // console.log("My Total: ", total);
    //
    // console.log("Acousticness", getPercent(props.acousticness, total), " %");
    // console.log("Danceability", getPercent(props.danceability, total), " %");
    // console.log("Energy", getPercent(props.energy, total), " %");
    // console.log(
    //     "Instrumentalness",
    //     getPercent(props.instrumentalness, total),
    //     " %"
    // );
    // console.log("Liveness", getPercent(props.liveness, total), " %");
    // console.log("Speechiness", getPercent(props.speechiness, total), " %");
    // console.log("Valence", getPercent(props.valence, total), " %");
    //
    // console.log(
    //     getPercent(props.acousticness, total) +
    //         getPercent(props.danceability, total) +
    //         getPercent(props.energy, total) +
    //         getPercent(props.instrumentalness, total) +
    //         getPercent(props.liveness, total) +
    //         getPercent(props.speechiness, total) +
    //         getPercent(props.valence, total)
    // );
    //
    // const datapie = [
    //     { x: "Acousticness", y: getPercent(props.acousticness, total) },
    //     { x: "Danceability", y: getPercent(props.danceability, total) },
    //     { x: "Energy", y: getPercent(props.energy, total) },
    //     { x: "Instrumentalness", y: getPercent(props.instrumentalness, total) },
    //     { x: "Liveness", y: getPercent(props.liveness, total) },
    //     { x: "Speechiness", y: getPercent(props.speechiness, total) },
    //     { x: "Valence", y: getPercent(props.valence, total) }
    // ];

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
            <h3>Analysis by Spotify</h3>
            <VictoryChart
                domainPadding={10}
                theme={VictoryTheme.material}
                style={{ parent: { maxWidth: "40%" } }}
            >
                <VictoryAxis
                    tickValues={[1, 2, 3, 4, 5, 6, 7]}
                    tickFormat={["1", "2", "3", "4", "5", "6", "7"]}
                />
                <VictoryAxis dependentAxis tickFormat={x => `${x * 10}`} />
                <VictoryBar
                    fixLabelOverlap={true}
                    data={data}
                    alignment="middle"
                    style={{ data: { fill: "#f012be" } }}
                    // data accessor for x values
                    x="quarter"
                    // data accessor for y values
                    y="value"
                />
            </VictoryChart>
            <p className="smallFontSize">
                1 = Acousticness, 2 = Danceability, 3 = Energy, 4 =
                Instrumentalness, 5 = Liveness, 6 = Speechiness, 7 = Happiness
            </p>
        </div>
    );
}

// <VictoryPie
//     data={[
//         { x: "Cats", y: 35 },
//         { x: "Dogs", y: 40 },
//         { x: "Birds", y: 55 }
//     ]}
//     animate={{
//         duration: 2000
//     }}
// />
