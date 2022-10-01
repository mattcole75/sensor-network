import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { TimeSeries } from 'pondjs';
import { Resizable, ChartContainer, ChartRow, YAxis, Charts, LineChart, Baseline } from 'react-timeseries-charts';

const style = {
    value: {
        stroke: "#a02c2c",
        opacity: 0.2
    }
};

const baselineStyle = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1,
        opacity: 0.4,
        strokeDasharray: "none"
    },
    label: {
        fill: "steelblue"
    }
};

const baselineStyleLite = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1,
        opacity: 0.5
    },
    label: {
        fill: "steelblue"
    }
};

const baselineStyleExtraLite = {
    line: {
        stroke: "steelblue",
        strokeWidth: 1,
        opacity: 0.2,
        strokeDasharray: "1,1"
    },
    label: {
        fill: "steelblue"
    }
};

const Chart = (props) => {

    const { data } = props;

    const [tracker, setTracker] = useState(null);
    const [trackerTempValue, setTrackerTempValue] = useState(0);
    const [trackerTempTime, setTrackerTempTime] = useState(0);
    // const [trackerTempTime, setTrackerTempTime] = useState(new Date().getTime());
    const [series, setSeries] = useState(null);

    // const data = require('../../../../configuration/tempData.json');

    const loadTimeSeries = useCallback(() => {
        return new Promise((resolve) => {

            let points = [];
            [ ...data ].forEach(obj => {
                points.push( [moment(obj.timestamp).valueOf(), obj.value] );
            });

            const timeSeries = new TimeSeries ({
                name: 'Sensor Data',
                columns: ['time', 'value'],
                points: points
            });
            resolve(timeSeries);
        });
    }, [data]);
    

    useEffect(() => {
        let timeseries = null
        const load = async () => {
            timeseries = await loadTimeSeries();
        }
        
        load().then(() => {
            setSeries(timeseries);
        });

    }, [loadTimeSeries]);

    const handleTrackerChanged = (t, scale) => {
        if(t) {
            const e = series.atTime(t);
            setTracker(t);
            setTrackerTempTime(moment(t).format('HH:mm'));
            setTrackerTempValue(e.get('value'));
        } else {
            setTracker(null);
        }
    }

    return (
        <div>
        {series
            ? <Resizable>
                <ChartContainer
                    title="Sensor Data Live"
                    titleStyle={{ fill: "#555", fontWeight: 500 }}
                    timeRange={series.range()}
                    format="%d/%m"
                    timeAxisTickCount={5}
                    trackerPosition={tracker}
                    onTrackerChanged={handleTrackerChanged}
                >
                    <ChartRow 
                        height="150"
                        trackerInfoValues={[
                            { label: 'Temp (°C)', value: String(trackerTempValue) },
                            { label: 'Time', value: String(trackerTempTime) }
                        ]}
                        trackerInfoHeight={50}>
                        <YAxis
                            id="temp"
                            label="Temp (°C)"
                            min={series.min()}
                            max={series.max()}
                            width="60"
                            format=".2f"
                        />
                        <Charts>
                            <LineChart axis="temp" series={series} style={style} />
                                <Baseline
                                    axis="temp"
                                    style={baselineStyleLite}
                                    value={series.max()}
                                    label="Max"
                                    position="right"
                                />
                                <Baseline
                                    axis="temp"
                                    style={baselineStyleLite}
                                    value={series.min()}
                                    label="Min"
                                    position="right"
                                />
                                <Baseline
                                    axis="temp"
                                    style={baselineStyleExtraLite}
                                    value={series.avg() - series.stdev()}
                                />
                                <Baseline
                                    axis="temp"
                                    style={baselineStyleExtraLite}
                                    value={series.avg() + series.stdev()}
                                />
                                <Baseline
                                    axis="temp"
                                    style={baselineStyle}
                                    value={series.avg()}
                                    label="Avg"
                                    position="right"
                                />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </Resizable>
            : <div></div>
        }
        </div>
    );
}

export default Chart;