// stats.js

/**
 * Calculates the mean of a dataset.
 * @param {number[]} data - An array of numbers.
 * @returns {number} The mean value.
 */
function calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

/**
 * Calculates the median of a dataset.
 * @param {number[]} data - An array of numbers.
 * @returns {number} The median value.
 */
function calculateMedian(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

/**
 * Calculates the mode of a dataset.
 * @param {number[]} data - An array of numbers.
 * @returns {number[]} An array of mode(s).
 */
function calculateMode(data) {
    const frequency = {};
    data.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });

    const maxFrequency = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
        .filter(key => frequency[key] === maxFrequency)
        .map(Number);
}

/**
 * Calculates the range of a dataset.
 * @param {number[]} data - An array of numbers.
 * @returns {number} The range value.
 */
function calculateRange(data) {
    return Math.max(...data) - Math.min(...data);
}

/**
 * Calculates the variance of a dataset.
 * @param {number[]} data - An array of numbers.
 * @returns {number} The variance value.
 */
function calculateVariance(data) {
    const mean = calculateMean(data);
    return data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
}

/**
 * Calculates the standard deviation of a dataset.
 * @param {number[]} data - An array of numbers.
 * @returns {number} The standard deviation value.
 */
function calculateStandardDeviation(data) {
    return Math.sqrt(calculateVariance(data));
}

/**
 * Calculates the Interquartile Range (IQR)
 */
function calculateIQR(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = calculatePercentile(sorted, 25);
    const q3 = calculatePercentile(sorted, 75);
    return q3 - q1;
}

/**
 * Calculates percentile
 */
function calculatePercentile(data, p) {
    const sorted = [...data].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Performs Chi-square goodness of fit test
 */
function goodnessOfFit(observed, expected) {
    return observed.reduce((chi, obs, i) => {
        const exp = expected[i];
        return chi + Math.pow(obs - exp, 2) / exp;
    }, 0);
}

/**
 * Calculates linear regression
 */
function calculateLinearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
}

/**
 * Calculates correlation coefficient
 */
function calculateCorrelation(x, y) {
    const meanX = calculateMean(x);
    const meanY = calculateMean(y);
    const n = x.length;
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;
    
    for (let i = 0; i < n; i++) {
        numerator += (x[i] - meanX) * (y[i] - meanY);
        denomX += Math.pow(x[i] - meanX, 2);
        denomY += Math.pow(y[i] - meanY, 2);
    }
    
    return numerator / Math.sqrt(denomX * denomY);
}

/**
 * Calculates the skewness of a dataset
 * @param {number[]} data - Array of numbers
 * @returns {Object} Skewness value and interpretation
 */
function calculateSkewness(data) {
    const mean = calculateMean(data);
    const stdDev = calculateStandardDeviation(data);
    const n = data.length;
    
    const skewness = data.reduce((acc, val) => 
        acc + Math.pow((val - mean) / stdDev, 3), 0) * (n / ((n-1) * (n-2)));

    let interpretation;
    if (skewness > 0.5) {
        interpretation = "Positively skewed (right-tailed)";
    } else if (skewness < -0.5) {
        interpretation = "Negatively skewed (left-tailed)";
    } else {
        interpretation = "Approximately symmetric";
    }

    return { value: skewness, interpretation };
}

/**
 * Calculates predicted Y value using regression line
 * @param {number} x - X value to predict Y for
 * @param {number[]} xData - Array of X values
 * @param {number[]} yData - Array of Y values
 * @returns {number} Predicted Y value
 */
function predictUsingRegression(x, xData, yData) {
    const regression = calculateLinearRegression(xData, yData);
    return regression.slope * x + regression.intercept;
}

/**
 * Calculates one-way ANOVA
 * @param {Array<Array<number>>} groups - Array of arrays containing data for each group
 * @returns {Object} ANOVA results including F-statistic, p-value, and sum of squares
 */
