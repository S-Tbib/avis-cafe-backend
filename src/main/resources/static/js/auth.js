/**
 * Gestion de l'authentification – avisCafé
 * Fonctionne avec :
 *   - inscription.html
 *   - connexion.html
 *   - mot-de-passe-oublie.html
 */

document.addEventListener('DOMContentLoaded', () => {

    // ======================
    // 1. INSCRIPTION
    // ======================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = registerForm.password.value;
            const confirm = registerForm.confirmPassword.value;

            if (password !== confirm) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            const data = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                password: password
            };

            try {
                const res = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (res.ok) {
                    alert('✅ Compte créé avec succès !');
                    window.location.href = 'Admin/connexion.html';
                } else {
                    alert('❌ ' + (result.message || 'Inscription échouée.'));
                }
            } catch (err) {
                console.error('Erreur réseau:', err);
                alert('❌ Erreur de connexion au serveur.');
            }
        });
    }

    // ======================
    // 2. CONNEXION
    // ======================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            try {
                const res = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include', // Pour les cookies (si tu utilises des sessions)
                    body: JSON.stringify(data)
                });

                const result = await res.json();
                if (res.ok) {
                    // Si le serveur renvoie un token JWT, le stocker pour l'utiliser
                    if (result.token) {
                        try { localStorage.setItem('jwt', result.token); } catch (e) { /* ignore */ }
                    }
                    alert('✅ Connexion réussie !');
                    window.location.href = 'Admin/index.html';
                } else {
                    alert('❌ ' + (result.message || 'Email ou mot de passe incorrect.'));
                }
            } catch (err) {
                console.error('Erreur réseau:', err);
                alert('❌ Erreur de connexion au serveur.');
            }
        });
    }

    // ======================
    // 3. MOT DE PASSE OUBLIÉ
    // ======================
    const forgotForm = document.getElementById('forgotPasswordForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            if (!email) {
                alert('Veuillez saisir votre email.');
                return;
            }

            try {
                const res = await fetch('/api/users/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const result = await res.json();
                if (res.ok) {
                    alert('✅ Un lien de réinitialisation a été envoyé à votre email (si celui-ci existe).');
                    window.location.href = 'Admin/connexion.html';
                } else {
                    alert('❌ ' + (result.message || 'Échec de l’envoi.'));
                }
            } catch (err) {
                console.error('Erreur réseau:', err);
                alert('❌ Erreur de connexion au serveur.');
            }
        });
    }

});