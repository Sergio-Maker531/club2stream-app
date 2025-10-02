import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Traductions
const translations = {
  fr: {
    home: 'Accueil',
    events: 'Événements', 
    liveStream: 'Live Stream',
    map: 'Carte',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    admin: 'Admin',
    hello: 'Bonjour',
    loading: 'Chargement...',
    welcome: 'Bienvenue chez Club2Stream',
    description: 'l\'ambiance des meilleurs clubs, en direct, ou que vous soyez. Imagine de pouvoir écouter le son en live et te faire une idee reel de la musique, et gooo!!!!',
    listenLive: 'Écouter en direct',
    upcomingEvents: 'Événements à venir',
    chooseGenre: '🎵 Choisir un genre musical',
    chooseDestination: '📍 Choisir une destination',
    otherLocation: '🔍 Autre ville...',
    enterCity: 'Tapez n\'importe quelle ville (ex: Paris, Tokyo, Miami...)',
    cityNotFound: 'Désolé, impossible de localiser cette ville. Essayez avec une autre.',
    connectionError: 'Erreur de connexion. Vérifiez votre connexion internet.',
    searchedCity: 'Ville recherchée',
    noClubsFound: 'Aucun club trouvé dans cette ville pour le moment'
  },
  en: {
    home: 'Home',
    events: 'Events',
    liveStream: 'Live Stream', 
    map: 'Map',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin',
    hello: 'Hello',
    loading: 'Loading...',
    welcome: 'Welcome to Club2Stream',
    description: 'The best club vibes, live, wherever you are. Imagine being able to listen to live sound and get a real idea of the music, let\'s gooo!!!!',
    listenLive: 'Listen Live',
    upcomingEvents: 'Upcoming Events',
    chooseGenre: '🎵 Choose a music genre',
    chooseDestination: '📍 Choose a destination',
    otherLocation: '🔍 Other city...',
    enterCity: 'Type any city (e.g. Paris, Tokyo, Miami...)',
    cityNotFound: 'Sorry, unable to locate this city. Try another one.',
    connectionError: 'Connection error. Check your internet connection.',
    searchedCity: 'Searched city',
    noClubsFound: 'No clubs found in this city at the moment'
  }
};

// Context de langue
const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'fr';
  });

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Composant Sélecteur de langue
const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div style={{position: 'relative'}}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: '#d1d5db',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        <span style={{fontSize: '18px'}}>{currentLang?.flag}</span>
        <span>▼</span>
      </button>

      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: '8px',
          width: '140px',
          background: '#374151',
          border: '1px solid #4b5563',
          borderRadius: '6px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 50
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setDropdownOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                color: '#d1d5db',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant Header
const Header = () => {
  const { t } = useLanguage();

  return (
    <header style={{
      background: '#111827',
      borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
      position: 'relative',
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          paddingBottom: '16px'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none'
          }}>
            <div style={{
              fontSize: '32px'
            }}>🎵</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0
            }}>Club2Stream</h1>
          </Link>
          
          <nav style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}>
            <Link to="/" style={{color: '#d1d5db', textDecoration: 'none'}}>{t('home')}</Link>
            <Link to="/map" style={{color: '#d1d5db', textDecoration: 'none'}}>{t('map')}</Link>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
};

