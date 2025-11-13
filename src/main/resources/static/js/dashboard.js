/**
 * Tableau de bord Admin - Café Feedback
 * ✅ Fonctionne avec Spring Boot (sans authentification temporaire)
 * ✅ Chargement direct des données
 * ✅ Prêt pour la connexion à /api/feedback, /api/alerts, etc.
 */

// Configuration
const appConfig = {
    apiBaseUrl: '/api',
    itemsPerPage: 5,
    currentPage: 1,
    feedbackData: [],
    alertsData: []
};

// ========== UTILITAIRES ==========
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function formatRelativeTime(dateStr) {
    const diffMs = new Date() - new Date(dateStr);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffMinutes > 0) return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    return 'Il y a quelques secondes';
}

// ========== AUTH HELPERS ==========
function getAuthToken() {
    try { return localStorage.getItem('jwt'); } catch (e) { return null; }
}

function authFetch(url, options = {}) {
    const token = getAuthToken();
    options.headers = options.headers || {};
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, options);
}

// ========== API ==========
async function fetchFeedbackData() {
    try {
        const res = await authFetch(`${appConfig.apiBaseUrl}/feedback`);
        if (!res.ok) throw new Error('Erreur API');
        return await res.json();
    } catch (e) {
        console.error("Erreur chargement avis:", e);
        return [];
    }
}

async function fetchAlertsData() {
    try {
        const res = await authFetch(`${appConfig.apiBaseUrl}/alerts`);
        if (!res.ok) throw new Error('Erreur API');
        return await res.json();
    } catch (e) {
        console.error("Erreur chargement alertes:", e);
        return [];
    }
}

async function deleteFeedback(id) {
    if (!confirm('Supprimer cet avis ?')) return;
    try {
        const res = await authFetch(`${appConfig.apiBaseUrl}/feedback/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Échec suppression');
        appConfig.feedbackData = appConfig.feedbackData.filter(f => f.id !== id);
        updateAll();
        alert('Avis supprimé avec succès');
    } catch (e) {
        alert('Erreur lors de la suppression');
        console.error(e);
    }
}

// ========== AFFICHAGE ==========
function updateStats() {
    const data = appConfig.feedbackData;
    const total = data.length;
    const avg = total ? (data.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : 0;
    const positive = total ? Math.round(data.filter(f => f.rating >= 4).length / total * 100) : 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekly = data.filter(f => new Date(f.date) >= oneWeekAgo).length;

    document.getElementById('avgRating')?.textContent = avg;
    document.getElementById('totalFeedbacks')?.textContent = total;
    document.getElementById('positiveFeedbacks')?.textContent = `${positive}%`;
    document.getElementById('weeklyFeedbacks')?.textContent = weekly;
}

function createFeedbackRow(feedback) {
    const row = document.createElement('tr');
    const stars = Array(5).fill().map((_, i) =>
        i < feedback.rating ?
            '<i class="fas fa-star text-amber-400"></i>' :
            '<i class="far fa-star text-gray-300"></i>'
    ).join('');
    
    row.innerHTML = `
        <td>${formatDate(feedback.date)}</td>
        <td>Table ${feedback.tableNumber}</td>
        <td><div class="flex">${stars}</div></td>
        <td>${feedback.name || 'Anonyme'}</td>
        <td>${feedback.comment || 'Aucun commentaire'}</td>
        <td>
            <button class="text-red-500 hover:text-red-700 delete-btn" data-id="${feedback.id}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    row.querySelector('.delete-btn').addEventListener('click', () => deleteFeedback(feedback.id));
    return row;
}

function updateFeedbackList() {
    const tbody = document.getElementById('feedbackTableBody');
    if (!tbody) return;

    const search = document.getElementById('searchFeedback')?.value?.toLowerCase() || '';
    const ratingFilter = document.getElementById('filterRating')?.value || '';
    const tableFilter = document.getElementById('filterTable')?.value || '';

    let filtered = appConfig.feedbackData.filter(f => {
        const matchesSearch = !search ||
            (f.comment && f.comment.toLowerCase().includes(search)) ||
            (f.name && f.name.toLowerCase().includes(search)) ||
            f.tableNumber.toString().includes(search);
        const matchesRating = !ratingFilter || f.rating == ratingFilter;
        const matchesTable = !tableFilter || f.tableNumber == tableFilter;
        return matchesSearch && matchesRating && matchesTable;
    });

    const start = (appConfig.currentPage - 1) * appConfig.itemsPerPage;
    const end = start + appConfig.itemsPerPage;
    const pageData = filtered.slice(start, end);

    document.getElementById('startCount')?.textContent = start + 1;
    document.getElementById('endCount')?.textContent = Math.min(end, filtered.length);
    document.getElementById('totalCount')?.textContent = filtered.length;

    tbody.innerHTML = pageData.length ? 
        pageData.map(createFeedbackRow).reduce((f, r) => { f.appendChild(r); return f; }, document.createDocumentFragment()) :
        `<tr><td colspan="6" class="text-center py-4 text-gray-500">Aucun avis trouvé</td></tr>`;

    updatePagination(filtered.length);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / appConfig.itemsPerPage);
    const container = document.getElementById('paginationNumbers');
    if (!container) return;

    let html = '';
    if (appConfig.currentPage > 1) {
        html += `<button id="prevPage" class="px-3 py-1 border rounded-md">Préc</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= appConfig.currentPage - 1 && i <= appConfig.currentPage + 1)) {
            html += `<button class="pagination-btn px-3 py-1 rounded-md ${i === appConfig.currentPage ? 'bg-amber-700 text-white' : 'border'}">${i}</button>`;
        } else if (i === appConfig.currentPage - 2 || i === appConfig.currentPage + 2) {
            html += `<span class="px-2 text-gray-400">...</span>`;
        }
    }

    if (appConfig.currentPage < totalPages) {
        html += `<button id="nextPage" class="px-3 py-1 border rounded-md">Suiv</button>`;
    }

    container.innerHTML = html;
    container.querySelectorAll('.pagination-btn').forEach(btn => 
        btn.addEventListener('click', () => {
            appConfig.currentPage = +btn.textContent;
            updateFeedbackList();
        })
    );
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (appConfig.currentPage > 1) {
            appConfig.currentPage--;
            updateFeedbackList();
        }
    });
    document.getElementById('nextPage')?.addEventListener('click', () => {
        if (appConfig.currentPage < totalPages) {
            appConfig.currentPage++;
            updateFeedbackList();
        }
    });
}

function updateAlerts() {
    const container = document.getElementById('alertsContainer');
    if (!container) return;
    
    const unread = appConfig.alertsData.filter(a => !a.read).length;
    const countEl = document.getElementById('alertCount');
    if (countEl) {
        countEl.textContent = unread;
        countEl.style.display = unread ? 'inline' : 'none';
    }

    container.innerHTML = appConfig.alertsData.length ? 
        appConfig.alertsData.map(alert => `
            <div class="alert-card border-l-${alert.severity === 'high' ? 'red' : alert.severity === 'medium' ? 'yellow' : 'green'}-500">
                <div class="flex">
                    <div class="alert-card-icon alert-card-icon-${alert.severity === 'high' ? 'red' : 'yellow'}">
                        <i class="fas fa-${alert.icon || 'bell'}"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-medium">${alert.title}</h3>
                        <p>${alert.message}</p>
                        <div class="flex justify-between mt-2 text-sm">
                            <span>${formatRelativeTime(alert.date)}</span>
                            <span class="text-blue-600 cursor-pointer mark-read" data-id="${alert.id}">
                                ${alert.read ? 'Marquer non lu' : 'Marquer lu'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('') :
        `<div class="text-center py-8 text-gray-500"><i class="fas fa-bell-slash text-2xl mb-2"></i><p>Aucune alerte</p></div>`;

    container.querySelectorAll('.mark-read').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = +btn.dataset.id;
            const alert = appConfig.alertsData.find(a => a.id === id);
            if (alert) {
                alert.read = !alert.read;
                updateAlerts();
            }
        });
    });
}

