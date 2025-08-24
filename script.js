document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements Cache ---
    const elements = {
        // Main Navigation
        navButtons: document.querySelectorAll('.nav-button'),
        appSections: document.querySelectorAll('.app-section'),

        // Dashboard
        dashTotalMedTime: document.getElementById('dash-total-med-time'),
        dashTotalMedSessions: document.getElementById('dash-total-med-sessions'),
        dashCurrentStreak: document.getElementById('dash-current-streak'),
        dashBooksFinished: document.getElementById('dash-books-finished'),
        dashMeditationSessionsList: document.getElementById('dash-meditation-sessions-list'),
        dashCurrentReadingList: document.getElementById('dash-current-reading-list'),

        // Meditation Section
        meditationTimerDisplay: document.getElementById('meditation-timer-display'),
        startMeditationBtn: document.getElementById('start-meditation'),
        pauseMeditationBtn: document.getElementById('pause-meditation'),
        stopMeditationBtn: document.getElementById('stop-meditation'),
        resetMeditationBtn: document.getElementById('reset-meditation'),
        presetMeditationButtons: document.querySelectorAll('.preset-meditation-time'),
        customMeditationMinutesInput: document.getElementById('custom-meditation-minutes'),
        setCustomMeditationBtn: document.getElementById('set-custom-meditation'),
        meditationSessionsList: document.getElementById('meditation-sessions-list'),
        openIntervalTimerBtn: document.getElementById('open-interval-timer-btn'),

        // General Countdown Timer (New)
        countdownHoursInput: document.getElementById('countdown-hours'),
        countdownMinutesInput: document.getElementById('countdown-minutes'),
        countdownSecondsInput: document.getElementById('countdown-seconds'),
        generalCountdownDisplay: document.getElementById('general-countdown-display'),
        startCountdownBtn: document.getElementById('start-countdown'),
        pauseCountdownBtn: document.getElementById('pause-countdown'),
        stopCountdownBtn: document.getElementById('stop-countdown'),
        resetCountdownBtn: document.getElementById('reset-countdown'),
        countdownLabelInput: document.getElementById('countdown-label'),
        countdownNotificationToggle: document.getElementById('countdown-notification-toggle'),

        // Book Section
        newBookCoverInput: document.getElementById('new-book-cover'),
        uploadBookCoverBtn: document.getElementById('upload-book-cover-btn'),
        newBookTitleInput: document.getElementById('new-book-title'),
        newBookAuthorInput: document.getElementById('new-book-author'),
        newBookPagesInput: document.getElementById('new-book-pages'),
        newBookGenreInput: document.getElementById('new-book-genre'),
        addBookBtn: document.getElementById('add-book'),
        booksList: document.getElementById('books-list'),
        bookSearchInput: document.getElementById('book-search-input'),
        clearBookSearchBtn: document.getElementById('clear-book-search'),

        // Statistics Section
        meditationTimeChartCanvas: document.getElementById('meditationTimeChart'),
        meditationSessionsChartCanvas: document.getElementById('meditationSessionsChart'),
        moodDistributionChartCanvas: document.getElementById('moodDistributionChart'),
        topTagsChartCanvas: document.getElementById('topTagsChart'),
        bookReadingTimeChartCanvas: document.getElementById('bookReadingTimeChart'),
        meditationCalendar: document.getElementById('meditation-calendar'),

        // Goals Section
        goalTypeSelect: document.getElementById('goal-type'),
        goalValueInput: document.getElementById('goal-value'),
        goalPeriodSelect: document.getElementById('goal-period'),
        addGoalBtn: document.getElementById('add-goal'),
        activeGoalsList: document.getElementById('active-goals-list'),
        completedGoalsList: document.getElementById('completed-goals-list'),

        // Achievements Section
        achievementsGrid: document.getElementById('achievements-grid'),

        // Settings Section
        themeSelector: document.getElementById('theme-selector'),
        customBackgroundFileInput: document.getElementById('custom-background-file'),
        uploadCustomBackgroundBtn: document.getElementById('upload-custom-background-btn'),
        clearCustomBackgroundBtn: document.getElementById('clear-custom-background-btn'),
        dailyReminderTimeInput: document.getElementById('daily-reminder-time'),
        setDailyReminderBtn: document.getElementById('set-daily-reminder-btn'),
        clearDailyReminderBtn: document.getElementById('clear-daily-reminder-btn'),
        exportDataBtn: document.getElementById('export-data-btn'),
        importDataFile: document.getElementById('import-data-file'),
        importDataBtn: document.getElementById('import-data-btn'),
        clearAllDataBtn: document.getElementById('clear-all-data-btn'),

        // Modals
        meditationJournalModal: document.getElementById('meditation-journal-modal'),
        journalMoodEmojis: document.querySelectorAll('.mood-emojis .emoji'),
        journalEnergyLevel: document.getElementById('energy-level'),
        journalEnergyValue: document.getElementById('energy-value'),
        journalTagsInput: document.getElementById('journal-tags-input'),
        journalTextInput: document.getElementById('journal-text'),
        gratitudeTextInput: document.getElementById('gratitude-text'),
        saveJournalEntryBtn: document.getElementById('save-journal-entry'),

        bookDetailsModal: document.getElementById('book-details-modal'),
        modalBookCoverImg: document.getElementById('modal-book-cover-img'),
        modalBookTitle: document.getElementById('modal-book-title'),
        modalBookAuthor: document.getElementById('modal-book-author'),
        modalBookGenre: document.getElementById('modal-book-genre'),
        modalBookStatusContainer: document.getElementById('modal-book-status-container'),
        modalBookRating: document.getElementById('modal-book-rating'),
        modalBookTotalPages: document.getElementById('modal-book-total-pages'),
        modalBookCurrentPage: document.getElementById('modal-book-current-page'),
        modalBookProgress: document.getElementById('modal-book-progress'),
        modalProgressBar: document.getElementById('modal-progress-bar'),
        modalBookTotalReadingTime: document.getElementById('modal-book-total-reading-time'),
        modalBookNotesInput: document.getElementById('modal-book-notes-input'),
        addBookNoteBtn: document.getElementById('add-book-note-btn'),
        modalBookNotesList: document.getElementById('modal-book-notes-list'),

        intervalTimerModal: document.getElementById('interval-timer-modal'),
        intervalStepsContainer: document.getElementById('interval-steps-container'),
        addIntervalStepBtn: document.getElementById('add-interval-step'),
        startIntervalMeditationBtn: document.getElementById('start-interval-meditation'),

        confirmationModal: document.getElementById('confirmation-modal'),
        confirmationMessage: document.getElementById('confirmation-message'),
        confirmActionBtn: document.getElementById('confirm-action-btn'),
        cancelActionBtn: document.getElementById('cancel-action-btn'),

        closeButtons: document.querySelectorAll('.close-button'),
        toastContainer: document.getElementById('toast-container')
    };

    // --- Global State Variables ---
    let meditationTimerInterval;
    let meditationStartTime = 0;
    let meditationElapsedTime = 0;
    let meditationPaused = false;
    let meditationDurationTarget = 0; // In milliseconds, for presets & intervals
    let meditationType = 'standard'; // 'standard' or 'interval' or 'freestyle' (for 0 duration target)
    let currentIntervalIndex = 0;
    let intervalTimerSteps = []; // [{duration, label}] (sounds removed)

    // General Countdown Timer state (New)
    let generalCountdownInterval = null;
    let generalCountdownRemainingMs = 0;
    let generalCountdownInitialMs = 0; // The total duration user set
    let generalCountdownPaused = false;
    let generalCountdownEndTime = 0; // When the timer should end if running

    let currentReadingBookId = null;
    let bookReadingTimerInterval;
    let bookReadingStartTime = 0;

    // --- Data Structures (Persisted in localStorage) ---
    // meditationSessions: [{ id, startTime, endTime, durationMs, date, journalEntry?, mood?, energy?, tags?, type? }]
    let meditationSessions = loadData('meditationSessions', []);

    // books: [{ id, title, author, totalPages, currentPage, readingSessions: [{ startTime, endTime, durationMs }], notes: [{ id, text, date }], coverImage?, status?, rating?, genre? }]
    let books = loadData('books', []);

    // goals: [{ id, type, targetValue, period, currentProgress, completed, startDate, lastUpdate }]
    let goals = loadData('goals', []);

    // settings: { theme, dailyReminderTime, customBackground }
    let settings = loadData('settings', {
        theme: 'yogify-serene', // New default theme
        dailyReminderTime: '',
        customBackground: null
    });

    // generalCountdown: { remainingMs, initialMs, paused, endTime, label, notify }
    let generalCountdownState = loadData('generalCountdownState', {
        remainingMs: 0,
        initialMs: 0,
        paused: false,
        endTime: 0,
        label: '',
        notify: false
    });


    // achievementsList: [{ id, name, description, check(), unlocked, icon }] (check function is part of the JS definition, only unlocked status is persisted)
    // Define achievement check functions here to ensure they are always present.
    const baseAchievements = [
        { id: 'first_session', name: 'First Step', description: 'Complete your first meditation session.', unlocked: false, icon: 'fas fa-shoe-prints', check: () => meditationSessions.length >= 1 },
        { id: 'seven_day_streak', name: '7-Day Streak', description: 'Meditate for 7 consecutive days.', unlocked: false, icon: 'fas fa-fire', check: () => calculateStreaks().longestStreak >= 7 },
        { id: '30_min_meditation', name: 'Deep Dive', description: 'Complete a meditation session of 30 minutes or more.', unlocked: false, icon: 'fas fa-mountain', check: () => meditationSessions.some(s => s.durationMs >= 30 * 60 * 1000) },
        { id: '10_hours_meditated', name: 'Seasoned Seeker', description: 'Accumulate 10 hours of meditation.', unlocked: false, icon: 'fas fa-star', check: () => meditationSessions.reduce((sum, s) => sum + s.durationMs, 0) >= 10 * 60 * 60 * 1000 },
        { id: 'first_book_finished', name: 'Wisdom Gained', description: 'Mark your first spiritual book as "Finished".', unlocked: false, icon: 'fas fa-feather-alt', check: () => books.some(b => b.status === 'Finished') },
        { id: 'five_books_finished', name: 'Enlightened Library', description: 'Finish 5 spiritual books.', unlocked: false, icon: 'fas fa-book-sparkles', check: () => books.filter(b => b.status === 'Finished').length >= 5 },
        { id: 'first_journal_entry', name: 'Inner Voice', description: 'Write your first meditation journal entry.', unlocked: false, icon: 'fas fa-pen-nib', check: () => meditationSessions.some(s => s.journalEntry && s.journalEntry.length > 0) },
        { id: 'first_book_note', name: 'Reflective Reader', description: 'Add your first note to a spiritual book.', unlocked: false, icon: 'fas fa-highlighter', check: () => books.some(b => b.notes && b.notes.length > 0) },
    ];
    let achievementsList = loadAchievementsWithChecks(baseAchievements, loadData('achievementsListStatus', []));

    // --- Charts ---
    let meditationTimeChart, meditationSessionsChart, moodDistributionChart, topTagsChart, bookReadingTimeChart;


    // --- Utility Functions ---

    /**
     * Loads data from localStorage or returns a default value.
     * @param {string} key
     * @param {any} defaultValue
     * @returns {any}
     */
    function loadData(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error loading data for key ${key}:`, e);
            showToast('Error loading data: Local storage might be corrupted.', 'error');
            return defaultValue;
        }
    }

    /**
     * Saves data to localStorage.
     * @param {string} key
     * @param {any} data
     */
    function saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving data for key ${key}:`, e);
            showToast('Not enough storage space. Please clear some data.', 'error');
        }
    }

    /**
     * Loads achievement status and merges with base achievement definitions.
     * @param {Array} baseAch The full achievement definitions with check functions.
     * @param {Array} storedStatus The stored unlocked status (id, unlocked).
     * @returns {Array} The merged achievements list.
     */
    function loadAchievementsWithChecks(baseAch, storedStatus) {
        const mergedList = [...baseAch]; // Deep copy to avoid modifying base
        storedStatus.forEach(stored => {
            const ach = mergedList.find(a => a.id === stored.id);
            if (ach) {
                ach.unlocked = stored.unlocked;
            }
        });
        return mergedList;
    }

    /**
     * Formats milliseconds into HH:MM:SS string.
     * @param {number} ms
     * @returns {string}
     */
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
            .map(unit => String(unit).padStart(2, '0'))
            .join(':');
    }

    /**
     * Formats milliseconds into human-readable hours and minutes.
     * @param {number} ms
     * @returns {string}
     */
    function formatDuration(ms) {
        if (ms === 0) return '0m';
        const totalMinutes = Math.floor(ms / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    /**
     * Generates a unique ID.
     * @returns {string}
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    /**
     * Opens a modal.
     * @param {HTMLElement} modalElement
     */
    function openModal(modalElement) {
        modalElement.style.display = 'flex'; // Use flex for centering
        document.body.classList.add('modal-open');
    }

    /**
     * Closes a modal.
     * @param {HTMLElement} modalElement
     */
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    /**
     * Shows a toast notification.
     * @param {string} message
     * @param {string} type 'success', 'error', 'info', 'warning'
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        let icon = '';
        if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
        else if (type === 'error') icon = '<i class="fas fa-exclamation-triangle"></i>';
        else if (type === 'warning') icon = '<i class="fas fa-exclamation-circle"></i>';
        else icon = '<i class="fas fa-info-circle"></i>';

        toast.innerHTML = `${icon} <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        // Allow reflow for transition
        void toast.offsetWidth; // Trigger reflow
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 3000);
    }

    // --- Meditation Logic ---

    function startMeditationTimer(durationMinutes = 0, type = 'standard') {
        if (meditationTimerInterval) {
            showToast('Meditation already running!', 'warning');
            return;
        }

        meditationDurationTarget = durationMinutes * 60 * 1000;
        meditationType = type;

        if (!meditationPaused) {
            meditationStartTime = Date.now();
            meditationElapsedTime = 0;
            currentIntervalIndex = 0; // Reset for new session
        } else {
            // Resume from pause
            meditationStartTime = Date.now() - meditationElapsedTime;
            meditationPaused = false;
        }

        updateMeditationButtonStates(true, false, false);
        showToast('Meditation started.', 'info');

        meditationTimerInterval = setInterval(() => {
            meditationElapsedTime = Date.now() - meditationStartTime;
            elements.meditationTimerDisplay.textContent = formatTime(meditationElapsedTime);

            if (meditationType === 'standard' && meditationDurationTarget > 0 && meditationElapsedTime >= meditationDurationTarget) {
                stopMeditationTimer();
                showToast('Meditation session completed!', 'success');
            } else if (meditationType === 'interval' && intervalTimerSteps.length > 0) {
                // Calculate total duration up to the current interval step
                const totalIntervalDurationSoFar = intervalTimerSteps.slice(0, currentIntervalIndex + 1).reduce((sum, step) => sum + (step.duration * 1000), 0);

                if (meditationElapsedTime >= totalIntervalDurationSoFar) {
                    currentIntervalIndex++;
                    if (currentIntervalIndex < intervalTimerSteps.length) {
                        const nextStep = intervalTimerSteps[currentIntervalIndex];
                        showToast(`Next Interval: ${nextStep.label} (${nextStep.duration}s)`, 'info');
                    } else {
                        stopMeditationTimer();
                        showToast('Interval meditation completed!', 'success');
                    }
                }
            }
        }, 1000);
    }

    function pauseMeditationTimer() {
        if (!meditationTimerInterval) return;
        clearInterval(meditationTimerInterval);
        meditationTimerInterval = null;
        meditationPaused = true;
        updateMeditationButtonStates(false, true, false);
        showToast('Meditation paused.', 'info');
    }

    function stopMeditationTimer() {
        if (!meditationTimerInterval && !meditationPaused) return; // Not running and not paused, nothing to stop

        clearInterval(meditationTimerInterval);
        meditationTimerInterval = null;

        const durationMs = meditationElapsedTime;

        if (durationMs > 5000) { // Only record sessions longer than 5 seconds
            const session = {
                id: generateId(),
                startTime: meditationStartTime,
                endTime: Date.now(),
                durationMs: durationMs,
                date: new Date(meditationStartTime).toDateString(),
                type: meditationType,
                mood: null,
                energy: null,
                tags: [],
                journalEntry: '',
                gratitudeEntry: ''
            };
            meditationSessions.push(session);
            saveData('meditationSessions', meditationSessions);
            renderMeditationSessions();
            updateMeditationStats();
            updateAchievements();
            updateGoals();
            openMeditationJournalModal(session.id);
            showToast('Meditation session recorded!', 'success');
        } else {
            showToast('Meditation session was too short to record (min 5s).', 'info');
        }

        resetMeditationDisplay();
    }

    function resetMeditationDisplay() {
        clearInterval(meditationTimerInterval);
        meditationTimerInterval = null;
        meditationStartTime = 0;
        meditationElapsedTime = 0;
        meditationPaused = false;
        meditationDurationTarget = 0;
        meditationType = 'standard';
        currentIntervalIndex = 0;
        elements.meditationTimerDisplay.textContent = '00:00:00';
        elements.customMeditationMinutesInput.value = ''; // Clear custom input
        updateMeditationButtonStates(false, true, true);
    }

    function updateMeditationButtonStates(isTimerRunning, isTimerPaused, isTimerReset) {
        elements.startMeditationBtn.disabled = isTimerRunning && !isTimerPaused;
        elements.pauseMeditationBtn.disabled = !isTimerRunning || isTimerPaused;
        elements.stopMeditationBtn.disabled = !isTimerRunning && !isTimerPaused;
        elements.resetMeditationBtn.disabled = isTimerRunning; // Reset should be enabled when paused or stopped
        if (!isTimerRunning && !isTimerPaused && meditationElapsedTime === 0) { // Initial state
             elements.resetMeditationBtn.disabled = true;
        }

        elements.presetMeditationButtons.forEach(btn => btn.disabled = isTimerRunning);
        elements.openIntervalTimerBtn.disabled = isTimerRunning;
        elements.setCustomMeditationBtn.disabled = isTimerRunning;
        elements.customMeditationMinutesInput.disabled = isTimerRunning;
    }

    function renderMeditationSessions() {
        elements.meditationSessionsList.innerHTML = ''; // Clear all
        elements.dashMeditationSessionsList.innerHTML = ''; // Clear dashboard

        const sortedSessions = [...meditationSessions].sort((a, b) => b.startTime - a.startTime);

        if (sortedSessions.length === 0) {
            elements.meditationSessionsList.innerHTML = '<li class="info-message">No meditation sessions recorded yet. Start your journey!</li>';
        }

        sortedSessions.forEach(session => {
            const li = document.createElement('li');
            const date = new Date(session.startTime);
            const tags = session.tags && session.tags.length > 0 ? `<br><small>Tags: ${session.tags.join(', ')}</small>` : '';
            li.innerHTML = `
                <div>
                    <span class="session-date">${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <br><strong class="session-duration">${formatDuration(session.durationMs)}</strong> (${session.type === 'interval' ? 'Interval' : 'Standard'})
                    ${session.mood ? `<span class="session-mood-emoji" title="Mood: ${session.mood}"> ${getEmojiForMood(session.mood)}</span>` : ''}
                    ${tags}
                </div>
                <button class="view-journal-btn btn-sm" data-session-id="${session.id}" title="View/Edit Journal" aria-label="View or edit journal for session on ${date.toLocaleDateString()}"><i class="fas fa-feather-alt"></i></button>
            `;
            elements.meditationSessionsList.appendChild(li);
        });

        // Dashboard recent sessions (limit to 3)
        if (sortedSessions.length > 0) {
            sortedSessions.slice(0, 3).forEach(session => {
                const li = document.createElement('li');
                const date = new Date(session.startTime);
                li.innerHTML = `
                    <span class="session-date">${date.toLocaleDateString()}: ${formatDuration(session.durationMs)}</span>
                    ${session.mood ? `<span class="session-mood-emoji" title="Mood: ${session.mood}"> ${getEmojiForMood(session.mood)}</span>` : ''}
                `;
                elements.dashMeditationSessionsList.appendChild(li);
            });
        } else {
            elements.dashMeditationSessionsList.innerHTML = '<li class="info-message">No recent meditations.</li>';
        }

        document.querySelectorAll('.view-journal-btn').forEach(btn => {
            btn.onclick = (e) => openMeditationJournalModal(e.currentTarget.dataset.sessionId);
        });
    }

    function updateMeditationStats() {
        const totalDurationMs = meditationSessions.reduce((sum, session) => sum + session.durationMs, 0);
        
        const { currentStreak, longestStreak } = calculateStreaks();

        // Update Dashboard Stats
        elements.dashTotalMedTime.textContent = formatDuration(totalDurationMs);
        elements.dashTotalMedSessions.textContent = meditationSessions.length;
        elements.dashCurrentStreak.textContent = `${currentStreak} days`;
        
        // Update Chart.js data and re-render
        renderMeditationCharts();
        renderMeditationCalendar();
    }

    function calculateStreaks() {
        if (meditationSessions.length === 0) {
            return { currentStreak: 0, longestStreak: 0 };
        }

        const uniqueDatesMs = [...new Set(meditationSessions
            .map(session => {
                const d = new Date(session.startTime);
                d.setHours(0,0,0,0); // Normalize to midnight
                return d.getTime();
            }))]
            .sort((a, b) => a - b); // Sort chronologically

        let currentStreak = 0;
        let longestStreak = 0;
        let tempCurrentStreak = 0;
        let lastDateMs = null;

        const today = new Date();
        today.setHours(0,0,0,0);
        const todayMs = today.getTime();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayMs = yesterday.getTime();


        for (let i = 0; i < uniqueDatesMs.length; i++) {
            const currentDateMs = uniqueDatesMs[i];
            if (lastDateMs === null) {
                tempCurrentStreak = 1;
            } else {
                const dayDiff = (currentDateMs - lastDateMs) / (1000 * 60 * 60 * 24);
                if (dayDiff === 1) { // Consecutive day
                    tempCurrentStreak++;
                } else if (dayDiff > 1) { // Gap
                    tempCurrentStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempCurrentStreak);
            lastDateMs = currentDateMs;
        }

        // Calculate current streak based on today or yesterday having a session
        const latestUniqueDate = uniqueDatesMs[uniqueDatesMs.length - 1];

        if (latestUniqueDate === todayMs) {
            currentStreak = tempCurrentStreak;
        } else if (latestUniqueDate === yesterdayMs) {
            // If the last session was yesterday, current streak is the streak ending yesterday.
            // This 'tempCurrentStreak' already reflects the streak ending at latestUniqueDate.
            currentStreak = tempCurrentStreak;
        } else {
            currentStreak = 0; // No session today or yesterday, streak broken
        }
        
        return { currentStreak, longestStreak };
    }

    function openMeditationJournalModal(sessionId) {
        const session = meditationSessions.find(s => s.id === sessionId);
        if (session) {
            // Reset mood selection and set accessibility attributes
            elements.journalMoodEmojis.forEach(emoji => {
                emoji.classList.remove('selected');
                emoji.setAttribute('aria-checked', 'false');
            });
            if (session.mood) {
                const selectedEmoji = document.querySelector(`.mood-emojis .emoji[data-mood="${session.mood}"]`);
                if (selectedEmoji) {
                    selectedEmoji.classList.add('selected');
                    selectedEmoji.setAttribute('aria-checked', 'true');
                }
            }

            elements.journalEnergyLevel.value = session.energy !== null ? session.energy : 5;
            elements.journalEnergyValue.textContent = elements.journalEnergyLevel.value;

            elements.journalTagsInput.value = session.tags ? session.tags.join(', ') : '';
            elements.journalTextInput.value = session.journalEntry || '';
            elements.gratitudeTextInput.value = session.gratitudeEntry || '';

            elements.saveJournalEntryBtn.onclick = () => {
                session.mood = document.querySelector('.mood-emojis .emoji.selected')?.dataset.mood || null;
                session.energy = parseInt(elements.journalEnergyLevel.value, 10);
                session.tags = elements.journalTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                session.journalEntry = elements.journalTextInput.value.trim();
                session.gratitudeEntry = elements.gratitudeTextInput.value.trim();

                saveData('meditationSessions', meditationSessions);
                closeModal(elements.meditationJournalModal);
                renderMeditationSessions(); // Re-render to show mood/tags
                updateMeditationStats(); // Re-render charts
                updateAchievements(); // Check for 'first_journal_entry' achievement
                showToast('Journal entry saved!', 'success');
            };
            openModal(elements.meditationJournalModal);
        }
    }

    function getEmojiForMood(mood) {
        switch (mood) {
            case 'calm': return '😌';
            case 'focused': return '🧐';
            case 'peaceful': return '🕊️';
            case 'energetic': return '⚡';
            case 'tired': return '😴';
            case 'anxious': return '😟';
            case 'happy': return '😊';
            default: return '';
        }
    }

    function addIntervalStep() {
        const stepCount = elements.intervalStepsContainer.children.length;
        const div = document.createElement('div');
        div.className = 'interval-step';
        div.innerHTML = `
            <label>Step ${stepCount + 1}:</label>
            <input type="number" value="60" min="5" placeholder="Seconds" data-type="duration" class="input-field small-input" aria-label="Step ${stepCount + 1} duration in seconds"><span>s</span>
            <input type="text" placeholder="Label (e.g., Focus)" data-type="label" class="input-field" aria-label="Step ${stepCount + 1} label">
            <button class="delete-step-btn delete-button btn-sm" aria-label="Delete Step"><i class="fas fa-times"></i></button>
        `;
        elements.intervalStepsContainer.appendChild(div);
        div.querySelector('.delete-step-btn').onclick = (e) => e.target.closest('.interval-step').remove();
    }

    function getIntervalStepsFromUI() {
        const steps = [];
        elements.intervalStepsContainer.querySelectorAll('.interval-step').forEach(stepDiv => {
            const duration = parseInt(stepDiv.querySelector('[data-type="duration"]').value, 10);
            const label = stepDiv.querySelector('[data-type="label"]').value || `Step ${steps.length + 1}`;
            if (!isNaN(duration) && duration > 0) {
                steps.push({ duration, label });
            }
        });
        return steps;
    }

    // --- General Countdown Timer Logic (New) ---

    function updateCountdownDisplay() {
        elements.generalCountdownDisplay.textContent = formatTime(generalCountdownRemainingMs);
        const hours = Math.floor(generalCountdownRemainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((generalCountdownRemainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((generalCountdownRemainingMs % (1000 * 60)) / 1000);
        elements.countdownHoursInput.value = hours;
        elements.countdownMinutesInput.value = minutes;
        elements.countdownSecondsInput.value = seconds;
    }

    function updateCountdownButtonStates(isRunning, isPaused) {
        elements.countdownHoursInput.disabled = isRunning || isPaused;
        elements.countdownMinutesInput.disabled = isRunning || isPaused;
        elements.countdownSecondsInput.disabled = isRunning || isPaused;
        elements.countdownLabelInput.disabled = isRunning || isPaused;
        elements.countdownNotificationToggle.disabled = isRunning || isPaused;

        elements.startCountdownBtn.disabled = isRunning;
        elements.pauseCountdownBtn.disabled = !isRunning;
        elements.stopCountdownBtn.disabled = !isRunning && !isPaused;
        elements.resetCountdownBtn.disabled = isRunning; // Reset should be available when paused or stopped
        if (!isRunning && !isPaused && generalCountdownRemainingMs === 0) {
            elements.resetCountdownBtn.disabled = true;
        }
    }

    function startCountdown() {
        if (generalCountdownInterval) {
            showToast('Countdown already running!', 'warning');
            return;
        }

        const h = parseInt(elements.countdownHoursInput.value) || 0;
        const m = parseInt(elements.countdownMinutesInput.value) || 0;
        const s = parseInt(elements.countdownSecondsInput.value) || 0;

        let totalMs = (h * 3600 + m * 60 + s) * 1000;

        if (totalMs <= 0 && generalCountdownRemainingMs <= 0) {
            showToast('Please set a duration for the countdown!', 'error');
            return;
        }

        if (!generalCountdownPaused) {
            generalCountdownInitialMs = totalMs;
            generalCountdownRemainingMs = totalMs;
        } else {
            totalMs = generalCountdownRemainingMs; // Resume from remaining time
            generalCountdownPaused = false;
        }

        if (generalCountdownRemainingMs <= 0) { // If it was paused at 0 or set to 0 initially
            showToast('Countdown finished. Please set a new duration.', 'info');
            resetCountdown();
            return;
        }
        
        generalCountdownEndTime = Date.now() + generalCountdownRemainingMs;

        updateCountdownButtonStates(true, false);
        elements.countdownLabelInput.disabled = true; // Disable label edit while running
        elements.countdownNotificationToggle.disabled = true; // Disable notification toggle while running
        showToast(`Countdown "${elements.countdownLabelInput.value || 'Timer'}" started.`, 'info');

        generalCountdownInterval = setInterval(() => {
            generalCountdownRemainingMs = generalCountdownEndTime - Date.now();

            if (generalCountdownRemainingMs <= 0) {
                generalCountdownRemainingMs = 0;
                stopCountdown(true); // Call stop with 'finished' flag
                showToast(`Countdown "${elements.countdownLabelInput.value || 'Timer'}" finished!`, 'success');
            }
            updateCountdownDisplay();
            saveCountdownState(); // Save state every second
        }, 1000);
    }

    function pauseCountdown() {
        if (!generalCountdownInterval) return;
        clearInterval(generalCountdownInterval);
        generalCountdownInterval = null;
        generalCountdownPaused = true;
        generalCountdownEndTime = 0; // Clear end time when paused
        updateCountdownButtonStates(false, true);
        saveCountdownState();
        showToast(`Countdown "${elements.countdownLabelInput.value || 'Timer'}" paused.`, 'info');
    }

    function stopCountdown(finished = false) {
        if (!generalCountdownInterval && !generalCountdownPaused) return; // Not running and not paused

        clearInterval(generalCountdownInterval);
        generalCountdownInterval = null;
        generalCountdownPaused = false;
        generalCountdownEndTime = 0;

        if (finished) {
            if (generalCountdownState.notify && Notification.permission === 'granted') {
                new Notification('Yogify Countdown', {
                    body: `${elements.countdownLabelInput.value || 'Your timer'} has finished!`,
                    icon: './img/icon.png'
                });
            }
            resetCountdown(); // Full reset after finishing
        } else {
            showToast(`Countdown "${elements.countdownLabelInput.value || 'Timer'}" stopped.`, 'info');
            resetCountdown(); // Full reset if manually stopped
        }
    }

    function resetCountdown() {
        clearInterval(generalCountdownInterval);
        generalCountdownInterval = null;
        generalCountdownRemainingMs = 0;
        generalCountdownInitialMs = 0;
        generalCountdownPaused = false;
        generalCountdownEndTime = 0;
        
        elements.countdownHoursInput.value = '';
        elements.countdownMinutesInput.value = '';
        elements.countdownSecondsInput.value = '';
        elements.generalCountdownDisplay.textContent = '00:00:00';

        elements.countdownLabelInput.value = ''; // Clear label
        elements.countdownNotificationToggle.checked = false; // Reset notification toggle

        updateCountdownButtonStates(false, false);
        saveCountdownState();
    }

    function saveCountdownState() {
        generalCountdownState = {
            remainingMs: generalCountdownRemainingMs,
            initialMs: generalCountdownInitialMs,
            paused: generalCountdownPaused,
            endTime: generalCountdownEndTime,
            label: elements.countdownLabelInput.value,
            notify: elements.countdownNotificationToggle.checked
        };
        saveData('generalCountdownState', generalCountdownState);
    }

    function loadCountdownState() {
        elements.countdownLabelInput.value = generalCountdownState.label;
        elements.countdownNotificationToggle.checked = generalCountdownState.notify;

        if (generalCountdownState.paused) {
            generalCountdownRemainingMs = generalCountdownState.remainingMs;
            generalCountdownInitialMs = generalCountdownState.initialMs;
            generalCountdownPaused = true;
            updateCountdownDisplay();
            updateCountdownButtonStates(false, true); // Set to paused state
            showToast(`Countdown "${generalCountdownState.label || 'Timer'}" was paused.`, 'info');
        } else if (generalCountdownState.endTime > 0) {
            // Timer was running, calculate remaining time
            generalCountdownRemainingMs = generalCountdownState.endTime - Date.now();
            generalCountdownInitialMs = generalCountdownState.initialMs;

            if (generalCountdownRemainingMs <= 0) {
                // Timer finished while app was closed
                generalCountdownRemainingMs = 0;
                updateCountdownDisplay();
                updateCountdownButtonStates(false, false);
                if (generalCountdownState.notify && Notification.permission === 'granted') {
                    new Notification('Yogify Countdown', {
                        body: `${generalCountdownState.label || 'Your timer'} finished while you were away!`,
                        icon: './img/icon.png'
                    });
                }
                resetCountdown(); // Fully reset
                showToast(`Countdown "${generalCountdownState.label || 'Timer'}" finished!`, 'success');
            } else {
                // Timer is still running
                generalCountdownPaused = false; // Set to not paused to restart it
                updateCountdownDisplay();
                startCountdown(); // Restart the interval
                showToast(`Countdown "${generalCountdownState.label || 'Timer'}" resumed.`, 'info');
            }
        } else {
            // No active timer, set initial display
            updateCountdownDisplay();
            updateCountdownButtonStates(false, false);
        }
    }


    // --- Book Tracking Logic ---

    let newBookCoverBase64 = null; // Store base64 of selected cover image

    function addBook() {
        const title = elements.newBookTitleInput.value.trim();
        const author = elements.newBookAuthorInput.value.trim();
        const totalPages = parseInt(elements.newBookPagesInput.value, 10);
        const genre = elements.newBookGenreInput.value.trim();

        if (!title) {
            showToast('Please enter a book title!', 'error');
            return;
        }
        if (totalPages < 0) {
            showToast('Total pages cannot be negative!', 'error');
            return;
        }


        books.push({
            id: generateId(),
            title: title,
            author: author || 'Unknown Author',
            totalPages: isNaN(totalPages) ? 0 : totalPages,
            currentPage: 0,
            readingSessions: [],
            notes: [],
            coverImage: newBookCoverBase64,
            status: 'Want to Read',
            rating: 0,
            genre: genre
        });
        saveData('books', books);
        elements.newBookTitleInput.value = '';
        elements.newBookAuthorInput.value = '';
        elements.newBookPagesInput.value = '';
        elements.newBookGenreInput.value = '';
        newBookCoverBase64 = null; // Clear selected cover
        elements.uploadBookCoverBtn.innerHTML = '<i class="fas fa-image"></i> Upload Cover Image'; // Reset button icon & text
        renderBooks();
        updateBookStatistics();
        updateAchievements();
        updateGoals();
        showToast('Book added successfully!', 'success');
    }

    function startBookReading(bookId) {
        if (currentReadingBookId) {
            if (currentReadingBookId === bookId) {
                 showToast('You are already reading this book.', 'info');
            } else {
                 showToast('Please stop reading the current book before starting another.', 'info');
            }
            return;
        }

        currentReadingBookId = bookId;
        bookReadingStartTime = Date.now();
        // Set book status to 'Reading' automatically
        const book = books.find(b => b.id === bookId);
        if (book && book.status !== 'Reading') {
            book.status = 'Reading';
            saveData('books', books);
            renderBooks(); // Re-render to update status display
        }
        updateBookButtonsState();
        showToast(`Started reading "${book.title}".`, 'info');
    }

    function stopBookReading(bookId) {
        if (currentReadingBookId !== bookId) return; // Only stop if it's the currently tracked book

        clearInterval(bookReadingTimerInterval); // Ensure any interval is cleared (though not used currently)
        const endTime = Date.now();
        const durationMs = endTime - bookReadingStartTime;

        const book = books.find(b => b.id === bookId);
        if (book && durationMs > 5000) { // Only record sessions longer than 5 seconds
            book.readingSessions.push({
                startTime: bookReadingStartTime,
                endTime: endTime,
                durationMs: durationMs
            });
            saveData('books', books);
            showToast(`Recorded ${formatDuration(durationMs)} for "${book.title}".`, 'success');
        } else if (durationMs <= 5000) {
            showToast('Reading session was too short to record (>5s required).', 'info');
        }

        currentReadingBookId = null;
        bookReadingStartTime = 0;
        updateBookButtonsState();
        renderBooks();
        updateBookStatistics();
    }

    function updateBookButtonsState() {
        document.querySelectorAll('.book-item').forEach(bookItem => {
            const bookId = bookItem.dataset.id;
            const startBtn = bookItem.querySelector('.start-reading');
            const stopBtn = bookItem.querySelector('.stop-reading');
            if (startBtn && stopBtn) {
                startBtn.disabled = currentReadingBookId !== null;
                stopBtn.disabled = currentReadingBookId !== bookId;
            }
        });
    }

    function renderBooks(filterText = '') {
        elements.booksList.innerHTML = '';
        elements.dashCurrentReadingList.innerHTML = ''; // Clear dashboard current reading

        const filteredBooks = books.filter(book => {
            const lowerCaseFilter = filterText.toLowerCase();
            return book.title.toLowerCase().includes(lowerCaseFilter) ||
                   book.author.toLowerCase().includes(lowerCaseFilter) ||
                   book.genre.toLowerCase().includes(lowerCaseFilter);
        }).sort((a,b) => a.title.localeCompare(b.title)); // Sort alphabetically

        if (filteredBooks.length === 0 && filterText === '') {
            elements.booksList.innerHTML = '<li class="info-message">No spiritual books added yet. Add your first scroll of wisdom!</li>';
        } else if (filteredBooks.length === 0 && filterText !== '') {
            elements.booksList.innerHTML = `<li class="info-message">No books matching "${filterText}".</li>`;
        }

        filteredBooks.forEach(book => {
            const li = document.createElement('li');
            li.className = 'book-item';
            li.dataset.id = book.id;

            const totalReadingMs = book.readingSessions.reduce((sum, session) => sum + session.durationMs, 0);
            const progress = book.totalPages > 0 ? ((book.currentPage / book.totalPages) * 100).toFixed(1) : 0;
            const coverSrc = book.coverImage || './img/default_book.png'; // Fallback to default image

            li.innerHTML = `
                <img src="${coverSrc}" alt="Book Cover of ${book.title}" class="book-cover-thumbnail">
                <div class="book-item-info">
                    <strong>${book.title}</strong>
                    <span>by ${book.author} | ${book.genre || 'N/A'}</span>
                    <span>Status: ${book.status} | Progress: ${book.currentPage}/${book.totalPages} (${progress}%)</span>
                    <span>Total Read: ${formatDuration(totalReadingMs)}</span>
                </div>
                <div class="book-item-controls">
                    <button class="start-reading btn-sm" data-book-id="${book.id}" title="Start Reading" aria-label="Start reading ${book.title}">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="stop-reading btn-sm" data-book-id="${book.id}" title="Stop Reading" aria-label="Stop reading ${book.title}">
                        <i class="fas fa-stop"></i>
                    </button>
                    <button class="view-book-details btn-sm" data-book-id="${book.id}" title="View Details & Notes" aria-label="View details for ${book.title}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="delete-book delete-button btn-sm" data-book-id="${book.id}" title="Delete Book" aria-label="Delete ${book.title}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            elements.booksList.appendChild(li);
        });

        // Dashboard: Currently Reading (limit to 2)
        const currentlyReadingBooks = books.filter(book => book.status === 'Reading').slice(0, 2);
        if (currentlyReadingBooks.length > 0) {
            currentlyReadingBooks.forEach(book => {
                const li = document.createElement('li');
                const progress = book.totalPages > 0 ? ((book.currentPage / book.totalPages) * 100).toFixed(1) : 0;
                li.innerHTML = `
                    <span><strong>${book.title}</strong> by ${book.author}</span>
                    <span>Progress: ${progress}%</span>
                `;
                elements.dashCurrentReadingList.appendChild(li);
            });
        } else {
            elements.dashCurrentReadingList.innerHTML = '<li class="info-message">No books currently being read.</li>';
        }

        updateBookButtonsState(); // Set initial button states after rendering
    }

    function deleteBook(bookId) {
        if (currentReadingBookId === bookId) {
            showToast('Cannot delete a book while it is being read. Please stop the timer first.', 'error');
            return;
        }
        showConfirmationModal('Are you sure you want to delete this book and all its reading records? This action cannot be undone.', () => {
            books = books.filter(book => book.id !== bookId);
            saveData('books', books);
            renderBooks();
            updateBookStatistics();
            updateAchievements();
            updateGoals();
            showToast('Book deleted successfully!', 'success');
            closeModal(elements.confirmationModal);
        });
    }

    function openBookDetailsModal(bookId) {
        const book = books.find(b => b.id === bookId);
        if (!book) return;

        elements.modalBookCoverImg.src = book.coverImage || './img/default_book.png';
        elements.modalBookTitle.textContent = book.title;
        elements.modalBookAuthor.textContent = book.author;
        elements.modalBookGenre.textContent = book.genre || 'N/A';
        
        elements.modalBookTotalPages.textContent = book.totalPages;
        elements.modalBookCurrentPage.value = book.currentPage;

        const totalReadingMs = book.readingSessions.reduce((sum, s) => sum + s.durationMs, 0);
        elements.modalBookTotalReadingTime.textContent = formatDuration(totalReadingMs);

        // Update progress bar and text
        const updateProgressDisplay = () => {
            const progress = book.totalPages > 0 ? ((book.currentPage / book.totalPages) * 100).toFixed(1) : 0;
            elements.modalBookProgress.textContent = `${progress}%`;
            elements.modalProgressBar.style.width = `${progress}%`;
            elements.modalProgressBar.ariaValueNow = progress;
        };
        updateProgressDisplay();

        elements.modalBookCurrentPage.onchange = (e) => {
            const newPage = parseInt(e.target.value, 10);
            if (!isNaN(newPage) && newPage >= 0 && newPage <= book.totalPages) {
                book.currentPage = newPage;
                saveData('books', books);
                updateProgressDisplay();
                renderBooks(); // Re-render main list to update progress
                updateAchievements();
                updateGoals();
            } else {
                e.target.value = book.currentPage; // Revert to previous valid page
                showToast(`Invalid page number! Must be between 0 and ${book.totalPages}.`, 'error');
            }
        };

        // Render Rating Stars
        elements.modalBookRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star ${i <= book.rating ? 'active' : ''}`;
            star.dataset.rating = i;
            star.setAttribute('role', 'radio');
            star.setAttribute('aria-label', `${i} stars`);
            star.setAttribute('aria-checked', i <= book.rating ? 'true' : 'false');
            star.tabIndex = 0; // Make stars keyboard navigable
            star.onclick = () => {
                book.rating = i;
                saveData('books', books);
                openBookDetailsModal(bookId); // Re-render stars
                showToast(`Rated "${book.title}" ${i} stars.`, 'info');
            };
            // Add keyboard navigation for stars
            star.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    book.rating = i;
                    saveData('books', books);
                    openBookDetailsModal(bookId); // Re-render stars
                    showToast(`Rated "${book.title}" ${i} stars.`, 'info');
                }
            });
            elements.modalBookRating.appendChild(star);
        }

        // Dropdown for Status
        const statusSelect = document.createElement('select');
        statusSelect.className = 'input-field small-input';
        statusSelect.setAttribute('aria-label', `Change status for ${book.title}`);
        ['Reading', 'Finished', 'Want to Read'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (book.status === status) option.selected = true;
            statusSelect.appendChild(option);
        });
        statusSelect.onchange = (e) => {
            book.status = e.target.value;
            saveData('books', books);
            renderBooks(); // Update status in main list
            updateAchievements(); // Check for 'Books Finished' achievement
            updateGoals();
            showToast(`Status for "${book.title}" changed to "${book.status}".`, 'info');
        };
        elements.modalBookStatusContainer.innerHTML = ''; // Clear previous content
        elements.modalBookStatusContainer.appendChild(statusSelect);


        elements.modalBookNotesInput.value = ''; // Clear input for new note
        renderBookNotes(book);

        elements.addBookNoteBtn.onclick = () => {
            const noteText = elements.modalBookNotesInput.value.trim();
            if (noteText) {
                book.notes.push({ id: generateId(), text: noteText, date: new Date().toISOString() });
                saveData('books', books);
                elements.modalBookNotesInput.value = '';
                renderBookNotes(book);
                updateAchievements(); // Check for 'first_book_note' achievement
                showToast('Note added!', 'success');
            } else {
                showToast('Note cannot be empty!', 'warning');
            }
        };

        openModal(elements.bookDetailsModal);
    }

    function renderBookNotes(book) {
        elements.modalBookNotesList.innerHTML = '';
        if (book.notes.length === 0) {
            elements.modalBookNotesList.innerHTML = '<li class="info-message">No notes yet. Add your insights!</li>';
            return;
        }

        book.notes.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(note => { // Newest first
            const li = document.createElement('li');
            li.className = 'note-item';
            li.innerHTML = `
                <div class="note-content">${note.text}</div>
                <span class="note-date">${new Date(note.date).toLocaleDateString()} ${new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <button class="delete-note-btn delete-button btn-sm" data-note-id="${note.id}" aria-label="Delete note"><i class="fas fa-times"></i></button>
            `;
            elements.modalBookNotesList.appendChild(li);
        });

        elements.modalBookNotesList.querySelectorAll('.delete-note-btn').forEach(btn => {
            btn.onclick = (e) => {
                const noteId = e.currentTarget.dataset.noteId;
                book.notes = book.notes.filter(n => n.id !== noteId);
                saveData('books', books);
                renderBookNotes(book);
                showToast('Note deleted.', 'info');
            };
        });
    }

    // --- Statistics & Charts ---

    // Helper to get CSS variable for chart colors
    function getCssVar(name) {
        return getComputedStyle(document.body).getPropertyValue(name).trim();
    }

    function createOrUpdateChart(chartVar, canvasId, type, data, options) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (chartVar) {
            chartVar.destroy(); // Destroy previous chart instance
        }
        return new Chart(ctx, { type, data, options });
    }

    function renderMeditationCharts() {
        const textColor = getCssVar('--text-color');
        const primaryColor = getCssVar('--primary-color');
        const secondaryColor = getCssVar('--secondary-color');
        const accentColor = getCssVar('--accent-color');
        const borderColor = getCssVar('--border-color');
        const cardBg = getCssVar('--card-background');
        const secondaryColorAlpha = getCssVar('--secondary-color-alpha');


        // Common chart options
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor } },
                tooltip: {
                    bodyColor: textColor,
                    titleColor: primaryColor,
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    borderWidth: 1,
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'day', tooltipFormat: 'MMM d, yyyy' },
                    title: { display: true, text: 'Date', color: primaryColor },
                    ticks: { color: textColor },
                    grid: { color: borderColor }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Value', color: primaryColor },
                    ticks: { color: textColor },
                    grid: { color: borderColor }
                }
            }
        };

        // Data for Meditation Time Trend (Daily)
        const dailyMedTime = {};
        meditationSessions.forEach(session => {
            const date = new Date(session.startTime).toISOString().slice(0, 10);
            dailyMedTime[date] = (dailyMedTime[date] || 0) + session.durationMs;
        });
        const sortedDates = Object.keys(dailyMedTime).sort();
        const medTimeData = sortedDates.map(date => ({ x: date, y: dailyMedTime[date] / (1000 * 60) })); // Minutes

        meditationTimeChart = createOrUpdateChart(meditationTimeChart, 'meditationTimeChart', 'line', {
            datasets: [{
                label: 'Daily Meditation Time (minutes)',
                data: medTimeData,
                borderColor: secondaryColor,
                tension: 0.3,
                fill: true,
                backgroundColor: secondaryColorAlpha, // Use alpha version of secondary
                pointRadius: 3,
                pointHoverRadius: 6
            }]
        }, { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, title: { display: true, text: 'Minutes' } } } });

        // Data for Meditation Session Count
        const dailySessionCount = {};
        meditationSessions.forEach(session => {
            const date = new Date(session.startTime).toISOString().slice(0, 10);
            dailySessionCount[date] = (dailySessionCount[date] || 0) + 1;
        });
        const sessionCountData = sortedDates.map(date => ({ x: date, y: dailySessionCount[date] }));

        meditationSessionsChart = createOrUpdateChart(meditationSessionsChart, 'meditationSessionsChart', 'bar', {
            datasets: [{
                label: 'Daily Meditation Sessions',
                data: sessionCountData,
                backgroundColor: primaryColor,
                borderColor: primaryColor,
                borderWidth: 1
            }]
        }, { ...commonOptions, scales: { ...commonOptions.scales, y: { ...commonOptions.scales.y, title: { display: true, text: 'Sessions' }, ticks: { precision: 0 } } } });

        // Mood Distribution Chart
        const moodCounts = {};
        meditationSessions.forEach(session => {
            if (session.mood) {
                moodCounts[session.mood] = (moodCounts[session.mood] || 0) + 1;
            }
        });
        const moodLabels = Object.keys(moodCounts);
        const moodData = Object.values(moodCounts);
        const moodColors = moodLabels.map(mood => { // Assign consistent colors
            switch (mood) {
                case 'calm': return '#66bb6a'; // Light Green
                case 'focused': return '#42a5f5'; // Light Blue
                case 'peaceful': return '#ab47bc'; // Purple
                case 'energetic': return '#ffee58'; // Yellow
                case 'tired': return '#9e9e9e'; // Grey
                case 'anxious': return '#ef5350'; // Red
                case 'happy': return '#ffca28'; // Amber
                default: return '#CCCCCC';
            }
        });

        moodDistributionChart = createOrUpdateChart(moodDistributionChart, 'moodDistributionChart', 'pie', {
            labels: moodLabels,
            datasets: [{
                data: moodData,
                backgroundColor: moodColors,
                borderColor: cardBg,
                borderWidth: 2
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: textColor } },
                title: { display: true, text: 'Mood Distribution', color: primaryColor },
                tooltip: {
                    bodyColor: textColor,
                    titleColor: primaryColor,
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed;
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
                                label += ` (${percentage})`;
                            }
                            return label;
                        }
                    }
                }
            }
        });

        // Top Tags Chart
        const tagCounts = {};
        meditationSessions.forEach(session => {
            if (session.tags) {
                session.tags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a).slice(0, 10); // Top 10
        const tagLabels = sortedTags.map(([tag]) => tag);
        const tagData = sortedTags.map(([, count]) => count);

        topTagsChart = createOrUpdateChart(topTagsChart, 'topTagsChart', 'bar', {
            labels: tagLabels,
            datasets: [{
                label: 'Tag Usage',
                data: tagData,
                backgroundColor: accentColor,
                borderColor: accentColor,
                borderWidth: 1
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontal bars
            plugins: {
                legend: { labels: { color: textColor } },
                title: { display: true, text: 'Top Meditation Tags', color: primaryColor },
                tooltip: {
                    bodyColor: textColor,
                    titleColor: primaryColor,
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    borderWidth: 1,
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Count', color: primaryColor },
                    ticks: { precision: 0, color: textColor },
                    grid: { color: borderColor }
                },
                y: {
                    title: { display: true, text: 'Tag', color: primaryColor },
                    ticks: { color: textColor },
                    grid: { color: borderColor }
                }
            }
        });
    }

    function updateBookStatistics() {
        const textColor = getCssVar('--text-color');
        const primaryColor = getCssVar('--primary-color');
        const secondaryColor = getCssVar('--secondary-color');
        const borderColor = getCssVar('--border-color');
        const cardBg = getCssVar('--card-background');


        // Book Reading Time Chart
        const bookReadingTotals = {};
        books.forEach(book => {
            bookReadingTotals[book.title] = book.readingSessions.reduce((sum, s) => sum + s.durationMs, 0) / (1000 * 60 * 60); // Hours
        });
        const sortedBookData = Object.entries(bookReadingTotals).sort(([, a], [, b]) => b - a).filter(([, time]) => time > 0);
        const bookLabels = sortedBookData.map(([title]) => title);
        const bookData = sortedBookData.map(([, time]) => time);

        bookReadingTimeChart = createOrUpdateChart(bookReadingTimeChart, 'bookReadingTimeChart', 'bar', {
            labels: bookLabels,
            datasets: [{
                label: 'Total Reading Time (hours)',
                data: bookData,
                backgroundColor: secondaryColor,
                borderColor: secondaryColor,
                borderWidth: 1
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor } },
                title: { display: true, text: 'Book Reading Time by Book', color: primaryColor },
                tooltip: {
                    bodyColor: textColor,
                    titleColor: primaryColor,
                    backgroundColor: cardBg,
                    borderColor: borderColor,
                    borderWidth: 1,
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Book Title', color: primaryColor },
                    ticks: { color: textColor },
                    grid: { color: borderColor }
                },
                y: {
                    title: { display: true, text: 'Hours', color: primaryColor },
                    ticks: { color: textColor },
                    grid: { color: borderColor }
                }
            }
        });
    }

    function renderMeditationCalendar() {
        elements.meditationCalendar.innerHTML = '';
        const meditatedDays = new Set(meditationSessions.map(s => new Date(s.startTime).toDateString()));

        const today = new Date();
        today.setHours(0,0,0,0);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Header for the current month
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
        elements.meditationCalendar.appendChild(header);

        // Day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const div = document.createElement('div');
            div.className = 'calendar-day-name';
            div.textContent = day;
            elements.meditationCalendar.appendChild(div);
        });

        // Days of the month
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday...

        // Empty cells for days before the 1st
        for (let i = 0; i < startDayOfWeek; i++) {
            const div = document.createElement('div');
            div.className = 'calendar-day empty';
            elements.meditationCalendar.appendChild(div);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const date = new Date(currentYear, currentMonth, day);
            date.setHours(0,0,0,0);
            const dateString = date.toDateString();
            const div = document.createElement('div');
            div.className = 'calendar-day';
            div.textContent = day;

            if (meditatedDays.has(dateString)) {
                div.classList.add('meditated');
            }
            if (date.getTime() === today.getTime()) {
                div.classList.add('current-day');
            }
            elements.meditationCalendar.appendChild(div);
        }
    }


    // --- Goals Logic ---

    const GOAL_TYPES = {
        meditation_duration: { label: 'Meditation Duration', unit: 'minutes', getProgress: () => meditationSessions.reduce((sum, s) => sum + s.durationMs, 0) / (1000 * 60) },
        meditation_days: { label: 'Meditation Days', unit: 'days', getProgress: () => new Set(meditationSessions.map(s => s.date)).size },
        books_finished: { label: 'Books Finished', unit: 'books', getProgress: () => books.filter(b => b.status === 'Finished').length }
    };

    function addGoal() {
        const type = elements.goalTypeSelect.value;
        const value = parseInt(elements.goalValueInput.value, 10);
        const period = elements.goalPeriodSelect.value;

        if (isNaN(value) || value <= 0) {
            showToast('Please enter a valid target value for your goal (must be a positive number).', 'error');
            return;
        }

        const newGoal = {
            id: generateId(),
            type: type,
            targetValue: value,
            period: period,
            currentProgress: 0, // Will be calculated by updateGoals
            completed: false,
            startDate: new Date().toISOString(),
            lastUpdate: null // Will be set on completion
        };
        goals.push(newGoal);
        saveData('goals', goals);
        elements.goalValueInput.value = '';
        renderGoals();
        updateGoals();
        showToast('Goal added successfully!', 'success');
    }

    function updateGoals() {
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday (adjust if your week starts on Monday)
        startOfThisWeek.setHours(0,0,0,0);

        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startOfThisMonth.setHours(0,0,0,0);

        let changed = false;

        goals.forEach(goal => {
            if (goal.completed) return;

            let relevantMeditations = [];
            let relevantBooks = [];
            let currentProgress = 0;

            if (goal.period === 'week') {
                relevantMeditations = meditationSessions.filter(s => new Date(s.startTime) >= startOfThisWeek);
                relevantBooks = books; // Currently, book goals are overall, not per week/month
            } else if (goal.period === 'month') {
                relevantMeditations = meditationSessions.filter(s => new Date(s.startTime) >= startOfThisMonth);
                relevantBooks = books;
            } else { // 'overall'
                relevantMeditations = meditationSessions;
                relevantBooks = books;
            }

            if (goal.type === 'meditation_duration') {
                currentProgress = relevantMeditations.reduce((sum, s) => sum + s.durationMs, 0) / (1000 * 60);
            } else if (goal.type === 'meditation_days') {
                currentProgress = new Set(relevantMeditations.map(s => new Date(s.startTime).toDateString())).size;
            } else if (goal.type === 'books_finished') {
                currentProgress = relevantBooks.filter(b => b.status === 'Finished').length;
            }

            // Check if progress actually changed before updating
            if (goal.currentProgress !== currentProgress) {
                goal.currentProgress = currentProgress;
                changed = true;
            }

            if (goal.currentProgress >= goal.targetValue && !goal.completed) {
                goal.completed = true;
                goal.lastUpdate = new Date().toISOString(); // Mark completion date
                showToast(`Goal Completed: ${GOAL_TYPES[goal.type].label} of ${goal.targetValue} ${GOAL_TYPES[goal.type].unit} ${goal.period === 'overall' ? '' : 'per ' + goal.period}!`, 'success');
                changed = true;
            }
        });

        if (changed) {
            saveData('goals', goals);
            renderGoals();
        }
    }

    function renderGoals() {
        elements.activeGoalsList.innerHTML = '';
        elements.completedGoalsList.innerHTML = '';

        const activeGoals = goals.filter(g => !g.completed);
        const completedGoals = goals.filter(g => g.completed);

        if (activeGoals.length === 0 && completedGoals.length === 0) {
            elements.activeGoalsList.innerHTML = '<li class="info-message">No goals set yet. Set a goal to start tracking your progress!</li>';
            return;
        }

        activeGoals.forEach(goal => {
            const li = document.createElement('li');
            li.className = 'goal-item';
            const progress = Math.min(100, (goal.currentProgress / goal.targetValue) * 100).toFixed(1);
            li.innerHTML = `
                <div>
                    <strong>${GOAL_TYPES[goal.type].label}: ${goal.currentProgress.toFixed(1)} / ${goal.targetValue} ${GOAL_TYPES[goal.type].unit} ${goal.period === 'overall' ? '' : 'per ' + goal.period}</strong>
                    <div class="goal-progress-bar-container" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                        <div class="goal-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <span>Progress: ${progress}%</span>
                </div>
                <button class="delete-goal-btn delete-button btn-sm" data-id="${goal.id}" title="Delete Goal" aria-label="Delete goal: ${GOAL_TYPES[goal.type].label} ${goal.targetValue} ${GOAL_TYPES[goal.type].unit}"></button>
            `;
            elements.activeGoalsList.appendChild(li);
        });

        completedGoals.forEach(goal => {
            const li = document.createElement('li');
            li.className = 'goal-item completed';
            li.innerHTML = `
                <div>
                    <strong>${GOAL_TYPES[goal.type].label}: ${goal.targetValue} ${GOAL_TYPES[goal.type].unit} ${goal.period === 'overall' ? '' : 'per ' + goal.period}</strong>
                    <div class="goal-progress-bar-container" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                        <div class="goal-progress-bar" style="width: 100%"></div>
                    </div>
                    <span>Completed on: ${new Date(goal.lastUpdate).toLocaleDateString()}</span>
                </div>
                <button class="delete-goal-btn delete-button btn-sm" data-id="${goal.id}" title="Delete Goal" aria-label="Delete completed goal: ${GOAL_TYPES[goal.type].label} ${goal.targetValue} ${GOAL_TYPES[goal.type].unit}"></button>
            `;
            elements.completedGoalsList.appendChild(li);
        });

        document.querySelectorAll('.delete-goal-btn').forEach(btn => {
            btn.onclick = (e) => deleteGoal(e.currentTarget.dataset.id);
        });
    }

    function deleteGoal(goalId) {
        showConfirmationModal('Are you sure you want to delete this goal? This action cannot be undone.', () => {
            goals = goals.filter(g => g.id !== goalId);
            saveData('goals', goals);
            renderGoals();
            showToast('Goal deleted.', 'info');
            closeModal(elements.confirmationModal);
        });
    }


    // --- Achievements Logic ---

    function updateAchievements() {
        let changed = false;
        achievementsList.forEach(achievement => {
            if (!achievement.unlocked && achievement.check()) { // Call the check function
                achievement.unlocked = true;
                changed = true;
                showToast(`Achievement Unlocked: ${achievement.name}!`, 'success');
            }
        });
        if (changed) {
            // Save only id and unlocked status
            saveData('achievementsListStatus', achievementsList.map(a => ({ id: a.id, unlocked: a.unlocked })));
            renderAchievements();
        }
    }

    function renderAchievements() {
        elements.achievementsGrid.innerHTML = '';
        achievementsList.forEach(achievement => {
            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
            card.setAttribute('aria-label', achievement.unlocked ? `Achievement unlocked: ${achievement.name}. ${achievement.description}` : `Achievement locked: ${achievement.name}. ${achievement.description}`);
            card.innerHTML = `
                <i class="${achievement.icon}" aria-hidden="true"></i>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            `;
            elements.achievementsGrid.appendChild(card);
        });
    }

    // --- Settings Logic ---

    function applySettings() {
        document.body.className = `${settings.theme}-theme`; // Set theme class
        elements.themeSelector.value = settings.theme;
        elements.dailyReminderTimeInput.value = settings.dailyReminderTime;

        if (settings.customBackground) {
            document.body.style.backgroundImage = `url(${settings.customBackground})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundPosition = 'center center';
        } else {
            document.body.style.backgroundImage = '';
        }
        // Re-render charts to pick up new theme colors
        if (document.getElementById('statistics-section').classList.contains('active-section')) {
             renderMeditationCharts();
             updateBookStatistics();
        }
    }

    function saveSettings() {
        settings.theme = elements.themeSelector.value;
        settings.dailyReminderTime = elements.dailyReminderTimeInput.value;

        saveData('settings', settings);
        applySettings();
        showToast('Settings saved!', 'info');
    }

    let reminderTimeoutId = null; // Use timeout for initial, then interval for repeats
    let reminderIntervalId = null;

    function setDailyReminder() {
        // Clear any existing reminders first
        clearDailyReminder();

        if (!settings.dailyReminderTime) {
            showToast('Please select a time for the reminder.', 'error');
            return;
        }

        if (!('Notification' in window)) {
            showToast('This browser does not support desktop notifications.', 'error');
            return;
        }

        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    scheduleReminder();
                } else {
                    showToast('Notification permission denied. Cannot set reminder.', 'warning');
                }
            });
        } else if (Notification.permission === 'granted') {
            scheduleReminder();
        } else { // Permission denied or blocked
            showToast('Notification permission blocked. Please enable it in browser settings.', 'warning');
        }
    }

    function scheduleReminder() {
        const [hour, minute] = settings.dailyReminderTime.split(':').map(Number);

        const now = new Date();
        let nextReminder = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

        if (nextReminder.getTime() <= now.getTime()) {
            nextReminder.setDate(nextReminder.getDate() + 1); // Schedule for tomorrow
        }

        const timeUntilNextReminder = nextReminder.getTime() - now.getTime();

        reminderTimeoutId = setTimeout(() => {
            new Notification('Yogify Reminder', {
                body: 'Time for your daily meditation!',
                icon: './img/icon.png' // Ensure this path is correct
            });

            // Set interval for subsequent daily reminders (every 24 hours)
            reminderIntervalId = setInterval(() => {
                new Notification('Yogify Reminder', {
                    body: 'Time for your daily meditation!',
                    icon: './img/icon.png'
                });
            }, 24 * 60 * 60 * 1000); // 24 hours
        }, timeUntilNextReminder);

        showToast(`Daily meditation reminder set for ${settings.dailyReminderTime}.`, 'success');
        settings.dailyReminderTime = elements.dailyReminderTimeInput.value; // Save selected time
        saveData('settings', settings);
    }


    function clearDailyReminder() {
        if (reminderTimeoutId) {
            clearTimeout(reminderTimeoutId);
            reminderTimeoutId = null;
        }
        if (reminderIntervalId) {
            clearInterval(reminderIntervalId);
            reminderIntervalId = null;
        }
        settings.dailyReminderTime = '';
        saveData('settings', settings);
        elements.dailyReminderTimeInput.value = '';
        showToast('Daily reminder cleared.', 'info');
    }

    function exportData() {
        const data = {
            meditationSessions: meditationSessions,
            books: books,
            goals: goals,
            settings: settings,
            generalCountdownState: generalCountdownState, // Include countdown state
            achievementsListStatus: achievementsList.map(a => ({ id: a.id, unlocked: a.unlocked }))
        };
        const filename = `yogify_data_${new Date().toISOString().slice(0, 10)}.json`;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Data exported successfully!', 'success');
    }

    function importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                showConfirmationModal('Are you sure you want to import data? This will OVERWRITE your current data!', () => {
                    if (importedData.meditationSessions) meditationSessions = importedData.meditationSessions;
                    if (importedData.books) books = importedData.books;
                    if (importedData.goals) goals = importedData.goals;
                    if (importedData.settings) settings = importedData.settings;
                    if (importedData.generalCountdownState) generalCountdownState = importedData.generalCountdownState; // Import countdown state
                    if (importedData.achievementsListStatus) { // Check for the new key
                        achievementsList = loadAchievementsWithChecks(baseAchievements, importedData.achievementsListStatus);
                    }

                    saveData('meditationSessions', meditationSessions);
                    saveData('books', books);
                    saveData('goals', goals);
                    saveData('settings', settings);
                    saveData('generalCountdownState', generalCountdownState); // Save imported countdown state
                    saveData('achievementsListStatus', achievementsList.map(a => ({ id: a.id, unlocked: a.unlocked })));

                    initializeApp();
                    showToast('Data imported successfully! The page will refresh.', 'success');
                    closeModal(elements.confirmationModal);
                    // A full page reload might be necessary for all changes to take effect due to global state
                    setTimeout(() => window.location.reload(), 1000); 
                });
            } catch (error) {
                showToast('Error importing data: Invalid JSON file. ' + error.message, 'error');
                console.error('Import error:', error);
            } finally {
                event.target.value = ''; // Clear the file input
            }
        };
        reader.readAsText(file);
    }

    function clearAllData() {
        showConfirmationModal('Are you absolutely sure you want to clear ALL your data? This action cannot be undone!', () => {
            localStorage.clear();
            meditationSessions = [];
            books = [];
            goals = [];
            settings = { theme: 'yogify-serene', dailyReminderTime: '', customBackground: null };
            generalCountdownState = { remainingMs: 0, initialMs: 0, paused: false, endTime: 0, label: '', notify: false }; // Reset countdown state
            achievementsList = loadAchievementsWithChecks(baseAchievements, []); // Reset achievements to default unlocked=false
            initializeApp();
            showToast('All data cleared! The page will refresh.', 'success');
            closeModal(elements.confirmationModal);
            setTimeout(() => window.location.reload(), 1000); // Full page reload for complete reset
        });
    }

    function showConfirmationModal(message, onConfirm) {
        elements.confirmationMessage.textContent = message;
        elements.confirmActionBtn.onclick = onConfirm;
        elements.cancelActionBtn.onclick = () => closeModal(elements.confirmationModal);
        openModal(elements.confirmationModal);
    }

    // --- UI Navigation ---
    function showSection(sectionId) {
        elements.appSections.forEach(section => {
            section.classList.remove('active-section');
        });
        document.getElementById(sectionId).classList.add('active-section');

        elements.navButtons.forEach(button => {
            if (button.dataset.section === sectionId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Re-render relevant sections if they were just opened
        if (sectionId === 'dashboard-section') {
            updateDashboard();
        } else if (sectionId === 'meditation-section') {
            renderMeditationSessions();
            loadCountdownState(); // Ensure countdown state is loaded/resumed when section is visible
        } else if (sectionId === 'books-section') {
            renderBooks();
            elements.bookSearchInput.value = ''; // Clear search on section change
        } else if (sectionId === 'statistics-section') {
            renderMeditationCharts();
            updateBookStatistics(); // Updates book chart
            renderMeditationCalendar();
        } else if (sectionId === 'goals-section') {
            renderGoals();
        } else if (sectionId === 'achievements-section') {
            renderAchievements();
        }
    }

    function updateDashboard() {
        updateMeditationStats(); // Populates meditation stats and streaks on dashboard
        elements.dashBooksFinished.textContent = books.filter(b => b.status === 'Finished').length;
        renderMeditationSessions(); // Populates recent meditations on dashboard
        renderBooks(); // Populates currently reading on dashboard
    }

    // --- Event Listeners ---
    elements.startMeditationBtn.addEventListener('click', () => {
        const customMinutes = parseInt(elements.customMeditationMinutesInput.value, 10);
        if (!isNaN(customMinutes) && customMinutes > 0) {
            startMeditationTimer(customMinutes, 'standard');
        } else {
            // If no custom minutes are set or it's 0, treat as freestyle
            startMeditationTimer(0, 'freestyle');
        }
    });

    elements.setCustomMeditationBtn.addEventListener('click', () => {
        const customMinutes = parseInt(elements.customMeditationMinutesInput.value, 10);
        if (isNaN(customMinutes) || customMinutes <= 0) {
            showToast('Please enter a valid custom duration in minutes (e.g., 15).', 'error');
            return;
        }
        showToast(`Custom meditation set for ${customMinutes} minutes. Click Start when ready!`, 'info');
    });

    elements.pauseMeditationBtn.addEventListener('click', pauseMeditationTimer);
    elements.stopMeditationBtn.addEventListener('click', stopMeditationTimer);
    elements.resetMeditationBtn.addEventListener('click', resetMeditationDisplay);

    elements.presetMeditationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const minutes = parseInt(e.target.dataset.minutes, 10);
            elements.customMeditationMinutesInput.value = minutes; // Set custom input field
            showToast(`Meditation preset set for ${minutes} minutes. Click Start when ready!`, 'info');
        });
    });

    elements.openIntervalTimerBtn.addEventListener('click', () => {
        elements.intervalStepsContainer.innerHTML = ''; // Clear existing steps
        addIntervalStep(); // Add first default step
        openModal(elements.intervalTimerModal);
    });
    elements.addIntervalStepBtn.addEventListener('click', addIntervalStep);
    elements.startIntervalMeditationBtn.addEventListener('click', () => {
        const steps = getIntervalStepsFromUI();
        if (steps.length > 0) {
            intervalTimerSteps = steps;
            resetMeditationDisplay();
            closeModal(elements.intervalTimerModal);
            startMeditationTimer(0, 'interval'); // Duration 0 as it's interval controlled
        } else {
            showToast('Please add at least one interval step.', 'warning');
        }
    });

    elements.journalMoodEmojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            elements.journalMoodEmojis.forEach(e => {
                e.classList.remove('selected');
                e.setAttribute('aria-checked', 'false');
            });
            emoji.classList.add('selected');
            emoji.setAttribute('aria-checked', 'true');
        });
        // Add keyboard navigation for mood emojis
        emoji.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                elements.journalMoodEmojis.forEach(el => {
                    el.classList.remove('selected');
                    el.setAttribute('aria-checked', 'false');
                });
                emoji.classList.add('selected');
                emoji.setAttribute('aria-checked', 'true');
            }
        });
    });
    elements.journalEnergyLevel.addEventListener('input', (e) => {
        elements.journalEnergyValue.textContent = e.target.value;
    });

    // General Countdown Timer Event Listeners (New)
    elements.startCountdownBtn.addEventListener('click', startCountdown);
    elements.pauseCountdownBtn.addEventListener('click', pauseCountdown);
    elements.stopCountdownBtn.addEventListener('click', () => stopCountdown(false));
    elements.resetCountdownBtn.addEventListener('click', resetCountdown);
    // Persist changes to label and notify toggle
    elements.countdownLabelInput.addEventListener('input', saveCountdownState);
    elements.countdownNotificationToggle.addEventListener('change', () => {
        if (elements.countdownNotificationToggle.checked && Notification.permission === 'default') {
            Notification.requestPermission(); // Request permission when user enables toggle
        }
        saveCountdownState();
    });
    // Input validation for countdown inputs
    [elements.countdownHoursInput, elements.countdownMinutesInput, elements.countdownSecondsInput].forEach(input => {
        input.addEventListener('input', (e) => {
            let value = parseInt(e.target.value, 10);
            if (isNaN(value) || value < e.target.min) {
                e.target.value = e.target.min;
            } else if (value > e.target.max) {
                e.target.value = e.target.max;
            }
            if (e.target.value.length === 1 && value < 10) { // Pad single digits with leading zero for display in input
                e.target.value = String(value).padStart(2, '0');
            }
            if (e.target.value === '') e.target.value = '00'; // Default to 00 if cleared
            if (generalCountdownInterval === null && !generalCountdownPaused) { // Only update display if not running/paused
                 const h = parseInt(elements.countdownHoursInput.value) || 0;
                 const m = parseInt(elements.countdownMinutesInput.value) || 0;
                 const s = parseInt(elements.countdownSecondsInput.value) || 0;
                 elements.generalCountdownDisplay.textContent = formatTime((h * 3600 + m * 60 + s) * 1000);
            }
            saveCountdownState(); // Save state on input change
        });
         input.addEventListener('blur', (e) => { // Ensure 00 on blur if empty
             if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                 e.target.value = '00';
             }
         });
    });


    elements.addBookBtn.addEventListener('click', addBook);
    elements.uploadBookCoverBtn.addEventListener('click', () => elements.newBookCoverInput.click());
    elements.newBookCoverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500 * 1024) { // 500 KB limit for book covers
                showToast('Book cover image size too large! Max 500KB.', 'error');
                e.target.value = ''; // Clear the input
                newBookCoverBase64 = null;
                elements.uploadBookCoverBtn.innerHTML = '<i class="fas fa-image"></i> Upload Cover Image'; // Reset button text
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                newBookCoverBase64 = reader.result;
                elements.uploadBookCoverBtn.innerHTML = '<i class="fas fa-check"></i> Cover Ready';
                showToast('Book cover selected!', 'info');
            };
            reader.readAsDataURL(file);
        }
    });

    // Event delegation for book actions (start, stop, details, delete)
    elements.booksList.addEventListener('click', (e) => {
        const bookItem = e.target.closest('.book-item');
        if (!bookItem) return;
        const bookId = bookItem.dataset.id;

        if (e.target.classList.contains('start-reading') || e.target.closest('.start-reading')) {
            startBookReading(bookId);
        } else if (e.target.classList.contains('stop-reading') || e.target.closest('.stop-reading')) {
            stopBookReading(bookId);
        } else if (e.target.classList.contains('view-book-details') || e.target.closest('.view-book-details')) {
            openBookDetailsModal(bookId);
        } else if (e.target.classList.contains('delete-book') || e.target.closest('.delete-book')) {
            deleteBook(bookId);
        }
    });


    elements.bookSearchInput.addEventListener('input', (e) => renderBooks(e.target.value));
    elements.clearBookSearchBtn.addEventListener('click', () => {
        elements.bookSearchInput.value = '';
        renderBooks();
    });

    elements.addGoalBtn.addEventListener('click', addGoal);

    elements.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            showSection(button.dataset.section);
        });
    });

    elements.closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(document.getElementById(e.currentTarget.dataset.modal));
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === elements.meditationJournalModal) closeModal(elements.meditationJournalModal);
        if (event.target === elements.bookDetailsModal) closeModal(elements.bookDetailsModal);
        if (event.target === elements.intervalTimerModal) closeModal(elements.intervalTimerModal);
        if (event.target === elements.confirmationModal) closeModal(elements.confirmationModal);
    });

    // Settings listeners
    elements.themeSelector.addEventListener('change', saveSettings);
    elements.setDailyReminderBtn.addEventListener('click', setDailyReminder);
    elements.clearDailyReminderBtn.addEventListener('click', clearDailyReminder);

    elements.uploadCustomBackgroundBtn.addEventListener('click', () => elements.customBackgroundFileInput.click());
    elements.customBackgroundFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1 MB limit for background
                showToast('Background image size too large! Max 1MB.', 'error');
                e.target.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                settings.customBackground = reader.result;
                saveSettings();
                showToast('Custom background applied!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    elements.clearCustomBackgroundBtn.addEventListener('click', () => {
        settings.customBackground = null;
        saveSettings();
        showToast('Custom background cleared.', 'info');
    });

    elements.exportDataBtn.addEventListener('click', exportData);
    elements.importDataBtn.addEventListener('click', () => elements.importDataFile.click());
    elements.importDataFile.addEventListener('change', importData);
    elements.clearAllDataBtn.addEventListener('click', clearAllData);


    // --- Initialization ---
    async function initializeApp() {
        applySettings(); // This will apply the theme
        updateMeditationButtonStates(false, true, true);
        renderMeditationSessions();
        updateMeditationStats();
        renderBooks();
        updateBookStatistics(); // Call to initialize book charts
        renderGoals();
        updateGoals(); // Initial goal check
        updateAchievements(); // Achievements should be updated *after* other data
        renderAchievements();

        if (settings.dailyReminderTime) {
            setDailyReminder(); // Re-schedule reminder on load
        }
        
        // Load countdown state only if the meditation section is active
        // Otherwise, it will be loaded when the section is shown via showSection()
        if (document.getElementById('meditation-section').classList.contains('active-section')) {
            loadCountdownState();
        } else {
            // Otherwise, initialize the inputs with values from localStorage if they exist, but don't start the timer.
            // This ensures inputs reflect last saved state even if not running.
            const h = Math.floor(generalCountdownState.initialMs / (1000 * 60 * 60));
            const m = Math.floor((generalCountdownState.initialMs % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((generalCountdownState.initialMs % (1000 * 60)) / 1000);
            elements.countdownHoursInput.value = h > 0 ? String(h).padStart(2, '0') : '00';
            elements.countdownMinutesInput.value = m > 0 ? String(m).padStart(2, '0') : '00';
            elements.countdownSecondsInput.value = s > 0 ? String(s).padStart(2, '0') : '00';
            elements.generalCountdownDisplay.textContent = formatTime(generalCountdownState.initialMs || 0); // Display initial duration
            elements.countdownLabelInput.value = generalCountdownState.label;
            elements.countdownNotificationToggle.checked = generalCountdownState.notify;
            updateCountdownButtonStates(false, false); // Ensure buttons are reset
        }

        showSection('dashboard-section'); // Show dashboard by default

        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    initializeApp();
});