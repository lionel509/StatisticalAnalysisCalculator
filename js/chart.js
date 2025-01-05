import { 
    calculateMedian, 
    calculatePercentile, 
    calculateLinearRegression, 
    calculateCorrelation 
} from './stats.js';

function generateChart(data, chartType = 'histogram') {
    const ctx = document.getElementById("chart").getContext("2d");
    
    // Destroy previous chart if it exists
    if (window.currentChart) {
        window.currentChart.destroy();
    }

    switch(chartType) {
        case 'histogram':
            window.currentChart = createHistogram(ctx, data);
            break;
        case 'boxplot':
            window.currentChart = createBoxPlot(ctx, data);
            break;
        case 'scatter':
            window.currentChart = createScatterPlot(ctx, data);
            break;
        case 'pie':
            window.currentChart = createPieChart(ctx, data);
            break;
        case 'dotplot':
            window.currentChart = createDotPlot(ctx, data);
            break;
        case 'regression':
            window.currentChart = createRegressionPlot(ctx, data);
            break;
        default:
            window.currentChart = createHistogram(ctx, data);
    }
}

function createHistogram(ctx, data) {
    const binCount = Math.ceil(Math.sqrt(data.length));
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / binCount;

    const bins = Array(binCount).fill(0);
    data.forEach(num => {
        const binIndex = Math.min(
            binCount - 1,
            Math.floor((num - min) / binWidth)
        );
        bins[binIndex]++;
    });

    const binLabels = bins.map((_, i) => {
        const start = (min + i * binWidth).toFixed(2);
        const end = (min + (i + 1) * binWidth).toFixed(2);
        return `${start} - ${end}`;
    });

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Frequency',
                data: bins,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Frequency' }
                },
                x: {
                    title: { display: true, text: 'Value Ranges' }
                }
            }
        }
    });
}

function createBoxPlot(ctx, data) {
    const sorted = [...data].sort((a, b) => a - b);
    const stats = {
        min: sorted[0],
        q1: calculatePercentile(data, 25),
        median: calculateMedian(data),
        q3: calculatePercentile(data, 75),
        max: sorted[sorted.length - 1]
    };

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Box Plot'],
            datasets: [{
                label: 'Statistics',
                data: [stats.median],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                errorBars: {
                    q1: [stats.q1],
                    q3: [stats.q3],
                    min: [stats.min],
                    max: [stats.max]
                }
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Box Plot' }
            }
        }
    });
}

function createScatterPlot(ctx, data) {
    const points = data.map((value, index) => ({
        x: index,
        y: value
    }));

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Data Points',
                data: points,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Index' } },
                y: { title: { display: true, text: 'Value' } }
            }
        }
    });
}

function createPieChart(ctx, data) {
    // Create frequency distribution for pie chart
    const freqMap = {};
    data.forEach(num => {
        freqMap[num] = (freqMap[num] || 0) + 1;
    });

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(freqMap),
            datasets: [{
                data: Object.values(freqMap),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Value Distribution' }
            }
        }
    });
}

function createDotPlot(ctx, data) {
    const uniqueValues = [...new Set(data.sort((a, b) => a - b))];
    const frequencies = {};
    
    data.forEach(value => {
        frequencies[value] = (frequencies[value] || 0) + 1;
    });

    const maxFreq = Math.max(...Object.values(frequencies));
    const dotData = [];

    uniqueValues.forEach(value => {
        for(let i = 0; i < frequencies[value]; i++) {
            dotData.push({
                x: value,
                y: i + 1
            });
        }
    });

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Dot Plot',
                data: dotData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxFreq + 1,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Values'
                    }
                }
            }
        }
    });
}

function createRegressionPlot(ctx, data) {
    const xValues = Array.from({length: data.length}, (_, i) => i + 1);
    const regression = calculateLinearRegression(xValues, data);
    const regressionLine = xValues.map(x => ({
        x: x,
        y: regression.slope * x + regression.intercept
    }));

    const r2 = Math.pow(calculateCorrelation(xValues, data), 2);

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Data Points',
                    data: xValues.map((x, i) => ({
                        x: x,
                        y: data[i]
                    })),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                },
                {
                    label: 'Regression Line',
                    data: regressionLine,
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `Regression Analysis (R² = ${r2.toFixed(3)})`
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'X Values'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Y Values'
                    }
                }
            }
        }
    });
}

export { generateChart };
