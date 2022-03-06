import React, {useEffect, useState} from "react";
import {geolocated} from "react-geolocated";
import {Alert, Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import axios from "axios";
import dateFormat from "dateformat";
import {Eye, SunsetFill, Sunrise, Droplet, ThermometerHigh, ThermometerLow} from 'react-bootstrap-icons';

const MeteoPage = (props) => {
    const [inputAddr, setInputAddr] = useState('');
    const [locateMeteo,setLocateMeteo] = useState({});
    const [cityMeteo, setCityMeteo] = useState([]);

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

    function getAddrCoord() {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputAddr},fr&APPID=327ab4c3a13f99a89e79cf10b9469cb9&units=metric&lang=fr`).then(res => {
            if (res.status !== 404) {
                alert(`Ville trouvée ! `)
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
                setCityMeteo([...cityMeteo, infosMeteo])
            }
        }).catch(err => {
            if (err.response) {
                alert(`Ville non trouvé : ${inputAddr}`)
                // client received an error response (5xx, 4xx)
            } else if (err.request) {
                alert(`Ville non trouvé : ${inputAddr}`)
                // client never received a response, or request never left
            } else {
                alert(`Ville non trouvé : ${inputAddr}`)
                // anything else
            }
        })
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
                <Card.Body>
                    <Row>
                        <Col>
                            <h3>
                                Temporaire
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
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Voir la météo de la ville de votre choix"
                    value={inputAddr}
                    onChange={(e) => setInputAddr(e.target.value)}
                />
                <Button variant="primary" onClick={getAddrCoord}>
                    Ajouter
                </Button>
            </InputGroup>
            {(Object.keys(locateMeteo).length !== 0) ?
                (
                    <div className="d-flex flex-wrap" style={{
                        rowGap: '.65rem',
                        columnGap: '.65rem'
                    }}
                    >
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

export const Meteo = geolocated()(MeteoPage);