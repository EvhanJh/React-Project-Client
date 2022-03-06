import {Alert, Button, Form, Modal} from "react-bootstrap";
import {PersonPlusFill} from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import {useRef, useState} from "react";
import axios from "axios";

export default function ModalRegister(props) {
    const { displayModal } = props
    const { closeModal } = props
    const { displayModalLogin } = props
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [errorResponse, setErrorResponse] = useState();

    const onSubmit = data => axios.post('http://localhost:3110/users/register', data).then(res => {
            if(res.status === 200) {
                if(res.data.error) {
                    setErrorResponse(res.data.msg);
                } else {
                    localStorage.setItem('users', JSON.stringify(res.data.msg));
                    window.location.reload(false);
                }
            }
    })
    const password = useRef({})
    password.current = watch("password", "");

    return (
        <>
            <Modal show={displayModal} onHide={closeModal} >
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center text-center">
                        <PersonPlusFill />
                        &nbsp;
                        Inscription
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {errorResponse && <Alert variant="danger">{errorResponse}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Entrez votre adresse email"
                                {...register("email", {required: true})}
                            />
                        </Form.Group>
                        {errors.email && <Alert variant="danger">L'email n'est pas valide.</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                {...register("password", {required: true})}
                            />
                        </Form.Group>
                        {errors.password && <Alert variant="danger">Le mot de passe n'est pas valide.</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Confirmer votre mot de passe"
                                {...register("repassword", {validate: value =>
                                        value === password.current})}
                            />
                        </Form.Group>
                        {errors.repassword && <Alert variant="danger">Les deux mots de passe ne correspondent pas.</Alert>}
                        <Form.Group className="d-grid gap-2">
                            <Button type="submit" variant="primary">
                                Inscription
                            </Button>
                        </Form.Group>
                        <Form.Group className="d-grid gap-2">
                            <Button variant="link" onClick={() => {
                                closeModal()
                                displayModalLogin()
                            }}>Vous avez un compte ? Connectez-vous !</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}