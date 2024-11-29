import React, { useState, useEffect } from 'react';
import axios from 'axios';
import carteImage from '/Users/ezzatsaoud/Desktop/JeuBataille/jeubataille/src/Assets/carte.jpg'

const JeuDeCartes = () => {
    const [paquetJoueur, setPaquetJoueur] = useState([]);
    const [paquetOrdinateur, setPaquetOrdinateur] = useState([]);

    const [carteJoueur, setCarteJoueur] = useState(null);
    const [carteOrdinateur, setCarteOrdinateur] = useState(null);

    const [cartesBrulees, setCartesBrulees] = useState([]);

    const [message, setMessage] = useState('');

    useEffect(() => {
        const initialiserPaquets = async () => {
            try {
                const reponse = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');

                tirerCartesInitiales(reponse.data.deck_id);
            } catch (erreur) {
                console.error("Erreur d'initialisation du paquet :", erreur);
            }
        };

        initialiserPaquets();
    }, []);

    const tirerCartesInitiales = async (idPaquet) => {
        try {
            const reponse = await axios.get(`https://deckofcardsapi.com/api/deck/${idPaquet}/draw/?count=52`);
            const cartes = reponse.data.cards;
            const milieu = Math.floor(cartes.length / 2);
            setPaquetJoueur(cartes.slice(0, milieu));
            setPaquetOrdinateur(cartes.slice(milieu, cartes.length));
        } catch (erreur) {
            console.error("Erreur lors du tirage des cartes :", erreur);
        }
    };

    const tirerCartes = () => {

        const nouvelleCarteJoueur = paquetJoueur.shift(); // Retire la première carte du paquet
        const nouvelleCarteOrdinateur = paquetOrdinateur.shift();

        setCarteJoueur(nouvelleCarteJoueur);
        setCarteOrdinateur(nouvelleCarteOrdinateur);

        comparerCartes(nouvelleCarteJoueur, nouvelleCarteOrdinateur);
    };

    const comparerCartes = (joueur, ordinateur) => {
        const ordreValeur = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];
        const valeurJoueur = ordreValeur.indexOf(joueur.value);
        const valeurOrdinateur = ordreValeur.indexOf(ordinateur.value);

        if (valeurJoueur > valeurOrdinateur) {
            setMessage('Vous gagnez cette manche !');
            setPaquetJoueur([...paquetJoueur, joueur, ordinateur, ...cartesBrulees]);
            setCartesBrulees([]);
        } else if (valeurJoueur < valeurOrdinateur) {
            setMessage('Ordinateur gagne cette manche.');
            setPaquetOrdinateur([...paquetOrdinateur, joueur, ordinateur, ...cartesBrulees]);
            setCartesBrulees([]);
        } else {
            setMessage('Bataille !');
            setCartesBrulees([...cartesBrulees, joueur, ordinateur]);

        }
    };

    return (
        <div>
            <h1>Jeu de Bataille</h1>

            <button onClick={tirerCartes}>Tirer une carte</button>
            <p>{message}</p>
            <div>
                <div className='ligne-jeu'>
                    <div className='pioche' >
                        <img src={carteImage} alt="Carte" />
                        <p className='paquet'> Paquet : {paquetJoueur.length}</p>
                    </div>
                    <p>Votre carte : {carteJoueur ? <img src={carteJoueur.image} alt={carteJoueur.code} /> : 'Aucune'}</p>
                    <p>Prochaine carte : {paquetJoueur.length > 0 ? <img src={paquetJoueur[0].image} alt={paquetJoueur[0].code} /> : 'Aucune'}</p>
                </div>
                <div className='ligne-jeu'>
                    <p>Carte de l'ordinateur : {carteOrdinateur ? <img src={carteOrdinateur.image} alt={carteOrdinateur.code} /> : 'Aucune'} </p>
                    <p>Prochaine carte : {paquetOrdinateur.length > 0 ? <img src={paquetOrdinateur[0].image} alt={paquetOrdinateur[0].code} /> : 'Aucune'}</p>
                    <div className='pioche'>
                        <img src={carteImage} alt="Carte" />
                        <p className='paquet'>Paquet : {paquetOrdinateur.length}</p>
                    </div> </div>

            </div >
            <div>
                <div>
                    <p>Cartes brûlées : {cartesBrulees.map(carte => carte.code).join(', ')}</p>
                </div>
                <div>
                <h3>Choisissez une carte :</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {paquetJoueur.slice(0, 5).map((carte, index) => (
                        <div key={index} onClick={() => tirerCartes(index)} style={{ cursor: 'pointer' }}>
                            <img src={carte.image} alt={carte.code} style={{ width: '60px', height: '90px' }} />
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div >
    );
};

export default JeuDeCartes;