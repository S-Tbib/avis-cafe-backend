/**
 * Tableau de bord Admin - Café Feedback
 * Version prête pour la connexion à une base de données
 * 
 * Ce fichier contient la logique métier et les fonctions pour
 * récupérer et traiter les données de la base de données.
 */

// Configuration de l'application
const appConfig = {
    apiBaseUrl: '/api', // À modifier selon votre configuration
    itemsPerPage: 5,
    currentPage: 1,
    currentTab: 'reviews',
    isAuthenticated: false,
    keywordsPeriod: 'week',
    statsPeriod: 'week',
    alertsPeriod: 'week',
    feedbackData: [],
    alertsData: [],
    keywordsData: {
        positive: [],
        neutral: [],
        negative: []
    },
    weeklyTrendData: {
        days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        averageRatings: [],
        feedbackCounts: []
    }
};

/**
 * =====================
 * FONCTIONS UTILITAIRES
 * =====================
 */

/**
 * Formate une date au format lisible
 * @param {Date|string} date - Date à formater
 * @returns {string} - Date formatée
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formate le temps relatif
 * @param {string} dateStr - Date sous forme de chaîne
 * @returns {string} - Temps relatif (ex: "Il y a 3 heures")
 */
function formatRelativeTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffDays > 0) {
        return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
        return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
        return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
        return `Il y a quelques secondes`;
    }
}

/**
 * Nettoie et normalise un texte pour l'analyse
 * @param {string} text - Texte à nettoyer
 * @returns {string} - Texte nettoyé
 */
