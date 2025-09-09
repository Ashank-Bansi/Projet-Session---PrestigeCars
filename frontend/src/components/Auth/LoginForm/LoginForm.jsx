import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../SignupForm/SignupForm.css"
import "./LoginForm.css";
import { AuthContext } from "../AuthContext"


const LoginForm = () => { // state pour gérer l'animation du chargement (login) et le declancher quand il est activé
    const [loaded, setloaded] = useState(false)

    useEffect(() => {
        setloaded(true);
    }, []);


    //const navigate = useNavigate(); //redirige le user

    //states pour gérer les validation 
    const [validEntries, setValidEntries] = useState(false)
    const [invalidEntries, setInvalidEntries] = useState(false)

    // Récupération des fonctions d'authentification du contexte
    const auth = useContext(AuthContext);

    async function handleSubmit(event) {
        event.preventDefault();

        //  récupère les données
        const fd = new FormData(event.target)
        const data = Object.fromEntries(fd.entries());

        try {
            //envoi de la requête au backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });
            const result = await response.json();
            if (!response.ok) { // gestion des erreurs
                throw new Error(result.message || "Identifiants invalide");
            }

            //si la conexion est réussi - mise à jour du auth
            auth.login({
                userId: result.userId,
                email: result.email,
                token: result.token,
                userType: result.userType
            });

            // Redirection vers la page d'accueil
            navigate("/");
            setValidEntries(true);
            setInvalidEntries(false);

        } catch (err) {
            console.error("Erreur de connexion:", err);
            setInvalidEntries(true);
            setValidEntries(false);
        }

        // Réinitialisation du formulaire
        event.target.reset();
    }

    return (
        <>
            <div className="connexion">
                <div className="info">
                    <h2>Bienvenue sur PrestigeCars</h2>
                    <h3> Rejoignez notre communauté de passionnés</h3>
                </div>

                <div className="user-pass">
                    <h2>Conenxion</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                            name="email"
                            type="email"
                            placeholder="Courriel"
                            required/>
                        </div>
                        <div>
                            <input
                            name="mdp"
                            type="password"
                            placeholder="Mot de passe"
                            required/>
                        </div>

                        {invalidEntries && (
                            <div className="control-error">
                                <p> Email ou mot de passe incorrect</p>
                            </div>
                        )}
                        {validEntries && (
                            <div className="control-valid">
                                <p> Succès connexion</p>
                            </div>
                        )}

                        <button type="Submit" className="login-btn">
                            Se connecter
                        </button>

                            <h4> Pas encore de compte ?</h4>
                            <button className="signup-btn">
                                créer un compte
                            </button>
                    </form>
                </div>
            </div></>
    );
};

export default LoginForm;