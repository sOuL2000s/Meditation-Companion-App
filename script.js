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
        meditationSessionsList: document.getElementById('meditation-sessions-list'),
        openIntervalTimerBtn: document.getElementById('open-interval-timer-btn'),
        ambientSoundSelector: document.getElementById('ambient-sound-selector'),
        ambientVolumeControl: document.getElementById('ambient-volume'),
        
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
        bellSoundToggle: document.getElementById('bell-sound-toggle'),
        bellVolumeControl: document.getElementById('bell-volume'),
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
        modalBookStatus: document.getElementById('modal-book-status'),
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
    let meditationType = 'standard'; // 'standard' or 'interval'
    let currentIntervalIndex = 0;
    let intervalTimerSteps = []; // [{duration, sound, label}]

    let currentReadingBookId = null;
    let bookReadingTimerInterval;
    let bookReadingStartTime = 0;

    // --- Data Structures (Persisted in localStorage) ---
    // meditationSessions: [{ id, startTime, endTime, durationMs, date, journalEntry?, mood?, energy?, tags?, type? }]
    let meditationSessions = loadData('meditationSessions', []);

    // books: [{ id, title, author, totalPages, currentPage, readingSessions: [{ startTime, endTime, durationMs }], notes: [{ id, text, date }], coverImage?, status?, rating?, genre? }]
    let books = loadData('books', []);

    // goals: [{ id, type, value, period, currentProgress, completed, startDate, endDate? }]
    let goals = loadData('goals', []);

    // settings: { theme, bellSound, bellVolume, ambientSound, ambientVolume, dailyReminderTime, customBackground }
    let settings = loadData('settings', {
        theme: 'light',
        bellSound: true,
        bellVolume: 0.5,
        ambientSound: 'none',
        ambientVolume: 0.5,
        dailyReminderTime: '',
        customBackground: null
    });

    // --- Audio Context & Buffers ---
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const soundBuffers = {}; // To store loaded audio buffers
    const ambientSoundSources = {}; // To store active ambient sound sources
    let bellSoundVolumeNode, ambientSoundVolumeNode;

    const BELL_SOUND_URL = 'https://freesound.org/data/previews/203/203061_2112423-lq.mp3'; // Example bell
    const AMBIENT_SOUND_URLS = {
        rain: 'https://freesound.org/data/previews/25/25010_25086-lq.mp3', // Example rain
        forest: 'https://freesound.org/data/previews/140/140645_1955038-lq.mp3', // Example forest birds
        ocean: 'https://freesound.org/data/previews/165/165780_2984100-lq.mp3', // Example ocean waves
        chimes: 'https://freesound.org/data/previews/131/131652_2415714-lq.mp3' // Example wind chimes
    };

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
        modalElement.style.display = 'block';
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
     * @param {string} type 'success', 'error', 'info'
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        let icon = '';
        if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
        else if (type === 'error') icon = '<i class="fas fa-exclamation-triangle"></i>';
        else icon = '<i class="fas fa-info-circle"></i>';

        toast.innerHTML = `${icon} <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10); // Small delay to trigger transition

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 3000);
    }

    // --- Audio Functions ---
    async function loadSound(url, name) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            soundBuffers[name] = await audioContext.decodeAudioData(arrayBuffer);
            // console.log(`Sound ${name} loaded.`);
        } catch (error) {
            console.error(`Error loading sound ${name}:`, error);
            showToast(`Could not load sound: ${name}.`, 'error');
        }
    }

    function playSound(buffer, volumeNode, loop = false) {
        if (!buffer) return null;

        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;
        source.connect(volumeNode);
        volumeNode.connect(audioContext.destination);
        source.start(0);
        return source;
    }

    function stopSound(source) {
        if (source) {
            try {
                source.stop();
                source.disconnect();
            } catch (e) {
                // Already stopped or disconnected
            }
        }
    }

    function updateVolumeNodes() {
        if (!bellSoundVolumeNode) {
            bellSoundVolumeNode = audioContext.createGain();
            ambientSoundVolumeNode = audioContext.createGain();
        }
        bellSoundVolumeNode.gain.value = settings.bellSound ? settings.bellVolume : 0;
        ambientSoundVolumeNode.gain.value = settings.ambientVolume;
    }

    function stopAllAmbientSounds() {
        for (const key in ambientSoundSources) {
            stopSound(ambientSoundSources[key]);
            delete ambientSoundSources[key];
        }
    }

    function startAmbientSound(soundName) {
        stopAllAmbientSounds();
        if (soundName !== 'none' && soundBuffers[soundName]) {
            ambientSoundSources[soundName] = playSound(soundBuffers[soundName], ambientSoundVolumeNode, true);
        }
    }


    // --- Meditation Logic ---

    function startMeditationTimer(durationMinutes = 0, type = 'standard') {
        if (meditationTimerInterval) return;

        meditationDurationTarget = durationMinutes * 60 * 1000;
        meditationType = type;

        if (!meditationPaused) {
            meditationStartTime = Date.now();
            meditationElapsedTime = 0;
            currentIntervalIndex = 0; // Reset for new session
        } else {
            meditationStartTime = Date.now() - meditationElapsedTime;
            meditationPaused = false;
        }

        updateMeditationButtonStates(true, false, false);
        startAmbientSound(settings.ambientSound);

        meditationTimerInterval = setInterval(() => {
            meditationElapsedTime = Date.now() - meditationStartTime;
            elements.meditationTimerDisplay.textContent = formatTime(meditationElapsedTime);

            if (meditationType === 'standard' && meditationDurationTarget > 0 && meditationElapsedTime >= meditationDurationTarget) {
                stopMeditationTimer();
                playSound(soundBuffers['bell'], bellSoundVolumeNode);
                showToast('Meditation session completed!', 'success');
            } else if (meditationType === 'interval' && intervalTimerSteps.length > 0) {
                const totalIntervalDuration = intervalTimerSteps.slice(0, currentIntervalIndex + 1).reduce((sum, step) => sum + (step.duration * 1000), 0);

                if (meditationElapsedTime >= totalIntervalDuration) {
                    currentIntervalIndex++;
                    if (currentIntervalIndex < intervalTimerSteps.length) {
                        const nextStep = intervalTimerSteps[currentIntervalIndex];
                        playSound(soundBuffers[nextStep.sound], bellSoundVolumeNode);
                        showToast(`Next Interval: ${nextStep.label} (${nextStep.duration}s)`, 'info');
                    } else {
                        stopMeditationTimer();
                        playSound(soundBuffers['bell'], bellSoundVolumeNode);
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
        stopAllAmbientSounds();
        showToast('Meditation paused.', 'info');
    }

    function stopMeditationTimer() {
        if (!meditationTimerInterval && !meditationPaused) return;

        clearInterval(meditationTimerInterval);
        meditationTimerInterval = null;
        stopAllAmbientSounds();

        const durationMs = meditationElapsedTime;

        if (durationMs > 5000) {
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
            showToast('Meditation session was too short to record (>5s required).', 'info');
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
        stopAllAmbientSounds();
        elements.meditationTimerDisplay.textContent = '00:00:00';
        updateMeditationButtonStates(false, true, true);
    }

    function updateMeditationButtonStates(isTimerRunning, isTimerPaused, isTimerReset) {
        elements.startMeditationBtn.disabled = isTimerRunning && !isTimerPaused;
        elements.pauseMeditationBtn.disabled = !isTimerRunning || isTimerPaused;
        elements.stopMeditationBtn.disabled = !isTimerRunning && !isTimerPaused;
        elements.resetMeditationBtn.disabled = !isTimerRunning && !isTimerPaused;
        elements.presetMeditationButtons.forEach(btn => btn.disabled = isTimerRunning);
        elements.openIntervalTimerBtn.disabled = isTimerRunning;
    }

    function renderMeditationSessions() {
        elements.meditationSessionsList.innerHTML = ''; // Clear all
        elements.dashMeditationSessionsList.innerHTML = ''; // Clear dashboard

        const sortedSessions = [...meditationSessions].sort((a, b) => b.startTime - a.startTime);

        if (sortedSessions.length === 0) {
            elements.meditationSessionsList.innerHTML = '<li>No meditation sessions recorded yet. Start your journey!</li>';
        }

        sortedSessions.forEach(session => {
            const li = document.createElement('li');
            const date = new Date(session.startTime);
            const tags = session.tags && session.tags.length > 0 ? `<br><small>Tags: ${session.tags.join(', ')}</small>` : '';
            li.innerHTML = `
                <div>
                    <span>${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <br><strong>${formatDuration(session.durationMs)}</strong> (${session.type === 'interval' ? 'Interval' : 'Standard'})
                    ${session.mood ? `<span class="session-mood-emoji" title="Mood: ${session.mood}"> ${getEmojiForMood(session.mood)}</span>` : ''}
                    ${tags}
                </div>
                <button class="view-journal-btn btn-sm" data-session-id="${session.id}" title="View/Edit Journal"><i class="fas fa-feather-alt"></i></button>
            `;
            elements.meditationSessionsList.appendChild(li);
        });

        // Dashboard recent sessions (limit to 3)
        if (sortedSessions.length > 0) {
            sortedSessions.slice(0, 3).forEach(session => {
                const li = document.createElement('li');
                const date = new Date(session.startTime);
                li.innerHTML = `
                    <span>${date.toLocaleDateString()}: ${formatDuration(session.durationMs)}</span>
                    ${session.mood ? `<span class="session-mood-emoji" title="Mood: ${session.mood}"> ${getEmojiForMood(session.mood)}</span>` : ''}
                `;
                elements.dashMeditationSessionsList.appendChild(li);
            });
        } else {
            elements.dashMeditationSessionsList.innerHTML = '<li>No recent meditations.</li>';
        }

        document.querySelectorAll('.view-journal-btn').forEach(btn => {
            btn.onclick = (e) => openMeditationJournalModal(e.currentTarget.dataset.sessionId);
        });
    }

    function updateMeditationStats() {
        const totalDurationMs = meditationSessions.reduce((sum, session) => sum + session.durationMs, 0);
        const uniqueDates = new Set(meditationSessions.map(session => session.date));
        const avgDurationMs = meditationSessions.length > 0 ? totalDurationMs / meditationSessions.length : 0;

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

        const sortedDates = [...new Set(meditationSessions
            .map(session => new Date(session.startTime).toDateString()))]
            .sort((a, b) => new Date(a) - new Date(b));

        let currentStreak = 0;
        let longestStreak = 0;
        let lastDate = null;
        let tempCurrentStreak = 0;

        sortedDates.forEach(dateStr => {
            const currentDate = new Date(dateStr);
            if (lastDate === null) {
                tempCurrentStreak = 1;
            } else {
                const dayDiff = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    tempCurrentStreak++;
                } else if (dayDiff > 1) {
                    tempCurrentStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempCurrentStreak);
            lastDate = currentDate;
        });

        const today = new Date();
        today.setHours(0,0,0,0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const latestMedDate = sortedDates.length > 0 ? new Date(sortedDates[sortedDates.length - 1]) : null;

        if (latestMedDate) {
            latestMedDate.setHours(0,0,0,0);
            if (latestMedDate.getTime() === today.getTime()) {
                currentStreak = tempCurrentStreak;
            } else if (latestMedDate.getTime() === yesterday.getTime()) {
                let streakFromYesterday = 0;
                let tempLastDate = null;
                for (let i = sortedDates.length - 1; i >= 0; i--) {
                    const d = new Date(sortedDates[i]);
                    d.setHours(0,0,0,0);
                    if (tempLastDate === null) {
                        if (d.getTime() === yesterday.getTime()) {
                            streakFromYesterday = 1;
                        } else {
                            break;
                        }
                    } else {
                        const dayDiff = Math.round((tempLastDate - d) / (1000 * 60 * 60 * 24));
                        if (dayDiff === 1) {
                            streakFromYesterday++;
                        } else {
                            break;
                        }
                    }
                    tempLastDate = d;
                }
                currentStreak = streakFromYesterday;
            } else {
                currentStreak = 0;
            }
        } else {
            currentStreak = 0;
        }

        return { currentStreak, longestStreak };
    }

    function openMeditationJournalModal(sessionId) {
        const session = meditationSessions.find(s => s.id === sessionId);
        if (session) {
            // Reset mood selection
            elements.journalMoodEmojis.forEach(emoji => emoji.classList.remove('selected'));
            if (session.mood) {
                const selectedEmoji = document.querySelector(`.mood-emojis .emoji[data-mood="${session.mood}"]`);
                if (selectedEmoji) selectedEmoji.classList.add('selected');
            }

            elements.journalEnergyLevel.value = session.energy !== null ? session.energy : 5;
            elements.journalEnergyValue.textContent = elements.journalEnergyLevel.value;

            elements.journalTagsInput.value = session.tags ? session.tags.join(', ') : '';
            elements.journalTextInput.value = session.journalEntry || '';
            elements.gratitudeTextInput.value = session.gratitudeEntry || '';

            saveJournalEntryBtn.onclick = () => {
                session.mood = document.querySelector('.mood-emojis .emoji.selected')?.dataset.mood || null;
                session.energy = parseInt(elements.journalEnergyLevel.value, 10);
                session.tags = elements.journalTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                session.journalEntry = elements.journalTextInput.value.trim();
                session.gratitudeEntry = elements.gratitudeTextInput.value.trim();

                saveData('meditationSessions', meditationSessions);
                closeModal(elements.meditationJournalModal);
                renderMeditationSessions(); // Re-render to show mood/tags
                updateMeditationStats(); // Re-render charts
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
            <input type="number" value="60" min="5" placeholder="Seconds" data-type="duration">s
            <select data-type="sound">
                <option value="bell">Bell</option>
                <option value="chimes">Chimes</option>
            </select>
            <input type="text" placeholder="Label (e.g., Focus)" data-type="label">
            <button class="delete-step-btn delete-button btn-sm"><i class="fas fa-times"></i></button>
        `;
        elements.intervalStepsContainer.appendChild(div);
        div.querySelector('.delete-step-btn').onclick = (e) => e.target.closest('.interval-step').remove();
    }

    function getIntervalStepsFromUI() {
        const steps = [];
        elements.intervalStepsContainer.querySelectorAll('.interval-step').forEach(stepDiv => {
            const duration = parseInt(stepDiv.querySelector('[data-type="duration"]').value, 10);
            const sound = stepDiv.querySelector('[data-type="sound"]').value;
            const label = stepDiv.querySelector('[data-type="label"]').value || `Step ${steps.length + 1}`;
            if (!isNaN(duration) && duration > 0) {
                steps.push({ duration, sound, label });
            }
        });
        return steps;
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

        books.push({
            id: generateId(),
            title: title,
            author: author || 'Unknown Author',
            totalPages: isNaN(totalPages) || totalPages < 0 ? 0 : totalPages,
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
        elements.uploadBookCoverBtn.innerHTML = '<i class="fas fa-image"></i>'; // Reset button icon
        renderBooks();
        updateBookStatistics();
        updateAchievements();
        updateGoals();
        showToast('Book added successfully!', 'success');
    }

    function startBookReading(bookId) {
        if (currentReadingBookId) {
            showToast('Please stop reading the current book before starting another.', 'info');
            return;
        }

        currentReadingBookId = bookId;
        bookReadingStartTime = Date.now();
        // Set book status to 'Reading' automatically
        const book = books.find(b => b.id === bookId);
        if (book && book.status !== 'Reading') {
            book.status = 'Reading';
            saveData('books', books);
            renderBooks();
        }
        updateBookButtonsState();
        showToast(`Started reading "${book.title}".`, 'info');
    }

    function stopBookReading(bookId) {
        if (currentReadingBookId !== bookId) return;

        clearInterval(bookReadingTimerInterval);
        const endTime = Date.now();
        const durationMs = endTime - bookReadingStartTime;

        const book = books.find(b => b.id === bookId);
        if (book && durationMs > 5000) {
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
        });

        if (filteredBooks.length === 0 && filterText === '') {
            elements.booksList.innerHTML = '<li>No spiritual books added yet. Add your first scroll of wisdom!</li>';
        } else if (filteredBooks.length === 0 && filterText !== '') {
            elements.booksList.innerHTML = `<li>No books matching "${filterText}".</li>`;
        }

        filteredBooks.forEach(book => {
            const li = document.createElement('li');
            li.className = 'book-item';
            li.dataset.id = book.id;

            const totalReadingMs = book.readingSessions.reduce((sum, session) => sum + session.durationMs, 0);
            const progress = book.totalPages > 0 ? ((book.currentPage / book.totalPages) * 100).toFixed(1) : 0;
            const coverSrc = book.coverImage || './img/default_book.png'; // Fallback to default image

            li.innerHTML = `
                <img src="${coverSrc}" alt="Book Cover" class="book-cover-thumbnail">
                <div class="book-item-info">
                    <strong>${book.title}</strong>
                    <span>by ${book.author} | ${book.genre || 'N/A'}</span>
                    <span>Status: ${book.status} | Progress: ${book.currentPage}/${book.totalPages} (${progress}%)</span>
                    <span>Total Read: ${formatDuration(totalReadingMs)}</span>
                </div>
                <div class="book-item-controls">
                    <button class="start-reading" data-book-id="${book.id}" title="Start Reading">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="stop-reading" data-book-id="${book.id}" title="Stop Reading">
                        <i class="fas fa-stop"></i>
                    </button>
                    <button class="view-book-details btn-sm" data-book-id="${book.id}" title="View Details & Notes">
                        <i class="fas fa-info-circle"></i>
                    </button>
                    <button class="delete-book delete-button btn-sm" data-book-id="${book.id}" title="Delete Book">
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
            elements.dashCurrentReadingList.innerHTML = '<li>No books currently being read.</li>';
        }

        updateBookButtonsState(); // Set initial button states after rendering
    }

    function deleteBook(bookId) {
        if (currentReadingBookId === bookId) {
            showToast('Cannot delete a book while it is being read. Please stop the timer first.', 'error');
            return;
        }
        showConfirmationModal('Are you sure you want to delete this book and all its reading records?', () => {
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
        elements.modalBookStatus.textContent = book.status;
        elements.modalBookTotalPages.textContent = book.totalPages;
        elements.modalBookCurrentPage.value = book.currentPage;

        const totalReadingMs = book.readingSessions.reduce((sum, s) => sum + s.durationMs, 0);
        elements.modalBookTotalReadingTime.textContent = formatDuration(totalReadingMs);

        // Update progress bar and text
        const updateProgressDisplay = () => {
            const progress = book.totalPages > 0 ? ((book.currentPage / book.totalPages) * 100).toFixed(1) : 0;
            elements.modalBookProgress.textContent = `${progress}%`;
            elements.modalProgressBar.style.width = `${progress}%`;
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
                e.target.value = book.currentPage;
                showToast('Invalid page number!', 'error');
            }
        };

        // Render Rating Stars
        elements.modalBookRating.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star ${i <= book.rating ? 'active' : ''}`;
            star.dataset.rating = i;
            star.onclick = () => {
                book.rating = i;
                saveData('books', books);
                openBookDetailsModal(bookId); // Re-render stars
                showToast(`Rated "${book.title}" ${i} stars.`, 'info');
            };
            elements.modalBookRating.appendChild(star);
        }

        // Dropdown for Status
        const statusSelect = document.createElement('select');
        statusSelect.className = 'input-field small-input';
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
            elements.modalBookStatus.textContent = book.status;
            renderBooks(); // Update status in main list
            updateAchievements(); // Check for 'Books Finished' achievement
            updateGoals();
            showToast(`Status for "${book.title}" changed to "${book.status}".`, 'info');
        };
        elements.modalBookStatus.replaceWith(statusSelect); // Replace span with select

        elements.modalBookNotesInput.value = ''; // Clear input for new note
        renderBookNotes(book);

        elements.addBookNoteBtn.onclick = () => {
            const noteText = elements.modalBookNotesInput.value.trim();
            if (noteText) {
                book.notes.push({ id: generateId(), text: noteText, date: new Date().toISOString() });
                saveData('books', books);
                elements.modalBookNotesInput.value = '';
                renderBookNotes(book);
                showToast('Note added!', 'success');
            }
        };

        openModal(elements.bookDetailsModal);
    }

    function renderBookNotes(book) {
        elements.modalBookNotesList.innerHTML = '';
        if (book.notes.length === 0) {
            elements.modalBookNotesList.innerHTML = '<li>No notes yet. Add your insights!</li>';
            return;
        }

        book.notes.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(note => { // Newest first
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="note-content">${note.text}</div>
                <span class="note-date">${new Date(note.date).toLocaleDateString()} ${new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <button class="delete-note-btn delete-button btn-sm" data-note-id="${note.id}"><i class="fas fa-times"></i></button>
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

    function createOrUpdateChart(chartVar, canvasId, type, data, options) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (chartVar) {
            chartVar.destroy(); // Destroy previous chart instance
        }
        return new Chart(ctx, { type, data, options });
    }

    function renderMeditationCharts() {
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
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'day' },
                    title: { display: true, text: 'Date' }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Minutes' }
                }
            }
        });

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
                backgroundColor: 'rgba(153, 102, 255, 0.6)'
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'day' },
                    title: { display: true, text: 'Date' }
                },
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Sessions' },
                    ticks: { precision: 0 }
                }
            }
        });

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
                case 'calm': return '#81C784'; // Greenish
                case 'focused': return '#64B5F6'; // Blueish
                case 'peaceful': return '#BA68C8'; // Purplish
                case 'energetic': return '#FFEB3B'; // Yellowish
                case 'tired': return '#90A4AE'; // Greyish
                case 'anxious': return '#EF5350'; // Reddish
                case 'happy': return '#FFD54F'; // Orangeish
                default: return '#CCCCCC';
            }
        });

        moodDistributionChart = createOrUpdateChart(moodDistributionChart, 'moodDistributionChart', 'pie', {
            labels: moodLabels,
            datasets: [{
                data: moodData,
                backgroundColor: moodColors
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Mood Distribution' }
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
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontal bars
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Count' },
                    ticks: { precision: 0 }
                },
                y: {
                    title: { display: true, text: 'Tag' }
                }
            }
        });

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
                backgroundColor: 'rgba(255, 99, 132, 0.6)'
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Book Title' }
                },
                y: {
                    title: { display: true, text: 'Hours' }
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
            showToast('Please enter a valid target value for your goal.', 'error');
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
            lastUpdate: new Date().toISOString()
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
        goals.forEach(goal => {
            if (goal.completed) return;

            let currentProgress = 0;
            let relevantSessions = [];

            if (goal.period === 'week') {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
                startOfWeek.setHours(0,0,0,0);
                relevantSessions = meditationSessions.filter(s => new Date(s.startTime) >= startOfWeek);
                // For books, we need to re-evaluate the count for the current week, if it were dynamic.
                // For simplicity, for books, we will count overall finished books.
            } else if (goal.period === 'month') {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                relevantSessions = meditationSessions.filter(s => new Date(s.startTime) >= startOfMonth);
            } else { // 'overall'
                relevantSessions = meditationSessions;
            }

            if (goal.type === 'meditation_duration') {
                currentProgress = relevantSessions.reduce((sum, s) => sum + s.durationMs, 0) / (1000 * 60);
            } else if (goal.type === 'meditation_days') {
                currentProgress = new Set(relevantSessions.map(s => new Date(s.startTime).toDateString())).size;
            } else if (goal.type === 'books_finished') {
                currentProgress = books.filter(b => b.status === 'Finished').length;
            }

            goal.currentProgress = currentProgress;
            if (goal.currentProgress >= goal.targetValue) {
                goal.completed = true;
                showToast(`Goal Completed: ${GOAL_TYPES[goal.type].label} of ${goal.targetValue} ${GOAL_TYPES[goal.type].unit} ${goal.period === 'overall' ? '' : 'per ' + goal.period}!`, 'success');
            }
        });
        saveData('goals', goals);
        renderGoals();
    }

    function renderGoals() {
        elements.activeGoalsList.innerHTML = '';
        elements.completedGoalsList.innerHTML = '';

        const activeGoals = goals.filter(g => !g.completed);
        const completedGoals = goals.filter(g => g.completed);

        if (activeGoals.length === 0 && completedGoals.length === 0) {
            elements.activeGoalsList.innerHTML = '<li>No goals set yet. Set a goal to start tracking!</li>';
            return;
        }

        activeGoals.forEach(goal => {
            const li = document.createElement('li');
            const progress = Math.min(100, (goal.currentProgress / goal.targetValue) * 100).toFixed(1);
            li.innerHTML = `
                <div>
                    <strong>${GOAL_TYPES[goal.type].label}: ${goal.currentProgress.toFixed(1)} / ${goal.targetValue} ${GOAL_TYPES[goal.type].unit} ${goal.period === 'overall' ? '' : 'per ' + goal.period}</strong>
                    <div class="goal-progress-bar-container"><div class="goal-progress-bar" style="width: ${progress}%"></div></div>
                    <span>Progress: ${progress}%</span>
                </div>
                <button class="delete-goal-btn delete-button btn-sm" data-id="${goal.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            elements.activeGoalsList.appendChild(li);
        });

        completedGoals.forEach(goal => {
            const li = document.createElement('li');
            li.className = 'completed';
            li.innerHTML = `
                <div>
                    <strong>${GOAL_TYPES[goal.type].label}: ${goal.targetValue} ${GOAL_TYPES[goal.type].unit} ${goal.period === 'overall' ? '' : 'per ' + goal.period}</strong>
                    <div class="goal-progress-bar-container"><div class="goal-progress-bar" style="width: 100%"></div></div>
                    <span>Completed on: ${new Date(goal.lastUpdate).toLocaleDateString()}</span>
                </div>
                <button class="delete-goal-btn delete-button btn-sm" data-id="${goal.id}"><i class="fas fa-trash-alt"></i></button>
            `;
            elements.completedGoalsList.appendChild(li);
        });

        document.querySelectorAll('.delete-goal-btn').forEach(btn => {
            btn.onclick = (e) => deleteGoal(e.currentTarget.dataset.id);
        });
    }

    function deleteGoal(goalId) {
        showConfirmationModal('Are you sure you want to delete this goal?', () => {
            goals = goals.filter(g => g.id !== goalId);
            saveData('goals', goals);
            renderGoals();
            showToast('Goal deleted.', 'info');
            closeModal(elements.confirmationModal);
        });
    }


    // --- Achievements Logic ---

    const achievementsList = [
        { id: 'first_session', name: 'First Step', description: 'Complete your first meditation session.', check: () => meditationSessions.length >= 1, unlocked: false, icon: 'fas fa-shoe-prints' },
        { id: 'seven_day_streak', name: '7-Day Streak', description: 'Meditate for 7 consecutive days.', check: () => calculateStreaks().longestStreak >= 7, unlocked: false, icon: 'fas fa-fire' },
        { id: '30_min_meditation', name: 'Deep Dive', description: 'Complete a meditation session of 30 minutes or more.', check: () => meditationSessions.some(s => s.durationMs >= 30 * 60 * 1000), unlocked: false, icon: 'fas fa-mountain' },
        { id: '10_hours_meditated', name: 'Seasoned Seeker', description: 'Accumulate 10 hours of meditation.', check: () => meditationSessions.reduce((sum, s) => sum + s.durationMs, 0) >= 10 * 60 * 60 * 1000, unlocked: false, icon: 'fas fa-star' },
        { id: 'first_book_finished', name: 'Wisdom Gained', description: 'Mark your first spiritual book as "Finished".', check: () => books.some(b => b.status === 'Finished'), unlocked: false, icon: 'fas fa-feather-alt' },
        { id: 'five_books_finished', name: 'Enlightened Library', description: 'Finish 5 spiritual books.', check: () => books.filter(b => b.status === 'Finished').length >= 5, unlocked: false, icon: 'fas fa-book-sparkles' },
        { id: 'first_journal_entry', name: 'Inner Voice', description: 'Write your first meditation journal entry.', check: () => meditationSessions.some(s => s.journalEntry && s.journalEntry.length > 0), unlocked: false, icon: 'fas fa-pen-nib' },
        { id: 'first_book_note', name: 'Reflective Reader', description: 'Add your first note to a spiritual book.', check: () => books.some(b => b.notes && b.notes.length > 0), unlocked: false, icon: 'fas fa-highlighter' },
    ];

    function updateAchievements() {
        let changed = false;
        achievementsList.forEach(achievement => {
            if (!achievement.unlocked && achievement.check()) {
                achievement.unlocked = true;
                changed = true;
                showToast(`Achievement Unlocked: ${achievement.name}!`, 'success');
            }
        });
        if (changed) {
            saveData('achievementsList', achievementsList); // Save updated unlocked status
            renderAchievements();
        }
    }

    function renderAchievements() {
        elements.achievementsGrid.innerHTML = '';
        const savedAchievements = loadData('achievementsList', achievementsList.map(a => ({ id: a.id, unlocked: false })));

        achievementsList.forEach(achievement => {
            const savedState = savedAchievements.find(sa => sa.id === achievement.id);
            if (savedState) achievement.unlocked = savedState.unlocked; // Apply saved state

            const card = document.createElement('div');
            card.className = `achievement-card ${achievement.unlocked ? 'unlocked' : ''}`;
            card.innerHTML = `
                <i class="${achievement.icon}"></i>
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
        elements.bellSoundToggle.checked = settings.bellSound;
        elements.bellVolumeControl.value = settings.bellVolume;
        elements.ambientSoundSelector.value = settings.ambientSound;
        elements.ambientVolumeControl.value = settings.ambientVolume;
        elements.dailyReminderTimeInput.value = settings.dailyReminderTime;

        if (settings.customBackground) {
            document.body.style.backgroundImage = `url(${settings.customBackground})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundPosition = 'center center';
        } else {
            document.body.style.backgroundImage = '';
        }

        updateVolumeNodes(); // Update gain node values
        startAmbientSound(settings.ambientSound); // Restart ambient sound if active
    }

    function saveSettings() {
        settings.theme = elements.themeSelector.value;
        settings.bellSound = elements.bellSoundToggle.checked;
        settings.bellVolume = parseFloat(elements.bellVolumeControl.value);
        settings.ambientSound = elements.ambientSoundSelector.value;
        settings.ambientVolume = parseFloat(elements.ambientVolumeControl.value);
        settings.dailyReminderTime = elements.dailyReminderTimeInput.value;

        saveData('settings', settings);
        applySettings();
        showToast('Settings saved!', 'info');
    }

    function setDailyReminder() {
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
        } else { // Permission denied
            showToast('Notification permission blocked. Please enable it in browser settings.', 'warning');
        }
    }

    let reminderIntervalId = null;
    function scheduleReminder() {
        // Clear existing interval if any
        if (reminderIntervalId) {
            clearInterval(reminderIntervalId);
        }

        const [hour, minute] = settings.dailyReminderTime.split(':').map(Number);

        reminderIntervalId = setInterval(() => {
            const now = new Date();
            if (now.getHours() === hour && now.getMinutes() === minute && now.getSeconds() === 0) {
                new Notification('Mystic Vision', {
                    body: 'Time for your daily meditation!',
                    icon: './img/icon.png' // Add a small app icon for notifications
                });
            }
        }, 1000); // Check every second

        showToast(`Daily meditation reminder set for ${settings.dailyReminderTime}.`, 'success');
    }

    function clearDailyReminder() {
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
            achievementsList: achievementsList.map(a => ({ id: a.id, unlocked: a.unlocked }))
        };
        const filename = `mystic_vision_data_${new Date().toISOString().slice(0, 10)}.json`;
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
                    if (importedData.achievementsList) {
                        achievementsList.forEach(localAch => {
                            const importedAch = importedData.achievementsList.find(ia => ia.id === localAch.id);
                            if (importedAch) localAch.unlocked = importedAch.unlocked;
                        });
                    }

                    saveData('meditationSessions', meditationSessions);
                    saveData('books', books);
                    saveData('goals', goals);
                    saveData('settings', settings);
                    saveData('achievementsList', achievementsList.map(a => ({ id: a.id, unlocked: a.unlocked })));

                    initializeApp();
                    showToast('Data imported successfully!', 'success');
                    closeModal(elements.confirmationModal);
                });
            } catch (error) {
                showToast('Error importing data: Invalid JSON file. ' + error.message, 'error');
                console.error('Import error:', error);
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
            settings = { theme: 'light', bellSound: true, bellVolume: 0.5, ambientSound: 'none', ambientVolume: 0.5, dailyReminderTime: null, customBackground: null };
            achievementsList.forEach(a => a.unlocked = false); // Reset achievements
            initializeApp();
            showToast('All data cleared!', 'success');
            closeModal(elements.confirmationModal);
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
        } else if (sectionId === 'books-section') {
            renderBooks();
            elements.bookSearchInput.value = ''; // Clear search on section change
        } else if (sectionId === 'statistics-section') {
            renderMeditationCharts();
            renderMeditationCalendar();
            updateBookStatistics(); // Updates book chart
        } else if (sectionId === 'goals-section') {
            renderGoals();
        } else if (sectionId === 'achievements-section') {
            renderAchievements();
        }
    }

    function updateDashboard() {
        // This will be mostly handled by updateMeditationStats and renderBooks etc.
        // Just ensures the right elements are updated.
        updateMeditationStats(); // Populates meditation stats and streaks on dashboard
        elements.dashBooksFinished.textContent = books.filter(b => b.status === 'Finished').length;
        renderMeditationSessions(); // Populates recent meditations on dashboard
        renderBooks(); // Populates currently reading on dashboard
    }

    // --- Event Listeners ---
    elements.startMeditationBtn.addEventListener('click', () => startMeditationTimer(0));
    elements.pauseMeditationBtn.addEventListener('click', pauseMeditationTimer);
    elements.stopMeditationBtn.addEventListener('click', stopMeditationTimer);
    elements.resetMeditationBtn.addEventListener('click', resetMeditationDisplay);

    elements.presetMeditationButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const minutes = parseInt(e.target.dataset.minutes, 10);
            resetMeditationDisplay();
            startMeditationTimer(minutes);
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
            elements.journalMoodEmojis.forEach(e => e.classList.remove('selected'));
            emoji.classList.add('selected');
        });
    });
    elements.journalEnergyLevel.addEventListener('input', (e) => {
        elements.journalEnergyValue.textContent = e.target.value;
    });

    elements.addBookBtn.addEventListener('click', addBook);
    elements.uploadBookCoverBtn.addEventListener('click', () => elements.newBookCoverInput.click());
    elements.newBookCoverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                newBookCoverBase64 = reader.result;
                elements.uploadBookCoverBtn.innerHTML = '<i class="fas fa-check"></i> Cover Ready';
                showToast('Book cover selected!', 'info');
            };
            reader.readAsDataURL(file);
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
    elements.bellSoundToggle.addEventListener('change', saveSettings);
    elements.bellVolumeControl.addEventListener('input', saveSettings);
    elements.ambientSoundSelector.addEventListener('change', saveSettings);
    elements.ambientVolumeControl.addEventListener('input', saveSettings);
    elements.setDailyReminderBtn.addEventListener('click', setDailyReminder);
    elements.clearDailyReminderBtn.addEventListener('click', clearDailyReminder);

    elements.uploadCustomBackgroundBtn.addEventListener('click', () => elements.customBackgroundFileInput.click());
    elements.customBackgroundFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
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
        // Load all sounds first
        await loadSound(BELL_SOUND_URL, 'bell');
        await loadSound(AMBIENT_SOUND_URLS.rain, 'rain');
        await loadSound(AMBIENT_SOUND_URLS.forest, 'forest');
        await loadSound(AMBIENT_SOUND_URLS.ocean, 'ocean');
        await loadSound(AMBIENT_SOUND_URLS.chimes, 'chimes');
        
        applySettings();
        updateMeditationButtonStates(false, true, true);
        renderMeditationSessions();
        updateMeditationStats();
        renderBooks();
        updateBookStatistics(); // Call to initialize book charts
        renderGoals();
        updateGoals(); // Initial goal check
        renderAchievements();
        updateAchievements(); // Initial achievement check

        if (settings.dailyReminderTime) {
            setDailyReminder(); // Re-schedule reminder on load
        }

        showSection('dashboard-section'); // Show dashboard by default

        document.getElementById('current-year').textContent = new Date().getFullYear();
    }

    initializeApp();
});