function cleanText(text) {
    return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

/**
 * =====================
 * FONCTIONS DE CONNEXION À LA BASE DE DONNÉES
 * =====================
 */

/**
 * Récupère les avis depuis l'API
 * @returns {Promise<Array>} - Liste des avis
 */
async function fetchFeedbackData() {
    try {
        // ICI: Remplacez l'URL par votre endpoint API réel
        const response = await fetch(`${appConfig.apiBaseUrl}/feedback`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des avis');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        // En cas d'erreur, on peut charger des données de démo ou afficher un message d'erreur
        showErrorMessage('Impossible de récupérer les avis. Vérifiez votre connexion à la base de données.');
        return [];
    }
}

/**
 * Récupère les alertes depuis l'API
 * @returns {Promise<Array>} - Liste des alertes
 */
async function fetchAlertsData() {
    try {
        // ICI: Remplacez l'URL par votre endpoint API réel
        const response = await fetch(`${appConfig.apiBaseUrl}/alerts`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des alertes');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        return [];
    }
}

/**
 * Récupère les données d'évolution hebdomadaire
 * @returns {Promise<Object>} - Données d'évolution
 */
async function fetchWeeklyTrendData() {
    try {
        // ICI: Remplacez l'URL par votre endpoint API réel
        const response = await fetch(`${appConfig.apiBaseUrl}/trends/weekly`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération de l\'évolution');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        return {
            days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            averageRatings: [4.0, 4.1, 4.0, 3.9, 3.8, 4.2, 4.3],
            feedbackCounts: [2, 3, 2, 4, 3, 2, 3]
        };
    }
}

/**
 * =====================
 * FONCTIONS DE TRAITEMENT DES DONNÉES
 * =====================
 */

/**
 * Analyse les commentaires pour extraire les mots-clés
 */
function analyzeKeywords() {
    // Liste des mots à ignorer
    const stopWords = [
        'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'ou', 'mais', 'donc', 
        'car', 'par', 'pour', 'dans', 'sur', 'avec', 'sans', 'être', 'avoir', 'faire',
        'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'ce', 'ça', 'cela',
        'ici', 'là', 'très', 'bien', 'pas', 'plus', 'trop', 'peu', 'très', 'vraiment'
    ];
    
    // Mots-clés positifs
    const positiveWords = [
        'délicieux', 'excellent', 'parfait', 'merveilleux', 'super', 'génial', 
        'agréable', 'bon', 'bonne', 'bien', 'satisfait', 'satisfaite', 'heureux', 
        'heureuse', 'charmant', 'charmante', 'gentil', 'gentille', 'propre', 'propres',
        'propre', 'propres', 'sympa', 'sympathique', 'sympathiques', 'décor', 'décoration',
        'pâtisseries', 'service', 'personnel', 'accueil', 'ambiance', 'calme', 'rapide',
        'rapides', 'rapide', 'rapides', 'efficace', 'efficaces', 'efficace', 'efficaces',
        'chaleureux', 'chaleureuse', 'chaleureuses', 'accueillant', 'accueillante',
        'accueillants', 'accueillantes', 'confortable', 'confortables', 'confortable',
        'confortables', 'ambiance', 'ambiances', 'ambiance', 'ambiances', 'café', 'cafés',
        'café', 'cafés', 'boisson', 'boissons', 'boisson', 'boissons', 'repas', 'repas',
        'repas', 'repas', 'manger', 'manger', 'manger', 'manger', 'qualité', 'qualités',
        'qualité', 'qualités', 'excellent', 'excellents', 'excellente', 'excellentes',
        'merveilleux', 'merveilleuses', 'merveilleux', 'merveilleuses', 'super', 'supers',
        'super', 'supers', 'génial', 'géniaux', 'géniale', 'géniales', 'agréable', 'agréables',
        'agréable', 'agréables', 'bon', 'bons', 'bonne', 'bonnes', 'bien', 'bien', 'bien',
        'bien', 'satisfait', 'satisfaits', 'satisfaite', 'satisfaites', 'heureux', 'heureux',
        'heureuse', 'heureuses', 'charmant', 'charmants', 'charmante', 'charmantes',
        'gentil', 'gentils', 'gentille', 'gentilles', 'propre', 'propres', 'propre',
        'propres', 'sympa', 'sympas', 'sympathique', 'sympathiques', 'décor', 'décorations',
        'service', 'services', 'personnel', 'personnels', 'accueil', 'accueils', 'ambiance',
        'ambiances', 'calme', 'calmes', 'rapide', 'rapides', 'efficace', 'efficaces',
        'chaleureux', 'chaleureuses', 'accueillant', 'accueillants', 'confortable',
        'confortables'
    ];
    
    // Mots-clés négatifs
    const negativeWords = [
        'mauvais', 'mauvaise', 'mauvaises', 'déçue', 'déçu', 'déçus', 'déçues', 'horrible',
        'horribles', 'pas', 'non', 'trop', 'peu', 'lent', 'lente', 'lents', 'lentes', 'froid',
        'froide', 'froides', 'bruyant', 'bruyante', 'bruyants', 'bruyantes', 'cher', 'chère',
        'chers', 'chères', 'attente', 'attentes', 'sale', 'sales', 'déçu', 'déçue', 'déçus',
        'déçues', 'mauvais', 'mauvaise', 'mauvaises', 'horrible', 'horribles', 'pas', 'non',
        'trop', 'peu', 'lent', 'lente', 'lents', 'lentes', 'froid', 'froide', 'froides',
        'bruyant', 'bruyante', 'bruyants', 'bruyantes', 'cher', 'chère', 'chers', 'chères',
        'attente', 'attentes', 'sale', 'sales', 'décevant', 'décevante', 'décevants',
        'décevantes', 'insatisfait', 'insatisfaite', 'insatisfaits', 'insatisfaites',
        'problème', 'problèmes', 'erreur', 'erreurs', 'mal', 'mal', 'mal', 'mal',
        'désagréable', 'désagréables', 'désagréable', 'désagréables', 'inconfortable',
        'inconfortables', 'inconfortable', 'inconfortables', 'décevant', 'décevante',
        'décevants', 'décevantes', 'insatisfait', 'insatisfaite', 'insatisfaits',
        'insatisfaites', 'problème', 'problèmes', 'erreur', 'erreurs', 'mal', 'mal',
        'mal', 'mal', 'désagréable', 'désagréables', 'désagréable', 'désagréables',
        'inconfortable', 'inconfortables', 'inconfortable', 'inconfortables'
    ];
    
    // Initialiser les compteurs
    const keywordCounts = {
        positive: {},
        neutral: {},
        negative: {}
    };
    
    // Filtrer les avis selon la période sélectionnée
    const now = new Date();
    let periodStart = new Date();
    
    if (appConfig.keywordsPeriod === 'week') {
        periodStart.setDate(now.getDate() - 7);
    } else if (appConfig.keywordsPeriod === 'month') {
        periodStart.setMonth(now.getMonth() - 1);
    } else if (appConfig.keywordsPeriod === 'year') {
        periodStart.setFullYear(now.getFullYear() - 1);
    }
    
    // Analyser chaque avis
    appConfig.feedbackData.forEach(feedback => {
        const feedbackDate = new Date(feedback.date);
        
        // Vérifier si l'avis est dans la période sélectionnée
        if (feedbackDate >= periodStart) {
            const comment = feedback.comment || '';
            
            // Nettoyer le commentaire
            const words = cleanText(comment).split(' ');
            
            // Compter les mots
            words.forEach(word => {
                // Ignorer les mots vides
                if (word.length < 3 || stopWords.includes(word)) return;
                
                // Déterminer la catégorie
                if (positiveWords.includes(word)) {
                    keywordCounts.positive[word] = (keywordCounts.positive[word] || 0) + 1;
                } else if (negativeWords.includes(word)) {
                    keywordCounts.negative[word] = (keywordCounts.negative[word] || 0) + 1;
                } else {
                    // Vérifier si c'est un mot neutre (noms de produits, etc.)
                    const neutralWords = ['café', 'thé', 'chocolat', 'croissant', 'tarte', 'pizza', 'salade', 'menu', 'prix'];
                    if (neutralWords.includes(word)) {
                        keywordCounts.neutral[word] = (keywordCounts.neutral[word] || 0) + 1;
                    }
                }
            });
        }
    });
    
    // Convertir en tableaux triés
    appConfig.keywordsData.positive = Object.entries(keywordCounts.positive)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
        
    appConfig.keywordsData.neutral = Object.entries(keywordCounts.neutral)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
        
    appConfig.keywordsData.negative = Object.entries(keywordCounts.negative)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
}

/**
 * =====================
 * FONCTIONS D'AFFICHAGE
 * =====================
 */

/**
 * Met à jour les statistiques principales
 */
function updateStats() {
    // Calcul de la note moyenne
    const totalRatings = appConfig.feedbackData.reduce((sum, feedback) => sum + parseInt(feedback.rating), 0);
    const averageRating = appConfig.feedbackData.length > 0 ? (totalRatings / appConfig.feedbackData.length).toFixed(1) : 0;
    
    // Calcul des avis positifs (4-5 étoiles)
    const positiveFeedbacks = appConfig.feedbackData.filter(f => f.rating >= 4).length;
    const positivePercentage = appConfig.feedbackData.length > 0 ? Math.round((positiveFeedbacks / appConfig.feedbackData.length) * 100) : 0;
    
    // Calcul des avis de la semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyFeedbacks = appConfig.feedbackData.filter(f => new Date(f.date) >= oneWeekAgo).length;
    
    // Mise à jour de l'interface
    document.getElementById('avgRating').textContent = averageRating;
    document.getElementById('totalFeedbacks').textContent = appConfig.feedbackData.length;
    document.getElementById('positiveFeedbacks').textContent = positivePercentage + '%';
    document.getElementById('weeklyFeedbacks').textContent = weeklyFeedbacks;
    
    // Mise à jour des tendances
    const previousWeekAvg = 4.3; // À remplacer par la valeur réelle de la semaine précédente
    const trendValue = averageRating - previousWeekAvg;
    
    const trendElement = document.querySelector('.stat-card-trend');
    if (trendValue > 0) {
        trendElement.textContent = `+${trendValue.toFixed(1)} vs semaine dernière`;
        trendElement.className = 'stat-card-trend stat-card-trend-up';
    } else if (trendValue < 0) {
        trendElement.textContent = `${trendValue.toFixed(1)} vs semaine dernière`;
        trendElement.className = 'stat-card-trend stat-card-trend-down';
    } else {
        trendElement.textContent = 'Aucune variation vs semaine dernière';
        trendElement.className = 'stat-card-trend stat-card-trend-neutral';
    }
}

/**
 * Met à jour la liste des avis
 */
function updateFeedbackList() {
    const tbody = document.getElementById('feedbackTableBody');
    if (!tbody) return;
    
    // Récupère les filtres
    const searchQuery = (document.getElementById('searchFeedback')?.value || '').toLowerCase();
    const ratingFilter = document.getElementById('filterRating')?.value || '';
    const tableFilter = document.getElementById('filterTable')?.value || '';
    
    // Filtre les avis
    let filteredFeedbacks = appConfig.feedbackData.filter(feedback => {
        const matchesSearch = !searchQuery || 
            (feedback.comment && feedback.comment.toLowerCase().includes(searchQuery)) ||
            (feedback.name && feedback.name.toLowerCase().includes(searchQuery)) ||
            feedback.tableNumber.toString().includes(searchQuery);
        
        const matchesRating = !ratingFilter || feedback.rating == ratingFilter;
        const matchesTable = !tableFilter || feedback.tableNumber === tableFilter;
        
        return matchesSearch && matchesRating && matchesTable;
    });
    
    // Calcule les avis à afficher
    const startIndex = (appConfig.currentPage - 1) * appConfig.itemsPerPage;
    const endIndex = startIndex + appConfig.itemsPerPage;
    const pageFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);
    
    // Met à jour les compteurs
    document.getElementById('startCount').textContent = startIndex + 1;
    document.getElementById('endCount').textContent = Math.min(endIndex, filteredFeedbacks.length);
    document.getElementById('totalCount').textContent = filteredFeedbacks.length;
    
    // Efface le contenu existant
    tbody.innerHTML = '';
    
    // Affiche un message si aucun avis ne correspond aux critères
    if (pageFeedbacks.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="text-center py-4 text-gray-500">
                Aucun avis ne correspond à vos critères de recherche
            </td>
        `;
        tbody.appendChild(emptyRow);
        return;
    }
    
    // Ajoute chaque avis
    pageFeedbacks.forEach(feedback => {
        const row = createFeedbackRow(feedback);
        tbody.appendChild(row);
    });
    
    // Met à jour la pagination
    updatePagination(filteredFeedbacks);
}

/**
 * Crée une ligne pour un avis
 * @param {Object} feedback - Données de l'avis
 * @returns {HTMLElement} - Ligne HTML
 */
function createFeedbackRow(feedback) {
    const row = document.createElement('tr');
    
    // Génère les étoiles
    const stars = Array.from({length: 5}, (_, i) => 
        i < feedback.rating ? 
        '<i class="fas fa-star text-amber-400"></i>' : 
        '<i class="far fa-star text-gray-300"></i>'
    ).join('');
    
    row.innerHTML = `
        <td class="px-4 py-3">${formatDate(feedback.date)}</td>
        <td class="px-4 py-3">Table ${feedback.tableNumber}</td>
        <td class="px-4 py-3">
            <div class="flex text-amber-400">${stars}</div>
        </td>
        <td class="px-4 py-3">${feedback.name || 'Anonyme'}</td>
        <td class="px-4 py-3">${feedback.comment || 'Aucun commentaire'}</td>
        <td class="px-4 py-3">
            <button class="text-red-500 hover:text-red-700 delete-feedback" data-id="${feedback.id}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    // Ajoute l'événement de suppression
    const deleteBtn = row.querySelector('.delete-feedback');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const feedbackId = parseInt(deleteBtn.getAttribute('data-id'));
            deleteFeedback(feedbackId);
        });
    }
    
    return row;
}