function calculateANOVA(groups) {
    // Calculate overall mean
    const allValues = groups.flat();
    const grandMean = calculateMean(allValues);
    const totalN = allValues.length;
    
    // Calculate group means
    const groupMeans = groups.map(group => calculateMean(group));
    
    // Calculate Sum of Squares
    const SSB = groups.reduce((sum, group, i) => 
        sum + group.length * Math.pow(groupMeans[i] - grandMean, 2), 0);
    
    const SSW = groups.reduce((sum, group, i) => 
        sum + group.reduce((innerSum, value) => 
            innerSum + Math.pow(value - groupMeans[i], 2), 0), 0);
    
    const SST = SSB + SSW;
    
    // Calculate degrees of freedom
    const dfB = groups.length - 1;
    const dfW = totalN - groups.length;
    const dfT = totalN - 1;
    
    // Calculate Mean Squares
    const MSB = SSB / dfB;
    const MSW = SSW / dfW;
    
    // Calculate F-statistic
    const fStat = MSB / MSW;
    
    // Calculate p-value (approximate using F-distribution)
    const pValue = 1 - calculateFProbability(fStat, dfB, dfW);
    
    return {
        fStatistic: fStat,
        pValue: pValue,
        betweenSS: SSB,
        withinSS: SSW,
        totalSS: SST,
        dfBetween: dfB,
        dfWithin: dfW,
        dfTotal: dfT,
        MSBetween: MSB,
        MSWithin: MSW
    };
}

/**
 * Approximates F-distribution probability (simplified)
 * @param {number} F - F statistic
 * @param {number} df1 - Degrees of freedom 1
 * @param {number} df2 - Degrees of freedom 2
 * @returns {number} Probability
 */
function calculateFProbability(F, df1, df2) {
    // This is a simplified approximation
    const x = df1 * F / (df1 * F + df2);
    return betaIncomplete(df1/2, df2/2, x);
}

/**
 * Beta incomplete function approximation
 * @param {number} a - First parameter
 * @param {number} b - Second parameter
 * @param {number} x - X value
 * @returns {number} Beta incomplete value
 */
function betaIncomplete(a, b, x) {
    // Simplified approximation using series expansion
    let sum = 0;
    const maxTerms = 100;
    for(let i = 0; i < maxTerms; i++) {
        sum += Math.pow(x, i) / (i + a);
    }
    return Math.pow(x, a) * sum;
}

/**
 * Calculates Chi-Square test for independence
 * @param {Array<Array<number>>} contingencyTable - Observed frequencies
 * @returns {Object} Chi-square test results
 */
function calculateChiSquareTest(contingencyTable) {
    const rowSums = contingencyTable.map(row => 
        row.reduce((sum, cell) => sum + cell, 0)
    );
    
    const colSums = contingencyTable[0].map((_, colIndex) =>
        contingencyTable.reduce((sum, row) => sum + row[colIndex], 0)
    );
    
    const total = rowSums.reduce((sum, val) => sum + val, 0);
    
    // Calculate expected frequencies
    const expected = [];
    let chiSquare = 0;
    let degreesOfFreedom = (rowSums.length - 1) * (colSums.length - 1);
    
    for (let i = 0; i < contingencyTable.length; i++) {
        expected[i] = [];
        for (let j = 0; j < contingencyTable[0].length; j++) {
            expected[i][j] = (rowSums[i] * colSums[j]) / total;
            chiSquare += Math.pow(contingencyTable[i][j] - expected[i][j], 2) / expected[i][j];
        }
    }
    
    // Calculate p-value using chi-square distribution approximation
    const pValue = calculateChiSquarePValue(chiSquare, degreesOfFreedom);
    
    return {
        chiSquare,
        degreesOfFreedom,
        pValue,
        expected,
        isSignificant: pValue < 0.05
    };
}

/**
 * Calculates p-value for Chi-square distribution
 * @param {number} chiSquare - Chi-square statistic
 * @param {number} df - Degrees of freedom
 * @returns {number} p-value
 */
function calculateChiSquarePValue(chiSquare, df) {
    // Using Wilson-Hilferty approximation
    const z = Math.pow(chiSquare / df, 1/3) - (1 - 2/(9*df)) / Math.sqrt(2/(9*df));
    return 1 - calculateNormalCDF(z);
}

/**
 * Calculates standard normal cumulative distribution function
 * @param {number} z - Z-score
 * @returns {number} Probability
 */
function calculateNormalCDF(z) {
    // Using approximation formula
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - prob : prob;
}

/**
 * Performs z-test for one sample
 * @param {number[]} sample - Sample data
 * @param {number} populationMean - Hypothesized population mean
 * @param {number} populationSD - Known population standard deviation
 * @returns {Object} Test results
 */
function performZTest(sample, populationMean, populationSD) {
    const sampleMean = calculateMean(sample);
    const n = sample.length;
    const standardError = populationSD / Math.sqrt(n);
    const zScore = (sampleMean - populationMean) / standardError;
    const pValue = 2 * (1 - calculateNormalCDF(Math.abs(zScore)));

    return {
        zScore,
        pValue,
        sampleMean,
        standardError,
        isSignificant: pValue < 0.05
    };
}

