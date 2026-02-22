$(document).ready(function() {
    let myChart = null;

    // --- 1. PERSISTENT THEME ENGINE ---
    const savedTheme = localStorage.getItem('theme') || 'light';
    $('html').attr('data-theme', savedTheme);
    $('#theme-toggle').html(savedTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode');

    $('#theme-toggle').on('click', function() {
        const current = $('html').attr('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        $('html').attr('data-theme', next);
        localStorage.setItem('theme', next);
        $(this).html(next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode');
    });

    // --- 2. DIGITAL CONCIERGE (Directed Dialogue System) ---
    const botConfig = {
        greeting: "Welcome to Fidelity Canada. Protecting your wealth and insuring your future is our priority. How can I assist with your unified FHSA, TFSA, and RRSP strategy today?",
        options: [
            { 
                id: "insurance", 
                text: "Explore Wealth Insurance", 
                response: "At Fidelity, we view insurance as a cornerstone of investment. Our strategy integrates life and health protection within your unified portfolio to safeguard your gains.", 
                url: "https://www.fidelity.ca" 
            },
            { 
                id: "tax_saving", 
                text: "Tax-Efficient Investing", 
                response: "We can help you maximize your FHSA and RRSP contributions to lower your taxable income while growing your assets globally.", 
                url: "https://www.fidelity.ca" 
            }
        ]
    };

    function initChat() {
        const chatBox = $('#chat-messages');
        chatBox.empty(); 
        
        // Initial welcome
        appendBotMsg(botConfig.greeting);
        
        // Professional delay before showing options
        setTimeout(renderOptions, 800);
    }

    function appendBotMsg(text) {
        const msg = $(`<div class="bot-msg" style="display:none;">${text}</div>`);
        $('#chat-messages').append(msg);
        msg.fadeIn(400);
        scrollToBottom();
    }

    function renderOptions() {
        let html = '<div class="opt-container" style="display:flex; flex-direction:column; gap:8px; margin-top: 5px;">';
        botConfig.options.forEach(opt => {
            html += `<button class="chat-opt-btn" data-id="${opt.id}">${opt.text}</button>`;
        });
        html += '</div>';
        
        const $options = $(html).hide();
        $('#chat-messages').append($options);
        $options.fadeIn(600);
        scrollToBottom();
    }

    $(document).on('click', '.chat-opt-btn', function() {
        const id = $(this).data('id');
        const opt = botConfig.options.find(o => o.id === id);
        
        // Remove options with a fade out
        $(this).parent().fadeOut(200, function() { $(this).remove(); });
        
        // Show user choice
        $('#chat-messages').append(`<div class="user-msg">${opt.text}</div>`);
        scrollToBottom();
        
        // Bot response sequence
        setTimeout(() => {
            appendBotMsg(opt.response);
            
            setTimeout(() => {
                appendBotMsg(`Would you like to see our detailed resources? <a href="${opt.url}" target="_blank" style="color:#CDA21C; font-weight:700; text-decoration:none;">Visit Resource Center</a>`);
                
                // Loop back to options so the conversation stays active
                setTimeout(() => {
                    appendBotMsg("Is there anything else I can clarify for you?");
                    setTimeout(renderOptions, 500);
                }, 1200);
            }, 1000);
        }, 600);
    });

    function scrollToBottom() {
        const box = $("#chat-messages");
        box.stop().animate({ scrollTop: box[0].scrollHeight }, 500);
    }

    $('#chat-toggle').on('click', function() {
        const chatWin = $('#chat-window');
        chatWin.fadeToggle(300);
        
        // Initialize if opening for the first time
        if (chatWin.is(':visible') && $('#chat-messages').children().length === 0) {
            initChat();
        }
    });

    // Handle Manual Input (Optional improvement)
    $('#chat-send').on('click', function() {
        const input = $('#chat-input').val().trim();
        if (input !== "") {
            $('#chat-messages').append(`<div class="user-msg">${input}</div>`);
            $('#chat-input').val('');
            scrollToBottom();
            setTimeout(() => {
                appendBotMsg("I'm specialized in directed strategies. Please select one of the options below for the most accurate information:");
                renderOptions();
            }, 800);
        }
    });

    // --- 3. GATEKEEPER (Institutional Authentication) ---
    setTimeout(() => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            $('#auth-wall').css('display', 'flex').hide().fadeIn(800);
            $('body').css('overflow', 'hidden');
        }
    }, 10000);

    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        sessionStorage.setItem('isLoggedIn', 'true');
        $('#auth-wall').fadeOut(500);
        $('body').css('overflow', 'auto');
    });

    // --- 4. STRATEGY PROFILER & CHARTING ---
    const strategyData = {
        "low": { title: "Unified Conservative", data: [15, 75, 10] },
        "medium": { title: "Unified Balanced Growth", data: [55, 35, 10] },
        "high": { title: "Unified Aggressive Growth", data: [88, 7, 5] }
    };

    $('.opt-btn').on('click', function() {
        const risk = $(this).data('risk');
        $('#quiz-view').hide();
        $('#loading-view').fadeIn();
        
        setTimeout(() => {
            $('#loading-view').hide();
            renderChart(strategyData[risk]);
            $('#results-view').fadeIn();
        }, 1500);
    });

    function renderChart(strat) {
        $('#type-title').text(strat.title);
        const ctx = document.getElementById('allocationChart').getContext('2d');
        if (myChart) myChart.destroy();
        
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: { 
                labels: ['Equities', 'Bonds', 'Cash'], 
                datasets: [{ 
                    data: strat.data, 
                    backgroundColor: ["#195683", "#6699CC", "#CDA21C"], 
                    borderWidth: 0 
                }] 
            },
            options: { 
                cutout: '75%', 
                plugins: { 
                    legend: { 
                        position: 'bottom', 
                        labels: { 
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() 
                        } 
                    } 
                } 
            }
        });
    }

    $('#reset-btn').on('click', () => {
        $('#results-view').hide();
        $('#quiz-view').fadeIn();
    });
});