function updateAll() {
    updateStats();
    updateFeedbackList();
    updateAlerts();
}

// ========== INITIALISATION ==========
async function loadData() {
    const spinners = document.querySelectorAll('.loading-spinner');
    spinners.forEach(s => s.style.display = 'inline-block');

    try {
        const [feedbacks, alerts] = await Promise.all([
            fetchFeedbackData(),
            fetchAlertsData()
        ]);
        appConfig.feedbackData = feedbacks;
        appConfig.alertsData = alerts;
        updateAll();
    } catch (e) {
        console.error("Erreur chargement global:", e);
        alert("Erreur lors du chargement des données");
    } finally {
        spinners.forEach(s => s.style.display = 'none');
    }
}

function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId)?.classList.add('active');
            if (tabId === 'reviews') updateFeedbackList();
            if (tabId === 'alerts') updateAlerts();
        });
    });
}

function initFilters() {
    ['searchFeedback', 'filterRating', 'filterTable'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
            appConfig.currentPage = 1;
            updateFeedbackList();
        });
    });

    document.getElementById('markAllAsRead')?.addEventListener('click', () => {
        appConfig.alertsData.forEach(a => a.read = true);
        updateAlerts();
    });

    document.getElementById('exportFeedback')?.addEventListener('click', () => {
        let csv = 'Date,Table,Note,Client,Commentaire\n';
        appConfig.feedbackData.forEach(f => {
            csv += `"${formatDate(f.date)}",${f.tableNumber},${f.rating},"${f.name || 'Anonyme'}","${(f.comment || '').replace(/"/g, '""')}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'avis_cafe.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// ========== DÉMARRAGE ==========
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFilters();
    loadData();
    
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        window.location.href = 'connexion.html';
    });
});