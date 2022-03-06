import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
export default function HomePage() {

    return (
        <>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Application SPA</h1>
                    <p className="col-md-8 fs-4">
                        Exemple d'utilisation de React en multipages avec la librairie React
                        Router.
                    </p>

                    <p>
                        Cette application va nous permettre de saisir des EAN pour retrouver
                        des produits alimentaires et les enregistrer dans notre base de
                        données
                    </p>
                    <Button variant="primary" size="lg" as={Link} to="/meteo">
                        Trouver ma météo
                    </Button>
                </div>
            </div>
        </>
    )
}