const HomePage = () => {
  const { t } = useLanguage();
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      color: 'white'
    }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(to right, #581c87, #111827, #be185d)',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '32px',
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t('welcome')}
          </h1>
          
          {/* Logo Club2Stream au centre - IMPOSANT */}
          <div style={{marginBottom: '48px'}}>
            <div style={{
              fontSize: '120px',
              marginBottom: '20px'
            }}>🎵</div>
            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#a855f7',
              marginBottom: '20px'
            }}>Club2Stream</div>
          </div>
          
          <p style={{
            fontSize: '20px',
            color: '#d1d5db',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            {t('description')}
          </p>
          
          {/* Barres de recherche */}
          <div style={{
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {/* Recherche par genre musical */}
              <div style={{position: 'relative'}}>
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      navigate(`/map?genre=${e.target.value}`);
                    }
                  }}
                  style={{
                    width: '100%',
                    background: '#374151',
                    color: 'white',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="">{t('chooseGenre')}</option>
                  <option value="Techno">🔊 Techno</option>
                  <option value="House">🏠 House</option>
                  <option value="Trance">💫 Trance</option>
                  <option value="Pop">⭐ Pop</option>
                  <option value="Disco">✨ Disco</option>
                  <option value="Reggae">🌴 Reggae</option>
                  <option value="Electro">⚡ Electro</option>
                </select>
              </div>

              {/* Recherche par ville - Hybride */}
              <div style={{position: 'relative'}}>
                {!showCustomLocation ? (
                  <select 
                    onChange={async (e) => {
                      if (e.target.value === 'other') {
                        setShowCustomLocation(true);
                      } else if (e.target.value) {
                        const cityCoords = {
                          'Paris': { lat: 48.8566, lng: 2.3522 },
                          'Berlin': { lat: 52.5200, lng: 13.4050 },
                          'Ibiza': { lat: 38.9067, lng: 1.4206 },
                          'London': { lat: 51.5074, lng: -0.1278 },
                          'Amsterdam': { lat: 52.3676, lng: 4.9041 },
                          'Milan': { lat: 45.4642, lng: 9.1900 },
                          'NewYork': { lat: 40.7128, lng: -74.0060 },
                          'Barcelona': { lat: 41.3851, lng: 2.1734 },
                          'Rome': { lat: 41.9028, lng: 12.4964 },
                          'Madrid': { lat: 40.4168, lng: -3.7038 }
                        };
                        
                        const coords = cityCoords[e.target.value];
                        if (coords) {
                          navigate(`/map?location=${e.target.value}&lat=${coords.lat}&lng=${coords.lng}`);
                        }
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#374151',
                      color: 'white',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  >
                    <option value="">{t('chooseDestination')}</option>
                    <option value="Paris">🇫🇷 Paris</option>
                    <option value="Berlin">🇩🇪 Berlin</option>
                    <option value="Ibiza">🇪🇸 Ibiza</option>
                    <option value="London">🇬🇧 Londres</option>
                    <option value="Amsterdam">🇳🇱 Amsterdam</option>
                    <option value="Milan">🇮🇹 Milan</option>
                    <option value="NewYork">🇺🇸 New York</option>
                    <option value="Barcelona">🇪🇸 Barcelona</option>
                    <option value="Rome">🇮🇹 Rome</option>
                    <option value="Madrid">🇪🇸 Madrid</option>
                    <option value="other">{t('otherLocation')}</option>
                  </select>
                ) : (
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="text"
                      placeholder={t('enterCity')}
                      onKeyPress={async (e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          const city = e.target.value.trim();
                          try {
                            const response = await fetch(
                              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
                            );
                            const data = await response.json();
                            
                            if (data && data.length > 0) {
                              const lat = parseFloat(data[0].lat);
                              const lng = parseFloat(data[0].lon);
                              const cityName = data[0].display_name.split(',')[0];
                              
                              navigate(`/map?location=${encodeURIComponent(cityName)}&lat=${lat}&lng=${lng}`);
                            } else {
                              alert(t('cityNotFound'));
                            }
                          } catch (error) {
                            alert(t('connectionError'));
                          }
                        }
                      }}
                      style={{
                        flex: 1,
                        background: '#374151',
                        color: 'white',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none'
                      }}
                    />
                    <button
                      onClick={() => setShowCustomLocation(false)}
                      style={{
                        background: '#4b5563',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      ← 
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bouton principal */}
          <button
            onClick={() => navigate('/map')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(to right, #7c3aed, #ec4899)',
              color: 'white',
              fontWeight: 'bold',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '18px',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <span>🎵</span>
            <span>{t('listenLive')}</span>
          </button>
        </div>
      </section>

      {/* Section clubs */}
      <section style={{
        paddingTop: '64px',
        paddingBottom: '64px',
        padding: '64px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '48px'
          }}>🌍 Clubs Disponibles</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              { name: "Berghain", city: "Berlin", genre: "Techno", flag: "🇩🇪", status: "live" },
              { name: "Pacha", city: "Ibiza", genre: "House", flag: "🇪🇸", status: "live" },
              { name: "Studio 54", city: "New York", genre: "Disco", flag: "🇺🇸", status: "live" },
              { name: "Bob Marley Club", city: "Kingston", genre: "Reggae", flag: "🇯🇲", status: "live" }
            ].map((club, index) => (
              <div key={index} style={{
                background: '#1f2937',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #374151',
                textAlign: 'center'
              }}>
                <div style={{fontSize: '32px', marginBottom: '12px'}}>{club.flag}</div>
                <h3 style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px'}}>{club.name}</h3>
                <p style={{color: '#9ca3af', marginBottom: '12px'}}>{club.city}</p>
                <div style={{
                  display: 'inline-block',
                  background: '#059669',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  🔴 LIVE - {club.genre}
                </div>
                <br />
                <button
                  onClick={() => {
                    // Son simple avec Web Audio API
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    if (club.genre === 'Techno') {
                      oscillator.frequency.setValueAtTime(130, audioContext.currentTime);
                      oscillator.type = 'sawtooth';
                    } else if (club.genre === 'House') {
                      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                      oscillator.type = 'sine';
                    } else if (club.genre === 'Disco') {
                      oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
                      oscillator.type = 'triangle';
                    } else {
                      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                      oscillator.type = 'square';
                    }
                    
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 1);
                  }}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🎧 Écouter
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Composant carte simple
const MapPage = () => {
  const { t } = useLanguage();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '36px',
          marginBottom: '24px'
        }}>{t('map')} - Clubs Monde</h1>
        
        <div style={{
          background: '#1f2937',
          padding: '40px',
          borderRadius: '12px',
          marginBottom: '32px'
        }}>
          <div style={{fontSize: '64px', marginBottom: '16px'}}>🗺️</div>
          <h2>Carte Interactive</h2>
          <p>Cliquez sur les clubs pour écouter leurs sons !</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {[
            { name: "🇩🇪 Berghain", genre: "Techno" },
            { name: "🇪🇸 Pacha", genre: "House" },
            { name: "🇺🇸 Studio 54", genre: "Disco" },
            { name: "🇯🇲 Bob Marley", genre: "Reggae" }
          ].map((club, index) => (
            <div key={index} style={{
              background: '#1f2937',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #374151'
            }}>
              <h3>{club.name}</h3>
              <p style={{color: '#9ca3af'}}>{club.genre}</p>
              <button
                onClick={() => {
                  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();
                  
                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);
                  
                  oscillator.frequency.setValueAtTime(200 + Math.random() * 200, audioContext.currentTime);
                  oscillator.type = 'sawtooth';
                  
                  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                  
                  oscillator.start(audioContext.currentTime);
                  oscillator.stop(audioContext.currentTime + 0.8);
                }}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🎧 Écouter
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div style={{
          minHeight: '100vh',
          background: '#111827',
          fontFamily: 'Arial, sans-serif'
        }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
