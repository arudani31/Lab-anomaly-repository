document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // UI Loading State
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    btn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'block';
    resultCard.style.display = 'none';

    // Gather Data
    const data = {
        patient_id: document.getElementById('patient_id').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        heart_rate: parseFloat(document.getElementById('heart_rate').value),
        oxygen_saturation: parseFloat(document.getElementById('oxygen_saturation').value),
        wbc_count: parseFloat(document.getElementById('wbc_count').value),
        has_flu_symptoms: parseInt(document.getElementById('has_flu_symptoms').value)
    };

    try {
        const response = await fetch('/api/v1/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('API Request Failed');
        }

        const result = await response.json();
        renderResults(result);

    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        btn.disabled = false;
        btnText.style.display = 'block';
        loader.style.display = 'none';
    }
});

function renderResults(data) {
    const resultCard = document.getElementById('resultCard');
    const statusBadge = document.getElementById('statusBadge');
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceValue = document.getElementById('confidenceValue');
    const explanationText = document.getElementById('explanationText');
    const shapChart = document.getElementById('shapChart');

    // 1. Status Badge
    if (data.is_abnormal) {
        statusBadge.className = 'status-badge status-abnormal';
        statusBadge.textContent = 'ABNORMAL DETECTED';
    } else {
        statusBadge.className = 'status-badge status-normal';
        statusBadge.textContent = 'NORMAL RESULT';
    }

    // 2. Confidence
    const confPercent = Math.round(data.confidence * 100);
    confidenceBar.style.width = `${confPercent}%`;
    confidenceValue.textContent = `${confPercent}% Confidence`;

    // 3. Explanation (Simple markdown parsing for bolding)
    // Replace **text** with <strong>text</strong>
    let formattedText = data.explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    explanationText.innerHTML = formattedText;

    // 4. SHAP Chart
    shapChart.innerHTML = ''; // Clear previous

    // Sort SHAP values by absolute magnitude
    const sortedShap = Object.entries(data.shap_values)
        .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));

    sortedShap.forEach(([feature, value]) => {
        const isPositive = value > 0;
        const color = isPositive ? 'var(--danger-color)' : 'var(--success-color)';
        // Normalize width for visualization (arbitrary scale factor)
        const width = Math.min(Math.abs(value) * 100, 100);

        const row = document.createElement('div');
        row.className = 'bar-container';
        row.innerHTML = `
            <div class="bar-label">${feature}</div>
            <div class="bar-wrapper">
                <div class="bar-fill" style="width: ${width}%; background: ${color};"></div>
            </div>
            <div class="bar-value">${value.toFixed(3)}</div>
        `;
        shapChart.appendChild(row);
    });

    // Show Card
    resultCard.style.display = 'block';
}
