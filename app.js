$(document).ready(function() {
    let myChart = null;

    // 1. Theme Persistence
    if (localStorage.getItem('theme') === 'dark') {
        $('html').attr('data-theme', 'dark');
        $('#theme-toggle').text('☀️ Light Mode');
    }

    $('#theme-toggle').on('click', function() {
        const isDark = $('html').attr('data-theme') === 'dark';
        $('html').attr('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        $(this).text(isDark ? '🌙 Dark Mode' : '☀️ Light Mode');
    });

    // 2. Behavioral Classification via AJAX
    
    $('.opt-btn').on('click', function() {
    const riskLevel = $(this).data('risk');
    
    // Hardcoded data so you don't need a server for the demo
    const data = {
        "low": {
            "title": "Conservative Strategy",
            "desc": "Prioritizes capital safety. High allocation to fixed income ensures stability.",
            "chartData": [20, 70, 10],
            "colors": ["#195683", "#6699CC", "#CDA21C"]
        },
        "medium": {
            "title": "Balanced Strategy",
            "desc": "Targets moderate growth. Maintains a hybrid exposure to equities and protection.",
            "chartData": [50, 40, 10],
            "colors": ["#195683", "#6699CC", "#CDA21C"]
        },
        "high": {
            "title": "Aggressive Strategy",
            "desc": "Focuses on capital appreciation. Heavy equity weighting for maximum growth.",
            "chartData": [85, 10, 5],
            "colors": ["#195683", "#6699CC", "#CDA21C"]
        }
    };

    $('#quiz-view').hide();
    $('#loading-view').fadeIn();

    // Simulate the delay without the AJAX call
    setTimeout(() => {
        $('#loading-view').hide();
        const profile = data[riskLevel];
        renderResults(profile);
        localStorage.setItem('lastSession', JSON.stringify(profile));
        $('#results-view').fadeIn();
    }, 1200);
    
    });

    function renderResults(data) {
        $('#type-title').text(data.title);
        $('#type-desc').text(data.desc);
        const ctx = document.getElementById('allocationChart').getContext('2d');
        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Equities', 'Bonds', 'Cash'],
                datasets: [{ data: data.chartData, backgroundColor: data.colors }]
            },
            options: { plugins: { legend: { position: 'bottom', labels: { color: $('html').attr('data-theme') === 'dark' ? '#e0e0e0' : '#333' } } } }
        });
    }

    $('#reset-btn').on('click', function() {
        localStorage.removeItem('lastSession');
        $('#results-view').hide();
        $('#quiz-view').fadeIn();
    });

    // Restore last session if user refreshes
    const saved = localStorage.getItem('lastSession');
    if (saved) {
        $('#quiz-view').hide();
        renderResults(JSON.parse(saved));
        $('#results-view').show();
    }
});