/**
 * Met à jour la pagination
 * @param {Array} feedbacks - Liste des avis filtrés
 */
function updatePagination(feedbacks) {
    const totalPages = Math.ceil(feedbacks.length / appConfig.itemsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    if (!paginationNumbers) return;
    
    // Efface le contenu existant
    paginationNumbers.innerHTML = '';
    
    // Ajoute les numéros de page
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.textContent = i;
        
        if (i === appConfig.currentPage) {
            button.classList.add('active');
        }
        
        button.addEventListener('click', () => {
            appConfig.currentPage = i;
            updateFeedbackList();
        });
        
        paginationNumbers.appendChild(button);
    }
    
    // Active/désactive les boutons précédent/suivant
    const prevButton = document.querySelector('.pagination-btn:first-child');
    const nextButton = document.querySelector('.pagination-btn:last-child');
    
    if (prevButton) {
        prevButton.disabled = appConfig.currentPage === 1;
    }
    
    if (nextButton) {
        nextButton.disabled = appConfig.currentPage === totalPages;
    }
}

/**
 * Supprime un avis
 * @param {number} id - ID de l'avis
 */
async function deleteFeedback(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
        return;
    }
    
    try {
        // ICI: Appel API pour supprimer l'avis
        const response = await fetch(`${appConfig.apiBaseUrl}/feedback/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression de l\'avis');
        }
        
        // Mettre à jour les données localement
        appConfig.feedbackData = appConfig.feedbackData.filter(feedback => feedback.id !== id);
        
        // Mettre à jour l'affichage
        updateFeedbackList();
        updateStats();
        analyzeKeywords();
        updateKeywords();
        
        showSuccessMessage('Avis supprimé avec succès');
    } catch (error) {
        console.error('Erreur:', error);
        showErrorMessage('Erreur lors de la suppression de l\'avis');
    }
}

/**
 * Met à jour la distribution des notes
 */
function updateRatingDistribution() {
    const container = document.getElementById('ratingDistribution');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Compte les avis par note
    const ratings = [0, 0, 0, 0, 0];
    appConfig.feedbackData.forEach(feedback => {
        if (feedback.rating >= 1 && feedback.rating <= 5) {
            ratings[feedback.rating - 1]++;
        }
    });
    
    // Calcule les pourcentages
    const total = appConfig.feedbackData.length;
    const percentages = ratings.map(count => total > 0 ? Math.round((count / total) * 100) : 0);
    
    // Crée les éléments
    for (let i = 4; i >= 0; i--) {
        const rating = i + 1;
        const count = ratings[i];
        const percentage = percentages[i];
        
        const item = document.createElement('div');
        item.className = 'space-y-1';
        
        item.innerHTML = `
            <div class="flex justify-between">
                <div class="flex items-center">
                    ${Array(rating).fill('<i class="fas fa-star text-amber-400"></i>').join('')}
                    ${Array(5 - rating).fill('<i class="far fa-star text-gray-300"></i>').join('')}
                </div>
                <span class="text-sm">${percentage}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="h-2.5 rounded-full ${rating >= 4 ? 'bg-green-500' : rating >= 3 ? 'bg-blue-500' : rating >= 2 ? 'bg-yellow-500' : 'bg-red-500'}" style="width: ${percentage}%"></div>
            </div>
        `;
        
        container.appendChild(item);
    }
}

/**
 * Met à jour les performances par table
 */
function updateTablePerformance() {
    const container = document.getElementById('tablePerformance');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Tables à analyser
    const tables = ['1', '2', '3', '4', '5'];
    
    // Analyse les performances par table
    tables.forEach(table => {
        const tableFeedbacks = appConfig.feedbackData.filter(f => f.tableNumber === table);
        
        if (tableFeedbacks.length > 0) {
            // Calcule la note moyenne
            const totalRatings = tableFeedbacks.reduce((sum, feedback) => sum + parseInt(feedback.rating), 0);
            const averageRating = (totalRatings / tableFeedbacks.length).toFixed(1);
            
            // Génère les étoiles
            const fullStars = Math.floor(averageRating);
            const hasHalfStar = averageRating % 1 >= 0.5;
            
            const stars = Array(fullStars).fill('<i class="fas fa-star"></i>').join('') +
                         (hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
                         Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill('<i class="far fa-star"></i>').join('');
            
            // Détermine la tendance
            let trendIcon = 'equals';
            let trendClass = 'text-gray-500';
            
            // À remplacer par une analyse réelle
            if (table === '3' || table === '5') {
                trendIcon = 'arrow-up';
                trendClass = 'text-green-500';
            } else if (table === '4') {
                trendIcon = 'arrow-down';
                trendClass = 'text-red-500';
            }
            
            const row = document.createElement('tr');
            row.className = 'border-b';
            row.innerHTML = `
                <td class="py-2">Table ${table}</td>
                <td class="py-2">${tableFeedbacks.length}</td>
                <td class="py-2">
                    <div class="flex text-amber-400">${stars}</div>
                </td>
                <td class="py-2 ${trendClass}"><i class="fas fa-${trendIcon}"></i></td>
            `;
            
            container.appendChild(row);
        }
    });
}

/**
 * Met à jour l'évolution hebdomadaire
 */
function updateWeeklyTrend() {
    const chartContainer = document.getElementById('weeklyTrendChart');
    if (!chartContainer) return;
    
    // Efface le contenu existant
    chartContainer.innerHTML = '';
    
    const { days, averageRatings, feedbackCounts } = appConfig.weeklyTrendData;
    
    // Trouve les valeurs min et max pour l'échelle
    const minRating = Math.max(3.0, Math.min(...averageRatings) - 0.2);
    const maxRating = Math.min(5.0, Math.max(...averageRatings) + 0.2);
    
    // Calcule l'échelle pour les avis (max 10 avis par jour)
    const maxFeedback = Math.max(10, Math.max(...feedbackCounts));
    
    // Crée les barres pour chaque jour
    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const rating = averageRatings[i];
        const feedbackCount = feedbackCounts[i];
        
        // Calcule la hauteur de la barre de note
        const ratingHeight = ((rating - minRating) / (maxRating - minRating)) * 80 + 5;
        
        // Calcule la hauteur de la barre d'avis
        const feedbackHeight = (feedbackCount / maxFeedback) * 40;
        
        // Crée le conteneur pour les deux barres
        const barContainer = document.createElement('div');
        barContainer.className = 'trend-bar-container';
        
        // Crée le tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'trend-tooltip';
        tooltip.textContent = `${day}: ${rating}★ (${feedbackCount} avis)`;
        
        // Barre de note moyenne
        const ratingBar = document.createElement('div');
        ratingBar.className = 'trend-rating-bar';
        ratingBar.style.height = `${ratingHeight}%`;
        ratingBar.style.backgroundColor = 'var(--primary-color)';
        
        // Barre du nombre d'avis
        const feedbackBar = document.createElement('div');
        feedbackBar.className = 'trend-feedback-bar';
        feedbackBar.style.height = `${feedbackHeight}%`;
        feedbackBar.style.backgroundColor = 'var(--success-color)';
        
        // Ajoute les éléments
        barContainer.appendChild(tooltip);
        barContainer.appendChild(ratingBar);
        barContainer.appendChild(feedbackBar);
        
        // Ajoute les événements de survol
        barContainer.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });
        
        barContainer.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        chartContainer.appendChild(barContainer);
    }
    
    // Met à jour les données d'analyse
    updateTrendAnalysis();
}

/**
 * Met à jour l'analyse de la tendance
 */
function updateTrendAnalysis() {
    const { averageRatings, feedbackCounts } = appConfig.weeklyTrendData;
    
    // Calcul de la note moyenne actuelle
    const currentAvgRating = averageRatings[averageRatings.length - 1];
    document.getElementById('currentAvgRating').textContent = currentAvgRating.toFixed(1);
    
    // Calcul de l'évolution vs semaine précédente
    const previousWeekAvg = 4.3; // Valeur simulée pour la semaine précédente
    const trendValue = currentAvgRating - previousWeekAvg;
    const trendElement = document.getElementById('weeklyTrendValue');
    
    if (trendValue > 0) {
        trendElement.textContent = `+${trendValue.toFixed(1)}`;
        trendElement.className = 'text-green-500 font-medium';
    } else if (trendValue < 0) {
        trendElement.textContent = trendValue.toFixed(1);
        trendElement.className = 'text-red-500 font-medium';
    } else {
        trendElement.textContent = '0.0';
        trendElement.className = 'text-gray-500 font-medium';
    }
    
    // Calcul du pourcentage pour la barre d'évolution
    const trendPercentage = Math.min(100, Math.abs(trendValue) * 25);
    document.getElementById('weeklyTrendBar').style.width = `${trendPercentage}%`;
    
    // Met à jour le nombre d'avis
    const totalWeeklyFeedbacks = feedbackCounts.reduce((sum, count) => sum + count, 0);
    document.getElementById('weeklyFeedbackCount').textContent = totalWeeklyFeedbacks;
    
    // Calcul du pourcentage pour la barre d'avis
    const feedbackPercentage = Math.min(100, (totalWeeklyFeedbacks / 35) * 100);
    document.getElementById('weeklyFeedbackBar').style.width = `${feedbackPercentage}%`;
    
    // Met à jour l'analyse
    const trendAnalysis = document.getElementById('trendAnalysis');
    
    if (trendValue > 0.2) {
        trendAnalysis.textContent = 'La note moyenne s\'améliore significativement cette semaine.';
    } else if (trendValue > 0) {
        trendAnalysis.textContent = 'La note moyenne s\'améliore progressivement tout au long de la semaine.';
    } else if (trendValue < -0.2) {
        trendAnalysis.textContent = 'Attention : la note moyenne baisse de manière significative.';
    } else if (trendValue < 0) {
        trendAnalysis.textContent = 'La note moyenne diminue légèrement cette semaine.';
    } else {
        trendAnalysis.textContent = 'La note moyenne reste stable par rapport à la semaine précédente.';
    }
}

/**
 * Met à jour les mots-clés fréquents
 */
function updateKeywords() {
    // Met à jour les gestionnaires d'événements pour la période
    const keywordsPeriodSelect = document.getElementById('keywordsPeriod');
    if (keywordsPeriodSelect) {
        keywordsPeriodSelect.addEventListener('change', () => {
            appConfig.keywordsPeriod = keywordsPeriodSelect.value;
            analyzeKeywords();
            updateKeywords();
        });
    }
    
    // Met à jour les mots-clés positifs
    const positiveContainer = document.getElementById('positiveKeywords');
    if (positiveContainer) {
        positiveContainer.innerHTML = '';
        
        appConfig.keywordsData.positive.forEach(([word, count]) => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag keyword-positive';
            tag.innerHTML = `${word} <span class="keyword-count">(${count})</span>`;
            positiveContainer.appendChild(tag);
        });
        
        // Si pas de mots-clés positifs
        if (appConfig.keywordsData.positive.length === 0) {
            const tag = document.createElement('span');
            tag.className = 'text-gray-500 italic';
            tag.textContent = 'Aucun mot-clé positif trouvé';
            positiveContainer.appendChild(tag);
        }
    }
    
    // Met à jour les mots-clés neutres
    const neutralContainer = document.getElementById('neutralKeywords');
    if (neutralContainer) {
        neutralContainer.innerHTML = '';
        
        appConfig.keywordsData.neutral.forEach(([word, count]) => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag keyword-neutral';
            tag.innerHTML = `${word} <span class="keyword-count">(${count})</span>`;
            neutralContainer.appendChild(tag);
        });
        
        // Si pas de mots-clés neutres
        if (appConfig.keywordsData.neutral.length === 0) {
            const tag = document.createElement('span');
            tag.className = 'text-gray-500 italic';
            tag.textContent = 'Aucun mot-clé neutre trouvé';
            neutralContainer.appendChild(tag);
        }
    }
    
    // Met à jour les mots-clés négatifs
    const negativeContainer = document.getElementById('negativeKeywords');
    if (negativeContainer) {
        negativeContainer.innerHTML = '';
        
        appConfig.keywordsData.negative.forEach(([word, count]) => {
            const tag = document.createElement('span');
            tag.className = 'keyword-tag keyword-negative';
            tag.innerHTML = `${word} <span class="keyword-count">(${count})</span>`;
            negativeContainer.appendChild(tag);
        });
        
        // Si pas de mots-clés négatifs
        if (appConfig.keywordsData.negative.length === 0) {
            const tag = document.createElement('span');
            tag.className = 'text-gray-500 italic';
            tag.textContent = 'Aucun mot-clé négatif trouvé';
            negativeContainer.appendChild(tag);
        }
    }
}

/**
 * Met à jour les alertes
 */
function updateAlerts() {
    const container = document.getElementById('alertsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Compte les alertes non lues
    const unreadAlerts = appConfig.alertsData.filter(alert => !alert.read).length;
    document.getElementById('alertCount').textContent = unreadAlerts;
    
    // Affiche les alertes
    appConfig.alertsData.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `alert-card border-${alert.color}-500 bg-${alert.color}-50`;
        if (alert.read) alertElement.classList.add('alert-card-read');
        
        alertElement.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0 w-8 h-8 bg-${alert.color}-100 rounded-full flex items-center justify-center mr-2">
                    <i class="fas fa-${alert.icon} text-${alert.color}-500"></i>
                </div>
                <div class="flex-1">
                    <h3 class="font-medium text-${alert.color}-800">${alert.title}</h3>
                    <div class="mt-2 text-sm text-${alert.color}-700">
                        <p>${alert.message}</p>
                    </div>
                    <div class="flex justify-between items-center mt-2 text-xs">
                        <span class="text-${alert.color}-500">${formatRelativeTime(alert.date)}</span>
                        <button class="text-blue-600 hover:underline">${alert.read ? 'Marquer non lu' : 'Marquer lu'}</button>
                    </div>
                </div>
            </div>
        `;
        
        // Ajoute les gestionnaires d'événements
        const markAsReadBtn = alertElement.querySelector('button');
        markAsReadBtn.addEventListener('click', () => {
            const index = appConfig.alertsData.findIndex(a => a.id === alert.id);
            if (index !== -1) {
                appConfig.alertsData[index].read = !appConfig.alertsData[index].read;
                updateAlerts();
            }
        });
        
        container.appendChild(alertElement);
    });
}

