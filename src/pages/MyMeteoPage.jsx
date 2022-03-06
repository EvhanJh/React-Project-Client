import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import {geolocated} from "react-geolocated";
import {Alert, Button, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import axios from "axios";
import dateFormat from "dateformat";
import {Eye, SunsetFill, Sunrise, Droplet, ThermometerHigh, ThermometerLow, XCircle} from 'react-bootstrap-icons';
import {useForm} from "react-hook-form";
import '../assets/styles/MyMeteoPage.css';

const MyMeteoPage = (props) => {
    const [user, setUser] = useState({});
    const [locateMeteo,setLocateMeteo] = useState({});
    const [cityMeteo, setCityMeteo] = useState([]);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }} = useForm();
    const [errorResponse, setErrorResponse] = useState();

    useEffect(() => {
        if (localStorage.getItem("users") === null) {
            navigate('/');
        } else {
            const user = JSON.parse(localStorage.getItem('users'))
            setUser(user)
            user.meteos.map(city => (
                axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},fr&APPID=327ab4c3a13f99a89e79cf10b9469cb9&units=metric&lang=fr`).then(res => {
                    if (res.status !== 404) {
                        const infosMeteo = {
                            city: res.data.name,
                            sunset: new Date(res.data.sys.sunset * 1000),
                            sunrise: new Date(res.data.sys.sunrise * 1000),
                            temp: res.data.main.temp,
                            temp_max: res.data.main.temp_max,
                            temp_min: res.data.main.temp_min,
                            humidity: res.data.main.humidity,
                            visibility: res.data.visibility,
                            weather: res.data.weather
                        }
                        const tempCityMeteos = cityMeteo;
                        cityMeteo.push(infosMeteo)
                        setCityMeteo(tempCityMeteos)
                    }
                })
            ))
        }
    }, [cityMeteo, navigate])

    const onSubmit = data => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${data.city},fr&APPID=327ab4c3a13f99a89e79cf10b9469cb9&units=metric&lang=fr`).then(res => {
        if (res.status !== 404) {
            setErrorResponse('')
            axios.put(`http://localhost:3110/users/${user._id}/meteo`, data).then(res => {
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
        }
    }).catch(err => {
        if (err.response) {
            setErrorResponse('La ville n\'a pas été trouvée')
            // client received an error response (5xx, 4xx)
        } else if (err.request) {
            setErrorResponse('La ville n\'a pas été trouvée')
            // client never received a response, or request never left
        } else {
            setErrorResponse('La ville n\'a pas été trouvée')
            // anything else
        }
    })

    useEffect(() => {
        if(props.coords !== null) {
            const latitude = props.coords.latitude;
            const longitude = props.coords.longitude;
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=327ab4c3a13f99a89e79cf10b9469cb9&units=metric&lang=fr`).then(async (res) => {
                if (res.status !== 404) {
                    const infosMeteo = {
                        city: res.data.name,
                        sunset: new Date(res.data.sys.sunset * 1000),
                        sunrise: new Date(res.data.sys.sunrise * 1000),
                        temp: res.data.main.temp,
                        temp_max: res.data.main.temp_max,
                        temp_min: res.data.main.temp_min,
                        humidity: res.data.main.humidity,
                        visibility: res.data.visibility,
                        weather: res.data.weather
                    }
                    setLocateMeteo(infosMeteo);
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.status);
                }
            })
        }
    }, [props.coords])

    function deleteMeteoCity(city) {
        let rep = window.confirm(
            `Etes-vous sûr de vouloir supprimer la météo de cette ville ?`
        )
        if (rep === true) {
            axios.put(
                `http://localhost:3110/users/${user._id}/meteo/${city}`
            ).then(res => {
                console.log(res);
                localStorage.setItem('users', JSON.stringify(res.data.msg))
                window.location.reload(false)
        })
        }
    }

    let displayCityMeteos = cityMeteo.map((city, indice) => {
        return (
            <Card
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL + '/img_weather/' + city.weather[0].icon + '.png'})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: '75%',
                    width: '425px'
                }}
                className="text-white"
                key={'city-' + indice}
            >
                <XCircle className="btn_delete" onClick={() => deleteMeteoCity(city.city)}/>
                <Card.Body>
                    <Row>
                        <Col>
                            <h3>
                                Ville sauv.
                            </h3>
                            <h6>
                                {city.city}
                            </h6>
                            <div>
                                {city.weather[0].description.charAt(0).toUpperCase() + city.weather[0].description.slice(1)}
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center align-content-center align-items-end">
                            <h1>
                                {parseInt(city.temp)}°C
                            </h1>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col className="d-flex align-items-center text-center">
                            <Sunrise />
                            &nbsp;
                            {dateFormat(city.sunrise, 'HH:mm')}
                        </Col>
                        <Col className="d-flex align-items-center text-center">
                            <SunsetFill />
                            &nbsp;
                            {dateFormat(city.sunset, 'HH:mm')}
                        </Col>
                        <Col className="d-flex align-items-center text-center">
                            <Droplet />
                            &nbsp;
                            {city.humidity}%
                        </Col>
                    </Row>
                    <Row>
                        <Col className="d-flex align-items-center text-center">
                            <ThermometerLow />
                            &nbsp;
                            {city.temp_min}°C
                        </Col>
                        <Col className="d-flex align-items-center text-center">
                            <ThermometerHigh />
                            &nbsp;
                            {city.temp_max}°C
                        </Col>
                        <Col className="d-flex align-items-center text-center">
                            <Eye />
                            &nbsp;
                            {city.visibility / 1000}km
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    })

    return (
        <>
            {!props.isGeolocationAvailable ?
                (<Alert variant="danger">Le navigateur ne support pas la géolocalisation.</Alert>)
                : (<Alert variant="success">Le navigateur support la géolocalisation.</Alert>)
            }
            {/* eslint-disable-next-line no-mixed-operators */}
            {(props.isGeolocationEnabled && props.coords == null || !props.isGeolocationEnabled) ?
                (<Alert variant="danger">La géolocalisation n'est pas autorisée.</Alert>)
                : (<Alert variant="success">La géolocalisation est activée.</Alert>)
            }
                <Form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {errorResponse && <Alert variant="danger">{errorResponse}</Alert>}
                    <InputGroup className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Ajouter la météo de la ville de votre choix à mon panel"
                            {...register("city", {required: true})}
                        />
                        <Button variant="primary" type="submit">
                            Ajouter
                        </Button>
                    </InputGroup>
                    {errors.city && <Alert variant="danger">La ville est requise.</Alert>}
                </Form>
            {(Object.keys(locateMeteo).length !== 0) ?
                (
                    <div className="d-flex flex-wrap" style={{
                        rowGap: '.65rem',
                        columnGap: '.65rem'
                    }}>
                        <Card
                            style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL + '/img_weather/' + locateMeteo.weather[0].icon + '.png'})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                backgroundPosition: '75%',
                                width: '425px'
                            }}
                            className="text-white"
                        >
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <h3>
                                            Ma position
                                        </h3>
                                        <h6>
                                            {locateMeteo.city}
                                        </h6>
                                        <div>
                                            {locateMeteo.weather[0].description.charAt(0).toUpperCase() + locateMeteo.weather[0].description.slice(1)}
                                        </div>
                                    </Col>
                                    <Col className="d-flex justify-content-center align-content-center align-items-end">
                                        <h1>
                                            {parseInt(locateMeteo.temp)}°C
                                        </h1>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col className="d-flex align-items-center text-center">
                                        <Sunrise />
                                        &nbsp;
                                        {dateFormat(locateMeteo.sunrise, 'HH:mm')}
                                    </Col>
                                    <Col className="d-flex align-items-center text-center">
                                        <SunsetFill />
                                        &nbsp;
                                        {dateFormat(locateMeteo.sunset, 'HH:mm')}
                                    </Col>
                                    <Col className="d-flex align-items-center text-center">
                                        <Droplet />
                                        &nbsp;
                                        {locateMeteo.humidity}%
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex align-items-center text-center">
                                        <ThermometerLow />
                                        &nbsp;
                                        {locateMeteo.temp_min}°C
                                    </Col>
                                    <Col className="d-flex align-items-center text-center">
                                        <ThermometerHigh />
                                        &nbsp;
                                        {locateMeteo.temp_max}°C
                                    </Col>
                                    <Col className="d-flex align-items-center text-center">
                                        <Eye />
                                        &nbsp;
                                        {locateMeteo.visibility / 1000}km
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        {displayCityMeteos}
                    </div>

                )
                : (<></>)
            }
        </>
    );
};

export const MyMeteo = geolocated()(MyMeteoPage);