/**
 * Performs t-test for one sample
 * @param {number[]} sample - Sample data
 * @param {number} hypothesizedMean - Hypothesized population mean
 * @returns {Object} Test results
 */
function performTTest(sample, hypothesizedMean) {
    const sampleMean = calculateMean(sample);
    const sampleSD = calculateStandardDeviation(sample);
    const n = sample.length;
    const standardError = sampleSD / Math.sqrt(n);
    const tScore = (sampleMean - hypothesizedMean) / standardError;
    const df = n - 1;
    const pValue = 2 * (1 - calculateTCDF(Math.abs(tScore), df));

    return {
        tScore,
        pValue,
        degreesOfFreedom: df,
        sampleMean,
        standardError,
        isSignificant: pValue < 0.05
    };
}

/**
 * Calculates Student's t-distribution CDF
 * @param {number} t - t-score
 * @param {number} df - degrees of freedom
 * @returns {number} probability
 */
function calculateTCDF(t, df) {
    // Using approximation for t-distribution
    const x = df / (df + t * t);
    return 1 - 0.5 * betaIncomplete(df/2, 0.5, x);
}

/**
 * Calculates confidence interval for a mean
 * @param {number[]} data - Sample data
 * @param {number} confidenceLevel - Confidence level (e.g., 0.95 for 95%)
 * @returns {Object} Confidence interval bounds
 */
function calculateConfidenceInterval(data, confidenceLevel = 0.95) {
    const n = data.length;
    const mean = calculateMean(data);
    const stdError = calculateStandardDeviation(data) / Math.sqrt(n);
    const zScore = calculateZScore(1 - (1 - confidenceLevel) / 2);
    
    return {
        lower: mean - zScore * stdError,
        upper: mean + zScore * stdError,
        mean: mean,
        marginOfError: zScore * stdError
    };
}

/**
 * Calculates sample size needed for a given margin of error
 * @param {number} marginOfError - Desired margin of error
 * @param {number} confidenceLevel - Confidence level (e.g., 0.95)
 * @param {number} stdDev - Population standard deviation (estimated)
 * @returns {number} Required sample size
 */
function calculateRequiredSampleSize(marginOfError, confidenceLevel, stdDev) {
    const zScore = calculateZScore(1 - (1 - confidenceLevel) / 2);
    return Math.ceil(Math.pow(zScore * stdDev / marginOfError, 2));
}

/**
 * Calculates probability using normal distribution
 * @param {number} x - Value to calculate probability for
 * @param {number} mean - Population mean
 * @param {number} stdDev - Population standard deviation
 * @returns {number} Probability
 */
function calculateProbability(x, mean, stdDev) {
    const z = (x - mean) / stdDev;
    return 1 - calculateNormalCDF(z);
}

/**
 * Calculates Z-score for a given probability
 * @param {number} p - Probability
 * @returns {number} Z-score
 */
function calculateZScore(p) {
    // Using approximation formula
    const a = [-0.322232431088, -1, -0.342242088547, -0.0204231210245, -0.0000453642210148];
    const b = [0.099348462606, 0.588581570495, 0.531103462366, 0.10353775285, 0.0038560700634];
    
    const y = Math.sqrt(-2 * Math.log(1 - p));
    let z = (((a[4]*y + a[3])*y + a[2])*y + a[1])*y + a[0];
    z = z / ((((b[4]*y + b[3])*y + b[2])*y + b[1])*y + b[0]);
    
    return z;
}

/**
 * Performs power analysis for hypothesis test
 * @param {number} effectSize - Expected effect size
 * @param {number} sampleSize - Sample size
 * @param {number} alpha - Significance level
 * @returns {number} Statistical power
 */
function calculatePower(effectSize, sampleSize, alpha = 0.05) {
    const ncp = effectSize * Math.sqrt(sampleSize);
    const criticalValue = calculateZScore(1 - alpha);
    return 1 - calculateNormalCDF(criticalValue - ncp);
}

// Export the functions to be used in main.js
export {
    calculateMean,
    calculateMedian,
    calculateMode,
    calculateRange,
    calculateVariance,
    calculateStandardDeviation,
    calculateIQR,
    calculatePercentile,
    goodnessOfFit,
    calculateLinearRegression,  // Make sure this is exported
    calculateCorrelation,      // Make sure this is exported
    calculateSkewness,
    predictUsingRegression,
    calculateANOVA,
    calculateChiSquareTest,
    performZTest,
    performTTest,
    calculateConfidenceInterval,
    calculateRequiredSampleSize,
    calculateProbability,
    calculatePower
};
