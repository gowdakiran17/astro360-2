import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthChartData {
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  color: string;
}

interface ChartResult {
  sun: PlanetPosition;
  moon: PlanetPosition;
  rising: PlanetPosition;
  planets: PlanetPosition[];
  chartType: string;
}

const BirthChartCalculator: React.FC = () => {
  const [formData, setFormData] = useState<BirthChartData>({
    date: '',
    time: '',
    location: '',
    latitude: 0,
    longitude: 0
  });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [chartResult, setChartResult] = useState<ChartResult | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'chart' | 'interpretation'>('form');
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  // Planet data for visualization
  const planetData = {
    sun: { symbol: '☉', color: '#FFD700', name: 'Sun' },
    moon: { symbol: '☽', color: '#C0C0C0', name: 'Moon' },
    mercury: { symbol: '☿', color: '#8C7853', name: 'Mercury' },
    venus: { symbol: '♀', color: '#FFC649', name: 'Venus' },
    mars: { symbol: '♂', color: '#CD5C5C', name: 'Mars' },
    jupiter: { symbol: '♃', color: '#DAA520', name: 'Jupiter' },
    saturn: { symbol: '♄', color: '#FAD5A5', name: 'Saturn' },
    uranus: { symbol: '♅', color: '#4FD0E7', name: 'Uranus' },
    neptune: { symbol: '♆', color: '#4B70DD', name: 'Neptune' },
    pluto: { symbol: '♇', color: '#FF4500', name: 'Pluto' }
  };

  const zodiacSigns = [
    { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'fire' },
    { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'earth' },
    { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'air' },
    { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'water' },
    { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'fire' },
    { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'earth' },
    { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'air' },
    { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'water' },
    { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'fire' },
    { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'earth' },
    { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'air' },
    { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'water' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = async () => {
    setIsLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get location name
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        location: data.display_name || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        latitude,
        longitude
      }));
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please enter manually.');
    } finally {
      setIsLocationLoading(false);
    }
  };

  const calculateChart = async () => {
    if (!formData.date || !formData.time || !formData.location) {
      alert('Please fill in all fields');
      return;
    }

    setIsCalculating(true);
    
    // Simulate chart calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock chart result (in real app, this would be actual astrological calculation)
    const mockResult: ChartResult = {
      sun: {
        planet: 'Sun',
        sign: zodiacSigns[Math.floor(Math.random() * 12)].name,
        degree: Math.floor(Math.random() * 30),
        house: Math.floor(Math.random() * 12) + 1,
        symbol: planetData.sun.symbol,
        color: planetData.sun.color
      },
      moon: {
        planet: 'Moon',
        sign: zodiacSigns[Math.floor(Math.random() * 12)].name,
        degree: Math.floor(Math.random() * 30),
        house: Math.floor(Math.random() * 12) + 1,
        symbol: planetData.moon.symbol,
        color: planetData.moon.color
      },
      rising: {
        planet: 'Ascendant',
        sign: zodiacSigns[Math.floor(Math.random() * 12)].name,
        degree: Math.floor(Math.random() * 30),
        house: 1,
        symbol: '↑',
        color: '#FFFFFF'
      },
      planets: Object.entries(planetData).map(([, data]) => ({
        planet: data.name,
        sign: zodiacSigns[Math.floor(Math.random() * 12)].name,
        degree: Math.floor(Math.random() * 30),
        house: Math.floor(Math.random() * 12) + 1,
        symbol: data.symbol,
        color: data.color
      })),
      chartType: 'Natal Chart'
    };

    setChartResult(mockResult);
    setActiveTab('chart');
    setIsCalculating(false);
  };

  const renderChartVisualization = () => {
    if (!chartResult) return null;

    return (
      <div className="chart-visualization">
        <div className="chart-wheel" style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          margin: '0 auto',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #ff6b6b)',
          border: '3px solid white'
        }}>
          {/* Houses */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '2px',
                height: '150px',
                background: 'rgba(255,255,255,0.3)',
                transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                transformOrigin: 'bottom center'
              }}
            >
              <span style={{
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {i + 1}
              </span>
            </div>
          ))}
          
          {/* Planets */}
          {chartResult.planets.map((planet, index) => (
            <div
              key={planet.planet}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-80px)`,
                width: '20px',
                height: '20px',
                background: planet.color,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'white',
                boxShadow: `0 0 10px ${planet.color}`
              }}
              title={`${planet.planet} in ${planet.sign} ${planet.degree}°`}
            >
              {planet.symbol}
            </div>
          ))}
          
          {/* Center */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            ☉
          </div>
        </div>
      </div>
    );
  };

  const renderPlanetPositions = () => {
    if (!chartResult) return null;

    return (
      <div className="planet-positions">
        <h3 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1.5rem',
          color: 'white',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Planetary Positions
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[chartResult.sun, chartResult.moon, chartResult.rising, ...chartResult.planets.slice(0, 6)].map((planet, index) => {
            const sign = zodiacSigns.find(s => s.name === planet.sign);
            return (
              <motion.div
                key={planet.planet}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  color: planet.color,
                  marginBottom: '0.5rem'
                }}>
                  {planet.symbol}
                </div>
                <h4 style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '1.1rem',
                  color: 'white',
                  marginBottom: '0.25rem'
                }}>
                  {planet.planet}
                </h4>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '0.25rem'
                }}>
                  {sign?.symbol} {planet.sign}
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  {planet.degree}° • House {planet.house}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInterpretation = () => {
    if (!chartResult) return null;

    return (
      <div className="chart-interpretation">
        <h3 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1.5rem',
          color: 'white',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Chart Interpretation
        </h3>
        
        <div style={{
          display: 'grid',
          gap: '1.5rem'
        }}>
          <div className="interpretation-section">
            <h4 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.2rem',
              color: chartResult.sun.color,
              marginBottom: '0.5rem'
            }}>
              ☉ Sun in {chartResult.sun.sign}
            </h4>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.9)'
            }}>
              Your Sun sign represents your core identity and life purpose. With your Sun in {chartResult.sun.sign}, 
              you embody the qualities of {chartResult.sun.sign.toLowerCase()} energy. This placement suggests a natural 
              inclination towards leadership and self-expression.
            </p>
          </div>
          
          <div className="interpretation-section">
            <h4 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.2rem',
              color: chartResult.moon.color,
              marginBottom: '0.5rem'
            }}>
              ☽ Moon in {chartResult.moon.sign}
            </h4>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.9)'
            }}>
              Your Moon sign reveals your emotional nature and inner world. The Moon in {chartResult.moon.sign} 
              indicates that you process emotions through the lens of {chartResult.moon.sign.toLowerCase()} energy, 
              seeking security and comfort in familiar patterns.
            </p>
          </div>
          
          <div className="interpretation-section">
            <h4 style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.2rem',
              color: chartResult.rising.color,
              marginBottom: '0.5rem'
            }}>
              ↑ Rising in {chartResult.rising.sign}
            </h4>
            <p style={{
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.9)'
            }}>
              Your Rising sign represents your outward personality and first impressions. With {chartResult.rising.sign} 
              rising, you project the characteristics of this sign to the world, approaching life with 
              {chartResult.rising.sign.toLowerCase()} energy and enthusiasm.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="birth-chart-calculator">
      <div className="calculator-header" style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '2rem',
          color: 'white',
          marginBottom: '0.5rem'
        }}>
          Birth Chart Calculator
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          Discover your cosmic blueprint based on your birth details
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
        gap: '0.5rem'
      }}>
        {[
          { id: 'form', label: 'Enter Details', icon: '📝' },
          { id: 'chart', label: 'Chart', icon: '🔮', disabled: !chartResult },
          { id: 'interpretation', label: 'Interpretation', icon: '✨', disabled: !chartResult }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
            disabled={tab.disabled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.id ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${activeTab === tab.id ? '#FBBF24' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '12px',
              color: 'white',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: tab.disabled ? 0.5 : 1
            }}
            aria-label={`${tab.label} tab`}
          >
            <span role="img" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="form-section"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '16px',
              padding: '2rem'
            }}
          >
            <div className="form-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div className="form-group">
                <label htmlFor="birth-date" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Birth Date
                </label>
                <input
                  id="birth-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="birth-time" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Birth Time
                </label>
                <input
                  id="birth-time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="birth-location" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)'
                }}>
                  Birth Location
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="birth-location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State, Country"
                    required
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={isLocationLoading}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(251, 191, 36, 0.2)',
                      border: '1px solid #FBBF24',
                      borderRadius: '8px',
                      color: '#FBBF24',
                      cursor: isLocationLoading ? 'wait' : 'pointer',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap'
                    }}
                    aria-label="Get current location"
                  >
                    {isLocationLoading ? '📍 Getting...' : '📍 Use Current Location'}
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={calculateChart}
                disabled={isCalculating}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1F2937',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isCalculating ? 'wait' : 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '200px'
                }}
                aria-label="Calculate birth chart"
              >
                {isCalculating ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="loading-spinner" style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid #1F2937',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Calculating...
                  </span>
                ) : (
                  'Calculate My Chart ✨'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'chart' && chartResult && renderChartVisualization()}
        {activeTab === 'chart' && chartResult && renderPlanetPositions()}
        {activeTab === 'interpretation' && chartResult && renderInterpretation()}
      </AnimatePresence>
    </div>
  );
};

export default BirthChartCalculator;