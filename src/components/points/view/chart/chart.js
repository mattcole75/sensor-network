import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { TimeSeries, percentile } from 'pondjs';
import { Resizable, ChartContainer, ChartRow, YAxis, Charts, ScatterChart, BandChart, styler, Baseline, Legend, EventMarker } from 'react-timeseries-charts';
// import { Resizable, ChartContainer, ChartRow, YAxis, Charts, ScatterChart, BandChart, LineChart, Baseline, styler } from 'react-timeseries-charts';
import { format } from 'd3-format';
// import { useForm } from 'react-hook-form';

import {
    baselineSRAC,
    baseLineStyleAlert,
    baselineStyle,
    baselineStyleLite,
    timeAxisStyle,
    YAxisStyle
} from './styles';

const Chart = (props) => {

    const { data, name, sracLimit, swingLowerLimit, swingUpperLimit } = props;
    // const { uid, data, name, startDate, endDate, onGetPointSparkData, sracLimit, swingLowerLimit, swingUpperLimit } = props;
    // const [tracker, setTracker] = useState(null);
    const [trackerEvent, setTrackerEvent] = useState(null)
    // const [selection, setSelection] = useState(null);
    const [highlight, setHighlight] = useState(null);
    const [series, setSeries] = useState(null);

    // const { register, getValues } = useForm({
    //     mode: 'onChange',
    //     defaultValues: {
    //         startDate: startDate.format('YYYY-MM-DD'),
    //         startTime: startDate.format('HH:mm'),
    //         endDate: endDate.format('YYYY-MM-DD'),
    //         endTime: endDate.format('HH:mm')
    //     }
    // });

    // const onFilterSet = useCallback(() => {

    //     setSeries(null);

    //     const dates = getValues();

    //     onGetPointSparkData(
    //         uid,
    //         moment(dates.startDate + ' ' + dates.startTime).format('YYYY-MM-DD HH:mm'),
    //         moment(dates.endDate + ' ' + dates.endTime).format('YYYY-MM-DD HH:mm'),
    //         'GET_SENSOR_DATA'
    //     );  
    // }, [getValues, onGetPointSparkData, uid]);

    const loadTimeSeries = useCallback(() => {
        return new Promise((resolve) => {

            let points = [];
            [ ...data ].forEach(obj => {
                points.push([
                    moment(obj.timestamp).valueOf(),
                    obj.swingTime,
                    obj.driveTime,
                    obj.direction
                ]);
            });

            const timeSeries = new TimeSeries ({
                name: 'swings',
                columns: ['time', 'swing', 'drive', 'direction'],
                points
            });
            resolve(timeSeries);
        });
    }, [data]);

    useEffect(() => {
        let timeseries = null
        const load = async () => {
            timeseries = await loadTimeSeries();
        }
        
        load()
        .then(() => {
            setSeries(timeseries);
        });

    }, [loadTimeSeries]);

    const handleMouseNear = (point) => {
        setHighlight(point);
    };

    const bandStyle = styler([{ key: 'swing', color: 'blue', width: 1, opacity: 0.5 }]);
    const legendStyle = styler([
        { key: 'left', color: 'orange', width: 2 },
        { key: 'right', color: 'blue', width: 2 }
    ]);

    const perEventStyle = (column, event) => {
        let colour = 'black';
        const direction = event.toJSON().data.direction;

        if(direction === 'Point Set Right')
            colour = 'blue';
        
        if(direction === 'Point Set Left')
            colour = 'orange';
        
        return {
            normal: {
                fill: colour,
                opacity: 1.0
            },
            highlighted: {
                fill: colour,
                stroke: 'none',
                opacity: 1.0
            },
            selected: {
                fill: 'none',
                stroke: '#2CB1CF',
                strokeWidth: 3,
                opacity: 1.0
            },
            muted: {
                stroke: 'none',
                opacity: 0.6,
                fill: colour
            }
        };
    };

    let infoValues = [];
    const highLight = highlight;
    const formatter = format('');
    let text = `swing: - ms, time: -:--`;

    if (highLight) {
        const swingText = `${formatter(highlight.event.get(highlight.column))} ms`;
        text = `swing: ${swingText}, time: ${highlight.event.timestamp().toLocaleTimeString()}`;
        const direction = highLight.event.get('direction')
        infoValues = [{ label: 'Duration', value: swingText }, { label: 'Direction', value: direction }];
    }

    const trackerHandler = (tracker) => {

        if (tracker) {
            const event = series.atTime(tracker);
            // setTracker(tracker);
            setTrackerEvent(event);
        } else {
            // setTracker(null);
            setTrackerEvent(null);
        }
    }

    return (
        <div>
            {name != null
                ?   <div className='mb-3'>
                        <h1 className='h3 mb-3 fw-normal'>{name}</h1>
                    </div>
                :   null
            }

            {/* Filter Dates */}
            {/* <div className='mb-3'>
                <div className='text-start'>
                    <h4 className='h5 fw-normal'>Filter</h4>
                </div>
                <div className='row g-2'>
                    <div className='form-floating col-sm-3'>
                        <input type='date' className='form-control' id='startDate' autoComplete='off'
                            { ...register('startDate', { onChange: onFilterSet }) } />
                        <label htmlFor='startDate' className='form-label'>Start Date</label>
                    </div>

                    <div className='form-floating col-sm-3'>
                        <input type='time' className='form-control' id='startTime' autoComplete='off'
                            { ...register('startTime', { onChange: onFilterSet }) } />
                        <label htmlFor='startTime' className='form-label'>Start Time</label>
                    </div>

                    <div className='form-floating col-sm-3'>
                        <input type='date' className='form-control' id='endDate' autoComplete='off'
                            { ...register('endDate', { onChange: onFilterSet }) } />
                        <label htmlFor='endDate' className='form-label'>End Date</label>
                    </div>

                    <div className='form-floating col-sm-3'>
                        <input type='time' className='form-control' id='endTime' autoComplete='off'
                            { ...register('endTime', { onChange: onFilterSet }) } />
                        <label htmlFor='endTime' className='form-label'>End Time</label>
                    </div>
                </div>
            </div> */}

            <div className='row'>
                <div className='col-md-12'>{ text }</div>
            </div>

            <hr />

        {series
            ? 
                <div>
                    <div className="row">
                        <div className="col-md-12">
                            <Resizable>
                                <ChartContainer
                                    title='Point Machine Swing Times Live'
                                    titleStyle={{ fill: '#555', fontWeight: 500 }}
                                    timeRange={series.range()}
                                    timeAxisStyle={timeAxisStyle}
                                    format='%d/%m'
                                    // trackerPosition={ tracker }
                                    // trackerStyle={ trackerStyle }
                                    maxTime={ series.range().end() }
                                    minTime={ series.range().begin() }
                                    enablePanZoom={true}
                                    // onBackgroundClick={ () => setSelection({ selection: null }) }
                                    onTrackerChanged={ (tracker) => trackerHandler(tracker) }
                                    // onTrackerChanged={ (tracker) => setTracker(tracker) }
                                >
                                    <ChartRow
                                        height='300'
                                        debug={ false }
                                        // trackerInfoWidth={ 150 }
                                        // trackerInfoHeight={ 40 }
                                        // trackerInfoValues={ infoValues }
                                    >
                                        <YAxis
                                            id='swing'
                                            label='Duration (ms)'
                                            labelOffset={0}
                                            min={series.min('swing')}
                                            max={series.max('swing')}
                                            style={YAxisStyle}
                                            width='70'
                                            type='linear'
                                            format=''
                                        />
                                        <Charts>
                                            <BandChart
                                                axis='swing'
                                                series={ series }
                                                style={ bandStyle }
                                                column='swing'
                                                aggregation={{
                                                    size: '30m',
                                                    reducers: {
                                                        outer: [percentile(5), percentile(95)],
                                                        inner: [percentile(25), percentile(75)]
                                                    }
                                                }}
                                                interpolation='curveBasis'
                                            />
                                            <ScatterChart
                                                axis='swing'
                                                series={series}
                                                columns={ ['swing'] }
                                                style={ perEventStyle }
                                                selected={ [] }
                                                // selected={ selection === null ? [] : selection }
                                                onMouseNear={ (p) => { handleMouseNear(p) } }
                                                highlight={ highlight }
                                                radius={ 3 }
                                            />
                                            <Baseline
                                                axis='swing'
                                                style={ baselineStyleLite }
                                                value={series.max('swing')}
                                                label='Max'
                                                position='right'
                                            />
                                            <Baseline
                                                axis='swing'
                                                style={ baselineStyle }
                                                value={ series.avg('swing') }
                                                label='Avg'
                                                position='right'
                                            />
                                            <Baseline
                                                axis='swing'
                                                style={baselineStyleLite}
                                                value={series.min('swing')}
                                                label='Min'
                                                position='right'
                                            />
                                            <Baseline
                                                axis='swing'
                                                style={ baselineSRAC }
                                                value={ sracLimit }
                                                label='SRAC'
                                                position='right'
                                            />
                                            <Baseline
                                                axis='swing'
                                                style={baseLineStyleAlert}
                                                value={swingUpperLimit}
                                                label='Upper Alarm Limit'
                                                position='right'
                                            />
                                            <Baseline
                                                axis='swing'
                                                style={baseLineStyleAlert}
                                                value={swingLowerLimit}
                                                label='Lower Alarm Limit'
                                                position='right'
                                            />
                                            <EventMarker
                                                type='flag'
                                                axis='swing'
                                                event={ trackerEvent }
                                                column='swing'
                                                info={ infoValues }
                                                infoWidth={ 150 }
                                                infoHeight={ 40 }
                                                markerRadius={ 4 }
                                                markerStyle={{ fill: "black" }}
                                            />
                                        </Charts>
                                    </ChartRow>
                                </ChartContainer>
                            </Resizable>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <span>
                                <Legend
                                    type="dot"
                                    align="right"
                                    style={legendStyle}
                                    categories={[
                                        { key: "left", label: "Swing Left" },
                                        { key: "right", label: "Swing Right" }
                                    ]}
                                />
                            </span>
                        </div>
                    </div>
                </div>
            :   <div></div>
        }
        </div>
    );
}

export default Chart;