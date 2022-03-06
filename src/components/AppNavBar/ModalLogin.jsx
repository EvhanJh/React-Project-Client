import {Alert, Button, Form, Modal} from "react-bootstrap";
import {PersonCheckFill} from 'react-bootstrap-icons';
import {useForm} from "react-hook-form";
import axios from "axios";
import {useState} from "react";

export default function ModalLogin(props) {
    const { displayModal } = props
    const { closeModal } = props
    const { displayModalRegister } = props
    const { register, handleSubmit, formState: { errors }} = useForm();
    const [errorResponse, setErrorResponse] = useState();

    const onSubmit = data => axios.post('http://localhost:3110/users/login', data).then(res => {
        if(res.status === 200) {
            if(res.data.error) {
                setErrorResponse(res.data.msg);
            } else {
                localStorage.setItem('users', JSON.stringify(res.data.msg));
                window.location.reload(false);
            }
        } else {
            console.log(res.data);
        }
    })

    return (
        <>
            <Modal show={displayModal} onHide={closeModal} >
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center text-center">
                        <PersonCheckFill />
                        &nbsp;
                        Connexion
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {errorResponse && <Alert variant="danger">{errorResponse}</Alert>}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="email"
                                placeholder="Entrez votre adresse email"
                                {...register("email", {required: true})}
                            />
                        </Form.Group>
                        {errors.email && <Alert variant="danger">L'email n'est pas valide.</Alert>}
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                {...register("password", {required: true})}
                            />
                        </Form.Group>
                        {errors.password && <Alert variant="danger">Le mot de passe n'est pas valide.</Alert>}
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                Connexion
                            </Button>
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="link" onClick={() => {
                                closeModal()
                                displayModalRegister()
                            }}>Vous n'avez pas encore de compte ? Inscrivez-vous dès maintenant</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}