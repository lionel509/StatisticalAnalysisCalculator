# Statistical Analysis Calculator

A comprehensive web-based statistical analysis tool built with HTML, CSS, and JavaScript. This calculator provides a wide range of statistical calculations, visualizations, and hypothesis testing capabilities.

## Features

### Basic Statistics
- Mean (arithmetic average)
- Median (middle value)
- Mode (most frequent value)
- Range (difference between max and min)
- Standard deviation
- Variance
- Interquartile Range (IQR)
- Percentiles
- Skewness analysis with interpretation

### Visualizations
- Histograms
- Box plots
- Scatter plots
- Pie charts
- Dot plots
- Regression plots with R² values

### Advanced Statistical Tests
- Chi-Square Test
  - Independence testing
  - Goodness of fit
  - Expected frequencies calculation
- ANOVA (Analysis of Variance)
  - One-way ANOVA
  - F-statistic calculation
  - Between/within group variance

### Hypothesis Testing
- Z-tests (known population SD)
- T-tests (unknown population SD)
- P-value calculations
- Significance testing

### Regression Analysis
- Linear regression
- Correlation coefficient
- Prediction capabilities
- R² (coefficient of determination)
- Regression equation generation

### Probability Calculations
- Normal distribution probabilities
- Z-score calculations
- Confidence intervals
- Sample size determination
- Margin of error calculations

### Interactive Features
- CSV file upload support
- Manual data entry
- Real-time calculations
- Interactive visualizations
- Animated information cards
- Dropdown test selector

## Technology Stack
- HTML5
- CSS3 (with animations)
- JavaScript (ES6+)
- Chart.js for visualizations
- CSS Grid/Flexbox for layout

## Folder Structure
```plaintext
stat-analysis-calculator/
├── index.html          # Main HTML file
├── css/                # Styling folder
│   ├── styles.css      # Main CSS file
├── js/                 # JavaScript functionality
│   ├── main.js         # Core logic for the application
│   ├── fileParser.js   # CSV file parsing functions
│   ├── stats.js        # Statistical calculations
│   ├── chart.js        # Visualization helpers (e.g., histogram, boxplot)
├── data/               # Sample data files
│   ├── sample.csv      # Example CSV file for testing
├── assets/             # Static assets like images/icons
├── README.md           # Documentation for the project
```

## Installation and Usage

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/stat-analysis-calculator.git
    ```

2. Open `index.html` in your browser.

3. Use the interface to:
    - Upload a CSV file (drag-and-drop supported).
    - Input data manually into the text field.

4. View the statistical analysis in the results section.

## Dependencies
- [PapaParse](https://www.papaparse.com/) for CSV parsing.
- [Chart.js](https://www.chartjs.org/) for data visualization.

## Example CSV Format
```
Value
10
20
30
40
50
```

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---
Happy analyzing! 📊