/**
 * Affiche un message d'erreur
 * @param {string} message - Message à afficher
 */
function showErrorMessage(message) {
    alert(`Erreur: ${message}`);
}

/**
 * Affiche un message de succès
 * @param {string} message - Message à afficher
 */
function showSuccessMessage(message) {
    alert(`Succès: ${message}`);
}

/**
 * =====================
 * GESTION DE L'AUTHENTIFICATION
 * =====================
 */

/**
 * Vérifie si l'utilisateur est authentifié
 * @returns {boolean} - True si authentifié, false sinon
 */
function isAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

/**
 * Gère la connexion admin
 */
async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        // ICI: Remplacez l'URL par votre endpoint API réel
        const response = await fetch(`${appConfig.apiBaseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            localStorage.setItem('adminAuthenticated', 'true');
            localStorage.setItem('adminToken', data.token);
            showAdminView();
        } else {
            alert(data.message || 'Identifiants incorrects');
        }
    } catch (error) {
        console.error('Erreur de connexion:', error);
        alert('Erreur de connexion. Vérifiez votre connexion réseau.');
    }
}

/**
 * Gère la déconnexion
 */
function handleLogout() {
    // ICI: Appel API pour invalider le token
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminToken');
    showLoginModal();
}

/**
 * Affiche la vue admin
 */
function showAdminView() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('adminView').style.display = 'block';
    document.getElementById('adminName').style.display = 'inline';
    
    // Charger les données
    loadData();
}

/**
 * Affiche le modal de connexion
 */
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.getElementById('adminView').style.display = 'none';
    document.getElementById('adminName').style.display = 'none';
}

/**
 * =====================
 * GESTION DES ONGLETS
 * =====================
 */

/**
 * Initialise les onglets admin
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Supprime la classe active de tous les onglets
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-500');
            });
            
            // Ajoute la classe active à l'onglet cliqué
            button.classList.add('active');
            button.classList.remove('text-gray-500');
            
            // Cache tous les contenus d'onglets
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Affiche le contenu de l'onglet sélectionné
            const tabId = button.getAttribute('data-tab');
            appConfig.currentTab = tabId;
            
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
                
                // Met à jour le contenu selon l'onglet
                if (tabId === 'reviews') {
                    updateFeedbackList();
                } else if (tabId === 'stats') {
                    updateRatingDistribution();
                    updateTablePerformance();
                    updateWeeklyTrend();
                    updateKeywords();
                } else if (tabId === 'alerts') {
                    updateAlerts();
                }
            }
        });
    });
    
    // Gestion du bouton "Marquer tout comme lu"
    document.getElementById('markAllAsRead').addEventListener('click', () => {
        appConfig.alertsData.forEach(alert => {
            alert.read = true;
        });
        updateAlerts();
    });
    
    // Gestion de la pagination des avis
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (appConfig.currentPage > 1) {
            appConfig.currentPage--;
            updateFeedbackList();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', () => {
        const totalPages = Math.ceil(appConfig.feedbackData.length / appConfig.itemsPerPage);
        if (appConfig.currentPage < totalPages) {
            appConfig.currentPage++;
            updateFeedbackList();
        }
    });
    
    // Gestion des filtres
    document.getElementById('searchFeedback')?.addEventListener('keyup', () => {
        appConfig.currentPage = 1;
        updateFeedbackList();
    });
    
    document.getElementById('filterRating')?.addEventListener('change', () => {
        appConfig.currentPage = 1;
        updateFeedbackList();
    });
    
    document.getElementById('filterTable')?.addEventListener('change', () => {
        appConfig.currentPage = 1;
        updateFeedbackList();
    });
    
    // Gestion de l'export
    document.getElementById('exportFeedback')?.addEventListener('click', exportFeedbackData);
}

/**
 * Exporte les données des avis
 */
function exportFeedbackData() {
    // Crée un CSV avec les données
    let csv = 'Date,Table,Note,Client,Commentaire\n';
    
    appConfig.feedbackData.forEach(feedback => {
        const date = formatDate(feedback.date);
        const rating = feedback.rating;
        const comment = feedback.comment ? feedback.comment.replace(/,/g, ' ') : '';
        const name = feedback.name || 'Anonyme';
        
        csv += `${date},Table ${feedback.tableNumber},${rating},${name},"${comment}"\n`;
    });
    
    // Crée un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'avis_clients.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/**
 * =====================
 * FONCTION PRINCIPALE
 * =====================
 */

/**
 * Charge toutes les données nécessaires
 */
async function loadData() {
    // Afficher les indicateurs de chargement
    showLoadingIndicators();
    
    try {
        // Récupérer les données depuis l'API
        const [feedbackData, alertsData, trendData] = await Promise.all([
            fetchFeedbackData(),
            fetchAlertsData(),
            fetchWeeklyTrendData()
        ]);
        
        // Stocker les données
        appConfig.feedbackData = feedbackData;
        appConfig.alertsData = alertsData;
        appConfig.weeklyTrendData = trendData;
        
        // Mettre à jour l'interface
        updateStats();
        updateFeedbackList();
        updateAlerts();
        analyzeKeywords();
        
        // Masquer les indicateurs de chargement
        hideLoadingIndicators();
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        hideLoadingIndicators();
        showErrorMessage('Impossible de charger les données');
    }
}

/**
 * Affiche les indicateurs de chargement
 */
function showLoadingIndicators() {
    // Indicateurs pour les avis
    const feedbackTableBody = document.getElementById('feedbackTableBody');
    if (feedbackTableBody) {
        feedbackTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="loading-spinner"></div>
                    <p>Chargement des avis...</p>
                </td>
            </tr>
        `;
    }
    
    // Indicateurs pour les statistiques
    const ratingDistribution = document.getElementById('ratingDistribution');
    if (ratingDistribution) {
        ratingDistribution.innerHTML = `
            <div class="text-center py-8">
                <div class="loading-spinner mb-2"></div>
                <p>Chargement des statistiques...</p>
            </div>
        `;
    }
    
    // Indicateurs pour l'évolution hebdomadaire
    const weeklyTrendChart = document.getElementById('weeklyTrendChart');
    if (weeklyTrendChart) {
        weeklyTrendChart.innerHTML = `
            <div class="text-center py-8">
                <div class="loading-spinner mb-2"></div>
                <p>Chargement de l'évolution...</p>
            </div>
        `;
    }
    
    // Indicateurs pour les mots-clés
    const positiveKeywords = document.getElementById('positiveKeywords');
    const neutralKeywords = document.getElementById('neutralKeywords');
    const negativeKeywords = document.getElementById('negativeKeywords');
    
    if (positiveKeywords) positiveKeywords.innerHTML = '<div class="text-center py-4"><div class="loading-spinner"></div></div>';
    if (neutralKeywords) neutralKeywords.innerHTML = '<div class="text-center py-4"><div class="loading-spinner"></div></div>';
    if (negativeKeywords) negativeKeywords.innerHTML = '<div class="text-center py-4"><div class="loading-spinner"></div></div>';
    
    // Indicateurs pour les alertes
    const alertsContainer = document.getElementById('alertsContainer');
    if (alertsContainer) {
        alertsContainer.innerHTML = `
            <div class="text-center py-8">
                <div class="loading-spinner mb-2"></div>
                <p>Chargement des alertes...</p>
            </div>
        `;
    }
}

/**
 * Masque les indicateurs de chargement
 */
function hideLoadingIndicators() {
    // Les indicateurs sont remplacés par les données réelles
    // dans les fonctions d'update correspondantes
}

/**
 * Fonction d'initialisation principale
 */
function initApp() {
    // Vérifie si l'utilisateur est déjà authentifié
    if (isAuthenticated()) {
        showAdminView();
    } else {
        showLoginModal();
    }
    
    // Initialisation des fonctionnalités
    initTabs();
    
    // Gestion du formulaire de connexion
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    // Gestion de l'annulation de la connexion
    document.getElementById('cancelLoginBtn').addEventListener('click', () => {
        window.location.href = '../index.html'; // Retour à la page client
    });
    
    // Gestion de la déconnexion
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Initialisation de l'application au chargement
document.addEventListener('DOMContentLoaded', initApp);