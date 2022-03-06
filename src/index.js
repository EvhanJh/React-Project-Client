import React from 'react'
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppNavbar from "./components/AppNavBar/AppNavBar";
import {Col, Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css'
import reportWebVitals from "./reportWebVitals";
import {Meteo} from "./pages/MeteoPage";
import {MyMeteo} from "./pages/MyMeteoPage";
import AccountPage from "./pages/AccountPage";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <AppNavbar />
            <Container>
                <Row>
                    <Col>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/meteo" element={<Meteo />} />
                            <Route path="/mymeteo" element={<MyMeteo />} />
                            <Route path="/myaccount" element={<AccountPage />} />
                        </Routes>
                    </Col>
                </Row>
            </Container>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
