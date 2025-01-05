// ...existing code...

function generateBoxPlot(data, ctx) {
    const stats = {
        min: Math.min(...data),
        q1: calculatePercentile(data, 25),
        median: calculateMedian(data),
        q3: calculatePercentile(data, 75),
        max: Math.max(...data)
    };

    return new Chart(ctx, {
        type: 'boxplot',
        data: {
            datasets: [{
                label: 'Box Plot',
                data: [stats],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            }]
        }
    });
}

function generatePieChart(data, labels, ctx) {
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ]
            }]
        }
    });
}

function generateScatterPlot(xData, yData, ctx) {
    const regression = calculateLinearRegression(xData, yData);
    const correlation = calculateCorrelation(xData, yData);
    
    const scatterData = xData.map((x, i) => ({x: x, y: yData[i]}));
    const regressionLine = xData.map(x => ({
        x: x,
        y: regression.slope * x + regression.intercept
    }));

    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Data Points',
                data: scatterData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }, {
                label: 'Regression Line',
                data: regressionLine,
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Correlation: ${correlation.toFixed(3)}`
                }
            }
        }
    });
}

export {
    // ...existing exports...
    generateBoxPlot,
    generatePieChart,
    generateScatterPlot
};
