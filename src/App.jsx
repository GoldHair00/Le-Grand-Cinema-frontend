
import './App.css'

function App() {
  return (
    <main className="cinema">
      <header className="header">
        <h1>🎬 Le Grand Cinéma</h1>

        <nav>
          <a href="#accueil">Accueil</a>
          <a href="#films">Les films</a>
          <a href="#connexion">Connexion</a>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <h2>Bienvenue au Grand Cinéma</h2>
        <p>Découvrez les films à l'affiche et réservez vos places en ligne.</p>
        <a href="#films" className="button">
          Découvrir les films
        </a>
      </section>

      <section className="films" id="films">
        <h2>Nos films à l'affiche</h2>
        <p>Retrouvez prochainement notre programmation.</p>
      </section>

      <footer>
        <p>© 2026 Le Grand Cinéma</p>
      </footer>
    </main>
  )
}

export default App

