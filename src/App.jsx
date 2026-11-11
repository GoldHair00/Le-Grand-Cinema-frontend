
import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:5000'

function App() {
  const [films, setFilms] = useState([])
  const [screenings, setScreenings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedScreening, setSelectedScreening] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [loadingSeats, setLoadingSeats] = useState(false)
  const [seatsError, setSeatsError] = useState('')
  const [reservationMessage, setReservationMessage] = useState('')

  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [showRegister, setShowRegister] = useState(false)

  // Chargement des films et des séances
  useEffect(() => {
    async function loadCinema() {
      try {
        const [filmsResponse, screeningsResponse] = await Promise.all([
          fetch(`${API_URL}/api/films`),
          fetch(`${API_URL}/api/screenings`)
        ])

        if (!filmsResponse.ok || !screeningsResponse.ok) {
          setError('Erreur lors du chargement des données.')
          return
        }

        const filmsData = await filmsResponse.json()
        const screeningsData = await screeningsResponse.json()

        setFilms(filmsData)
        setScreenings(screeningsData)
      } catch {
        setError('Impossible de contacter le serveur.')
      } finally {
        setLoading(false)
      }
    }

    loadCinema()
  }, [])

  // Chargement des sièges d'une séance
  async function showSeats(screeningId) {
    setSelectedScreening(screeningId)
    setSelectedSeat(null)
    setSeats([])
    setSeatsError('')
    setReservationMessage('')
    setLoadingSeats(true)

    try {
      const response = await fetch(
        `${API_URL}/api/screenings/${screeningId}/seats`
      )

      if (!response.ok) {
        setSeatsError('Impossible de charger les sièges.')
        return
      }

      const data = await response.json()
      setSeats(data)
    } catch {
      setSeatsError('Erreur lors du chargement des sièges.')
    } finally {
      setLoadingSeats(false)
    }
  }

  // Création d'un compte
  async function register(event) {
    event.preventDefault()
    setAuthMessage('')

    try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      password
                              })
    });

      const data = await response.json()

      if (!response.ok) {
      setAuthMessage(data.message || "Erreur lors de l'inscription.");
      return;
      }

      setAuthMessage('Compte créé ! Vous pouvez maintenant vous connecter.')
      setShowRegister(false)
      setFirstName('')
      setLastName('')
      setPassword('')
    } catch (error){
      setAuthMessage('Impossible de contacter le serveur.')
    }
  }

  // Connexion utilisateur
  async function login(event) {
    event.preventDefault()
    setAuthMessage('')

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setAuthMessage(data.message || 'Identifiants incorrects.')
        return
      }

      setToken(data.access_token)
      setAuthMessage('Connexion réussie !')
      setPassword('')
    } catch {
      setAuthMessage('Impossible de contacter le serveur.')
    }
  }

  // Réservation d'une place
  async function reserveSeat() {
    if (!token) {
      setReservationMessage('Connectez-vous pour réserver.')
      return
    }

    if (!selectedScreening || !selectedSeat) {
      setReservationMessage('Sélectionnez une séance et une place.')
      return
    }

    setReservationMessage('Réservation en cours...')

    try {
      const response = await fetch(`${API_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          screening_id: selectedScreening,
          seat_id: selectedSeat
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setReservationMessage(
          data.message || 'Impossible de réserver cette place.'
        )
        await showSeats(selectedScreening)
        return
      }

      setReservationMessage('Réservation confirmée !')
      setSelectedSeat(null)
      await showSeats(selectedScreening)
    } catch {
      setReservationMessage('Impossible de contacter le serveur.')
    }
  }

  // Déconnexion
  function logout() {
    setToken('')
    setAuthMessage('Vous êtes déconnecté.')
    setSelectedSeat(null)
  }

  return (
    <main className="cinema">

      <header className="header">
        <h1>🎬 Le Grand Cinéma</h1>

        <nav>
          <a href="#accueil" >Accueil </a>
          <a href="#films" >Les films </a>
          <a href=" #connexion" >Connexion</a>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <h2>Bienvenue au Grand Cinéma</h2>
        <p>
          Découvrez les films à l'affiche et réservez vos places en ligne.
        </p>
        <a href="#films" className="button">
          Découvrir les films
        </a>
      </section>

      <section className="films" id="films">
        <h2>Nos films à l'affiche</h2>

        {loading && <p>Chargement des films...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && films.length === 0 && (
          <p>Aucun film disponible pour le moment.</p>
        )}

        <div className="films-list">
          {films.map((film) => {
            const filmScreenings = screenings.filter(
              (screening) => screening.film_id === film.id
            )

            return (
              <article className="film-card" key={film.id}>
                <h3>{film.title}</h3>

                <p>
                  {film.description || 'Aucune description disponible.'}
                </p>

                <p>Durée : {film.duration_minutes} minutes</p>

                <h4>Séances disponibles</h4>

                {filmScreenings.length === 0 ? (
                  <p>Aucune séance disponible.</p>
                ) : (
                  filmScreenings.map((screening) => (
                    <div className="screening" key={screening.id}>
                      <p>
                        Date :{' '}
                        {new Date(screening.starts_at).toLocaleString('fr-FR')}
                      </p>

                      <p>Salle : {screening.room_id}</p>
                      <p>Prix : {screening.price} €</p>

                      <button
                        type="button"
                        className="button"
                        onClick={() => showSeats(screening.id)}
                      >
                        Choisir mes places
                      </button>

                      {selectedScreening === screening.id && (
                        <div className="seat-selection">
                          <h4>Choisissez votre siège</h4>

                          {loadingSeats && <p>Chargement des sièges...</p>}
                          {seatsError && <p>{seatsError}</p>}

                          {!loadingSeats && !seatsError && (
                            <>
                              <div className="seat-legend">
                                <span>🟢 Libre</span>
                                <span>🔴 Réservé</span>
                                <span>🟡 Sélectionné</span>
                              </div>

                              <div className="seats-list">
                                {seats.map((seat) => (
                                  <button
                                    type="button"
                                    key={seat.id}
                                    className={`seat ${
                                      !seat.available
                                        ? 'seat-reserved'
                                        : selectedSeat === seat.id
                                          ? 'seat-selected'
                                          : 'seat-available'
                                    }`}
                                    disabled={!seat.available}
                                    onClick={() => {
                                      setSelectedSeat(seat.id)
                                      setReservationMessage('')
                                    }}
                                  >
                                    {seat.row}{seat.number}
                                  </button>
                                ))}
                              </div>

                              {selectedSeat && (
                                <div>
                                  <p>
                                    Place sélectionnée :{' '}
                                    {seats.find(
                                      (seat) => seat.id === selectedSeat
                                    )?.row}
                                    {seats.find(
                                      (seat) => seat.id === selectedSeat
                                    )?.number}
                                  </p>

                                  <button
                                    type="button"
                                    className="button"
                                    onClick={reserveSeat}
                                  >
                                    Réserver cette place
                                  </button>
                                </div>
                              )}

                              {reservationMessage && (
                                <p>{reservationMessage}</p>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </article>
            )
          })}
        </div>
      </section>

      <section id="connexion" className="films">
        <h2>Mon compte</h2>

        {token ? (
          <div>
            <p>Vous êtes connecté !</p>

            <button
              type="button"
              className="button"
              onClick={logout}
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            {showRegister ? (
              <>
                <h3>Créer un compte</h3>

                <form onSubmit={register}>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                  />

                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                  />

                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Choisissez un mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button type="submit" className="button">
                    Créer mon compte
                  </button>
                </form>

                <p>
                  Déjà inscrit ?
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                  >
                    Se connecter
                  </button>
                </p>
              </>
            ) : (
              <>
                <h3>Connexion</h3>

                <form onSubmit={login}>
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />

                  <input
                    type="password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />

                  <button type="submit" className="button">
                    Se connecter
                  </button>
                </form>

                <p>
                  Pas encore de compte ?
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegister(true)
                      setAuthMessage('')
                    }}
                  >
                    Créer un compte
                  </button>
                </p>
              </>
            )}
          </>
        )}

        {authMessage && <p>{authMessage}</p>}
      </section>

      <footer>
        <p>© 2026 Le Grand Cinéma</p>
      </footer>

    </main>
  )
}

export default App
