const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/feedbacks';

/**
 * Had le-script kayerunner les scenarios dyal les tests li f l-Livrable.
 * Bash l-prof ychouf kolchi khdam mn l-terminal.
 */
const runTests = async () => {
    console.log('--- 🚀 Démarrage des tests Microservices ---');

    console.log('\n--- Test Scénario 5 : Vérification d’un cours inexistant ---');
    try {
        // Nzidu feedback l cours li aslan makayench (ex: 'Cours Fantome')
        const res = await axios.post(`${BASE_URL}/add/CoursFantome`, {
            note: 5,
            commentaire: "Had l-cours makayench ga3."
        });
        console.log('❌ Échec : Le système aurait dû bloquer !');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('✅ Succès : Le système a bien renvoyé une Erreur 404 (Cours introuvable)');
        } else {
            console.log('⚠️ Erreur inconnue :', error.message);
        }
    }

    console.log('\n--- Fin des tests ---');
};

runTests();
