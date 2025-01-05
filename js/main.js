import { parseCSV } from './fileParser.js';
import { 
    calculateMean, 
    calculateMedian, 
    calculateMode, 
    calculateRange, 
    calculateVariance, 
    calculateStandardDeviation,
    calculatePercentile,
    calculateSkewness,
    predictUsingRegression,
    calculateLinearRegression, // Add this import
    calculateCorrelation, // Add this import
    calculateANOVA, // Add this import
    calculateChiSquareTest, // Add this import
    calculateConfidenceInterval,
    calculateRequiredSampleSize,
    calculateProbability,
    calculatePower
} from './stats.js';
import { generateChart } from './chart.js';
import { initializeInfoCards } from './infoCards.js';

document.addEventListener("DOMContentLoaded", () => {
    const csvFileInput = document.getElementById("csv-file");
    const manualInput = document.getElementById("manual-input");
    const analyzeButton = document.getElementById("analyze-button");
    const resetButton = document.getElementById("reset-button");
    const chartTypeSelect = document.getElementById("chart-type");
    const percentileInput = document.getElementById("percentile-value");
    const calculatePercentileBtn = document.getElementById("calculate-percentile");
    const percentileResult = document.getElementById("percentile-calc-result");
    const skewnessResult = document.getElementById("skewness-result").querySelector("span");
    const regressionEquation = document.getElementById("regression-equation").querySelector("span");
    const predictBtn = document.getElementById("predict-btn");
    const xValueInput = document.getElementById("x-value");
    const predictedY = document.getElementById("predicted-y");
    const calculateAnovaBtn = document.getElementById("calculate-anova");
    const anovaInput = document.getElementById("anova-input");
    const calculateChiSquareBtn = document.getElementById("calculate-chi-square");
    const chiSquareInput = document.getElementById("chi-square-input");
    const calculateCIBtn = document.getElementById("calculate-ci");
    const calculateSampleSizeBtn = document.getElementById("calculate-sample-size");
    const calculateProbabilityBtn = document.getElementById("calculate-probability");

    // Results elements
    const meanResult = document.getElementById("mean-result").querySelector("span");
    const medianResult = document.getElementById("median-result").querySelector("span");
    const modeResult = document.getElementById("mode-result").querySelector("span");
    const rangeResult = document.getElementById("range-result").querySelector("span");
    const stddevResult = document.getElementById("stddev-result").querySelector("span");
    const varianceResult = document.getElementById("variance-result").querySelector("span");

    // Test section handling
    const testSelector = document.getElementById("test-selector");
    const testSections = document.querySelectorAll(".test-section");

    function hideAllTestSections() {
        testSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('section-exit');
        });
    }

    function showTestSection(testType) {
        hideAllTestSections();
        const selectedSection = document.querySelector(`[data-test="${testType}"]`);
        if (selectedSection) {
            setTimeout(() => {
                selectedSection.classList.remove('section-exit');
                selectedSection.classList.add('active', 'section-enter');
            }, 100);
        }
    }

    testSelector.addEventListener("change", (e) => {
        const selectedTest = e.target.value;
        if (selectedTest) {
            showTestSection(selectedTest);
        } else {
            hideAllTestSections();
        }
    });

    // Initialize with all sections hidden
    hideAllTestSections();

    // Initialize info cards
    initializeInfoCards();

    analyzeButton.addEventListener("click", () => {
        let data = [];
        console.log("Analyze button clicked");

        // If CSV file is uploaded, parse it
        if (csvFileInput.files.length > 0) {
            const file = csvFileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                data = parseCSV(content);
                processData(data);
            };

            reader.readAsText(file);
        } else if (manualInput.value.trim()) {
            // If manual input is provided, split it into an array
            const inputValue = manualInput.value.trim();
            console.log("Manual input:", inputValue);
            
            data = inputValue.split(",")
                .map(str => str.trim())
                .map(Number)
                .filter(n => !isNaN(n));
            
            console.log("Processed data:", data);
            processData(data);
        } else {
            alert("Please upload a CSV file or input data manually.");
        }
    });

    chartTypeSelect.addEventListener("change", () => {
        if (manualInput.value.trim()) {
            const data = manualInput.value.split(",")
                .map(str => str.trim())
                .map(Number)
                .filter(n => !isNaN(n));
            generateChart(data, chartTypeSelect.value);
        }
    });

    resetButton.addEventListener("click", () => {
        csvFileInput.value = "";
        manualInput.value = "";

        meanResult.textContent = "-";
        medianResult.textContent = "-";
        modeResult.textContent = "-";
        rangeResult.textContent = "-";
        stddevResult.textContent = "-";
        varianceResult.textContent = "-";
    });

    calculatePercentileBtn.addEventListener("click", () => {
        const percentileValue = parseInt(percentileInput.value);
        if (percentileValue < 1 || percentileValue > 100) {
            alert("Please enter a percentile value between 1 and 100");
            return;
        }

        let data = [];
        if (manualInput.value.trim()) {
            data = manualInput.value.split(",")
                .map(str => str.trim())
                .map(Number)
                .filter(n => !isNaN(n));

            if (data.length > 0) {
                const result = calculatePercentile(data, percentileValue);
                percentileResult.textContent = result.toFixed(2);
            } else {
                alert("Please enter valid data first");
            }
        } else {
            alert("Please enter data in the manual input field");
        }
    });

    predictBtn.addEventListener("click", () => {
        const x = parseFloat(xValueInput.value);
        if (!isNaN(x)) {
            const data = manualInput.value.split(",")
                .map(str => str.trim())
                .map(Number)
                .filter(n => !isNaN(n));
            
            if (data.length > 0) {
                const xData = Array.from({length: data.length}, (_, i) => i + 1);
                const predicted = predictUsingRegression(x, xData, data);
                predictedY.textContent = predicted.toFixed(2);
            }
        }
    });

    calculateAnovaBtn.addEventListener("click", () => {
        const groups = anovaInput.value
            .split("\n")
            .map(line => 
                line.split(",")
                    .map(num => parseFloat(num.trim()))
                    .filter(n => !isNaN(n))
            )
            .filter(group => group.length > 0);

        if (groups.length < 2) {
            alert("Please enter at least two groups of data");
            return;
        }

        try {
            const results = calculateANOVA(groups);
            
            document.getElementById("f-stat").textContent = results.fStatistic.toFixed(4);
            document.getElementById("p-value").textContent = results.pValue.toFixed(4);
            document.getElementById("between-ss").textContent = results.betweenSS.toFixed(4);
            document.getElementById("within-ss").textContent = results.withinSS.toFixed(4);
            document.getElementById("total-ss").textContent = results.totalSS.toFixed(4);
            document.getElementById("significance").textContent = 
                results.pValue < 0.05 ? "Significant" : "Not significant";
            
        } catch (error) {
            console.error("Error calculating ANOVA:", error);
            alert("Error calculating ANOVA. Please check your input data.");
        }
    });

    calculateChiSquareBtn.addEventListener("click", () => {
        try {
            // Parse contingency table from input
            const contingencyTable = chiSquareInput.value
                .trim()
                .split("\n")
                .map(row => 
                    row.split(",")
                        .map(cell => parseInt(cell.trim()))
                        .filter(n => !isNaN(n))
                );

            if (!isValidContingencyTable(contingencyTable)) {
                throw new Error("Invalid contingency table format");
            }

            const results = calculateChiSquareTest(contingencyTable);
            
            // Display results
            document.getElementById("chi-square-stat").textContent = results.chiSquare.toFixed(4);
            document.getElementById("chi-square-df").textContent = results.degreesOfFreedom;
            document.getElementById("chi-square-p").textContent = results.pValue.toFixed(4);
            document.getElementById("chi-square-significance").textContent = 
                results.isSignificant ? "Significant" : "Not significant";

            // Display expected frequencies table
            displayExpectedFrequencies(results.expected);

        } catch (error) {
            console.error("Error calculating Chi-square test:", error);
            alert("Error calculating Chi-square test. Please check your input data.");
        }
    });

    calculateCIBtn.addEventListener("click", () => {
        const confidenceLevel = parseFloat(document.getElementById("confidence-level").value);
        const data = getDataFromInput();
        
        if (data.length > 0) {
            const ci = calculateConfidenceInterval(data, confidenceLevel);
            document.getElementById("ci-lower").textContent = ci.lower.toFixed(4);
            document.getElementById("ci-upper").textContent = ci.upper.toFixed(4);
            document.getElementById("ci-margin").textContent = ci.marginOfError.toFixed(4);
        }
    });

    calculateSampleSizeBtn.addEventListener("click", () => {
        const marginError = parseFloat(document.getElementById("margin-error").value);
        const stdDev = parseFloat(document.getElementById("population-stddev").value);
        const confidenceLevel = parseFloat(document.getElementById("confidence-level").value);

        if (!isNaN(marginError) && !isNaN(stdDev)) {
            const n = calculateRequiredSampleSize(marginError, confidenceLevel, stdDev);
            document.getElementById("required-n").textContent = n;
        }
    });

    calculateProbabilityBtn.addEventListener("click", () => {
        const value = parseFloat(document.getElementById("prob-value").value);
        const mean = parseFloat(document.getElementById("prob-mean").value);
        const stddev = parseFloat(document.getElementById("prob-stddev").value);

        if (!isNaN(value) && !isNaN(mean) && !isNaN(stddev)) {
            const prob = calculateProbability(value, mean, stddev);
            document.getElementById("probability-value").textContent = 
                (prob * 100).toFixed(4) + "%";
        }
    });

    function isValidContingencyTable(table) {
        if (!table.length || !table[0].length) return false;
        const width = table[0].length;
        return table.every(row => row.length === width);
    }

    function displayExpectedFrequencies(expected) {
        const tableDiv = document.getElementById("expected-table");
        tableDiv.innerHTML = "";
        
        const table = document.createElement("table");
        expected.forEach(row => {
            const tr = document.createElement("tr");
            row.forEach(cell => {
                const td = document.createElement("td");
                td.textContent = cell.toFixed(2);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        
        tableDiv.appendChild(table);
    }

    function getDataFromInput() {
        return manualInput.value.trim()
            .split(",")
            .map(str => parseFloat(str.trim()))
            .filter(n => !isNaN(n));
    }

    function processData(data) {
        if (data.length === 0) {
            alert("No valid data to process.");
            return;
        }

        console.log("Processing data:", data);
        
        try {
            // Create x values array for regression
            const xData = Array.from({length: data.length}, (_, i) => i + 1);
            
            // Calculate all statistics
            const mean = calculateMean(data);
            const median = calculateMedian(data);
            const mode = calculateMode(data);
            const range = calculateRange(data);
            const stddev = calculateStandardDeviation(data);
            const variance = calculateVariance(data);
            const skewness = calculateSkewness(data);
            const regression = calculateLinearRegression(xData, data);
            const correlation = calculateCorrelation(xData, data);

            console.log("Calculated values:", { 
                mean, median, mode, range, 
                stddev, variance, skewness, 
                regression, correlation 
            });

            // Update results
            meanResult.textContent = mean.toFixed(2);
            medianResult.textContent = median.toFixed(2);
            modeResult.textContent = mode.join(", ") || "None";
            rangeResult.textContent = range.toFixed(2);
            stddevResult.textContent = stddev.toFixed(2);
            varianceResult.textContent = variance.toFixed(2);
            skewnessResult.textContent = `${skewness.value.toFixed(2)} (${skewness.interpretation})`;
            regressionEquation.textContent = `y = ${regression.slope.toFixed(2)}x + ${regression.intercept.toFixed(2)}`;

            // Generate visualizations
            generateChart(data, chartTypeSelect.value);
        } catch (error) {
            console.error("Error processing data:", error);
            alert("Error processing data. Please check the console for details.");
        }
    }
});
