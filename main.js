/**
 * Mobile Usage Predictor - SLR Core Logic
 * Based on Newslr.ipynb: y = 0.85x + 0.2
 */

document.addEventListener('DOMContentLoaded', () => {
    const usageInput = document.getElementById('usage-input');
    const calcBtn = document.getElementById('calc-btn');
    const resultValue = document.getElementById('result-value');
    const ctx = document.getElementById('usageChart').getContext('2d');

    // SLR Parameters
    const β1 = 0.85; // Slope: GB per hour
    const β0 = 0.20; // Intercept: Base GB consumption

    let chart;

    // Initialize Chart
    function initChart() {
        const dataPoints = [];
        for (let x = 0; x <= 24; x += 2) {
            dataPoints.push({ x: x, y: (β1 * x + β0).toFixed(2) });
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Regression Line',
                    data: dataPoints,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    pointRadius: 0,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Current Prediction',
                    data: [],
                    backgroundColor: '#ff6b6b',
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleFont: { family: 'Outfit', size: 14 },
                        bodyFont: { family: 'Outfit', size: 12 },
                        padding: 12,
                        cornerRadius: 12
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Usage Hours', font: { family: 'Outfit', weight: 'bold' } },
                        grid: { display: false },
                        min: 0,
                        max: 24
                    },
                    y: {
                        title: { display: true, text: 'Data Consumption (GB)', font: { family: 'Outfit', weight: 'bold' } },
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        min: 0
                    }
                }
            }
        });
    }

    // Prediction Logic
    function predict() {
        const hours = parseFloat(usageInput.value);

        if (isNaN(hours) || hours < 0 || hours > 24) {
            usageInput.classList.add('ring-red-500/20', 'bg-red-50');
            return;
        }

        usageInput.classList.remove('ring-red-500/20', 'bg-red-50');

        // Linear Regression Formula: y = β1 * x + β0
        const prediction = (β1 * hours + β0).toFixed(2);

        // Animate Result
        animateValue(resultValue, parseFloat(resultValue.innerText), parseFloat(prediction), 500);

        // Update Chart
        chart.data.datasets[1].data = [{ x: hours, y: prediction }];
        chart.update();
    }

    // Helper: Value Animation
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start) + start).toFixed(2);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Event Listeners
    calcBtn.addEventListener('click', predict);
    usageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') predict();
    });

    initChart();
});
