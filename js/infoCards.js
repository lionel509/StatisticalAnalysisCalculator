const statisticalInfo = {
    mean: {
        title: "Arithmetic Mean",
        description: "The average of a set of numbers.",
        formula: "μ = Σx / n",
        details: [
            "Sum of all values divided by count",
            "Sensitive to extreme values",
            "Commonly used measure of central tendency"
        ]
    },
    median: {
        title: "Median",
        description: "The middle value when data is ordered.",
        formula: "Middle value or (n+1)/2 th term",
        details: [
            "Not sensitive to outliers",
            "Splits data into equal halves",
            "Better for skewed distributions"
        ]
    },
    'chi-square': {
        title: "Chi-Square Test",
        description: "Tests independence of categorical variables.",
        formula: "χ² = Σ((O-E)²/E)",
        details: [
            "Compares observed vs expected frequencies",
            "Tests goodness of fit",
            "Analyzes contingency tables"
        ]
    },
    anova: {
        title: "ANOVA (Analysis of Variance)",
        description: "Compares means of multiple groups.",
        formula: "F = (Between-group variance)/(Within-group variance)",
        details: [
            "Tests difference between group means",
            "Extends t-test to multiple groups",
            "Uses F-distribution"
        ]
    },
    mode: {
        title: "Mode",
        description: "The most frequently occurring value in a dataset.",
        formula: "Value(s) that appear most often",
        details: [
            "Can have multiple modes (bimodal, multimodal)",
            "Useful for categorical data",
            "May not exist in some datasets"
        ]
    },
    range: {
        title: "Range",
        description: "The difference between the largest and smallest values.",
        formula: "Range = Maximum - Minimum",
        details: [
            "Simple measure of spread",
            "Sensitive to outliers",
            "Used in initial data exploration"
        ]
    },
    stddev: {
        title: "Standard Deviation",
        description: "Measures the average deviation from the mean.",
        formula: "σ = √(Σ(x - μ)² / N)",
        details: [
            "Most common measure of variability",
            "Used in normal distribution",
            "Smaller values indicate data clusters near mean"
        ]
    },
    variance: {
        title: "Variance",
        description: "Average of squared deviations from the mean.",
        formula: "σ² = Σ(x - μ)² / N",
        details: [
            "Square of standard deviation",
            "Always non-negative",
            "Units are squared"
        ]
    },
    iqr: {
        title: "Interquartile Range (IQR)",
        description: "Range between first and third quartiles.",
        formula: "IQR = Q3 - Q1",
        details: [
            "Robust to outliers",
            "Used in box plots",
            "Identifies middle 50% of data"
        ]
    },
    percentile: {
        title: "75th Percentile",
        description: "Value below which 75% of observations fall.",
        formula: "Value at position (n × 0.75)",
        details: [
            "Also known as third quartile (Q3)",
            "Used in IQR calculation",
            "Important for performance metrics"
        ]
    },
    correlation: {
        title: "Correlation",
        description: "Measures linear relationship between variables.",
        formula: "r = Σ((x-μx)(y-μy)) / (σx×σy)",
        details: [
            "Ranges from -1 to +1",
            "+1 indicates perfect positive correlation",
            "-1 indicates perfect negative correlation"
        ]
    },
    skewness: {
        title: "Skewness",
        description: "Measures asymmetry of the distribution.",
        formula: "Σ((x-μ)³)/(N×σ³)",
        details: [
            "Positive: tail extends right",
            "Negative: tail extends left",
            "Zero: symmetric distribution"
        ]
    },
    regression: {
        title: "Regression Equation",
        description: "Linear relationship between variables.",
        formula: "y = mx + b",
        details: [
            "m is the slope (rate of change)",
            "b is the y-intercept",
            "Used for prediction"
        ]
    }
};

export function createInfoIcon() {
    const icon = document.createElement('span');
    icon.className = 'info-icon';
    icon.innerHTML = 'i';
    return icon;
}

export function createInfoCard(type) {
    const info = statisticalInfo[type];
    if (!info) return;

    const card = document.createElement('div');
    card.className = 'info-card';
    card.innerHTML = `
        <div class="info-content">
            <h4>${info.title}</h4>
            <p>${info.description}</p>
            <div class="formula">${info.formula}</div>
            <ul>
                ${info.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        </div>
    `;
    return card;
}

export function initializeInfoCards() {
    document.querySelectorAll('[data-info]').forEach(element => {
        const type = element.dataset.info;
        const icon = createInfoIcon();
        const card = createInfoCard(type);
        
        if (card) {
            element.appendChild(icon);
            element.appendChild(card);

            icon.addEventListener('mouseenter', () => {
                card.classList.add('visible');
                icon.classList.add('pulse');
            });

            icon.addEventListener('mouseleave', () => {
                card.classList.remove('visible');
                icon.classList.remove('pulse');
            });
        }
    });
}
