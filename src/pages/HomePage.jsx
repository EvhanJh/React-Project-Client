import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
export default function HomePage() {

    return (
        <>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Application Meteo</h1>
                    <p className="col-md-8 fs-4">
                        Ce projet consiste à visualiser la météo des villes que l'on souhaite
                    </p>

                    <p>
                        Toutes les requêtes sont utilisés, mise à part GET si je me trompe au niveau du serveur.
                        <br />
                        <br />
                        L'application comporte :
                        <br />
                        - Un système de connexion/inscription/deconnexion
                        <br />
                        - Une page de modification du compte ou l'on peut modifier le mot de passe
                        <br />
                        - Une page MyMeteo une fois connecté ou l'on peut ajouter des météos que l'on souhaite qui seront sauvegardés
                        <br />
                        - Une page Meteo avec les météos à visualiser
                        <br />
                        - Un système de géolocalisation
                        <br />
                        <br />
                        On utilise donc les appels post/put/delete
                    </p>
                    <Button variant="primary" size="lg" as={Link} to="/meteo">
                        Trouver ma météo
                    </Button>
                </div>
            </div>
        </>
    )
}
