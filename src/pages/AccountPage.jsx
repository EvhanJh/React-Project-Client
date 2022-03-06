import {Alert, Button, Form} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
export default function AccountPage() {
    const [user, setUser] = useState({});
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [errorResponse, setErrorResponse] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("users") === null) {
            navigate('/');
        } else {
            const user = JSON.parse(localStorage.getItem('users'))
            setUser(user)
        }
    }, [navigate])

    const onSubmit = data => axios.put(`http://localhost:3110/users/${user._id}`, data).then(res => {
        if(res.status === 200) {
            if(res.data.error) {
                setErrorResponse(res.data.msg);
            } else {
                localStorage.setItem('users', JSON.stringify(res.data.msg));
                window.location.reload(false);
            }
        }
    })

    function deleteAccount() {
        let rep = window.confirm(
            `Etes-vous sûr de vouloir supprimer le compte ?`
        )
        if (rep === true) {
            axios.delete(
                `http://localhost:3110/users/${user._id}`
            ).then(localStorage.removeItem('users'))
                .then(window.location.reload(false));
        }
    }

    const newpassword = useRef({});
    newpassword.current = watch("newpassword", "");

    return (
        <>
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Parametrage du compte</h1>
                    <br />
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {errorResponse && <Alert variant="danger">{errorResponse}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Entrez votre adresse email*"
                                defaultValue={user.email}
                                disabled
                            />
                        </Form.Group>
                        {errors.email && <Alert variant="danger">L'email n'est pas valide.</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Entrez votre mot de passe*"
                                {...register("password", {required: true})}
                            />
                        </Form.Group>
                        {errors.password && <Alert variant="danger">Le mot de passe n'est pas valide.</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Nouveau mot de passe"
                                {...register("newpassword", {required: true})}
                            />
                        </Form.Group>
                        {errors.newpassword && <Alert variant="danger">Le mot de passe n'est pas valide.</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Confirmer votre nouveau mot de passe"
                                {...register("newrepassword", {validate: value =>
                                        value === newpassword.current})}
                            />
                        </Form.Group>
                        {errors.newrepassword && <Alert variant="danger">Les deux mots de passe ne correspondent pas.</Alert>}
                        <Form.Group className="d-grid gap-2">
                            <Button type="submit" variant="primary">
                                Enregistrer les modifications
                            </Button>
                        </Form.Group>
                        <br />
                        <Form.Group className="d-grid gap-2">
                            <Button variant="danger" onClick={deleteAccount}>
                                Supprimer le compte
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </>
    )
}
