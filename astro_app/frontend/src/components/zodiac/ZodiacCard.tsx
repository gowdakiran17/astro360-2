import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZodiacCardProps {
  id: number;
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  dates: string;
  color: string;
  onSelect: (id: number) => void;
  isSelected: boolean;
  index: number;
}

const elementIcons = {
  fire: '🔥',
  earth: '🌍',
  air: '💨',
  water: '🌊'
};

const ZodiacCard: React.FC<ZodiacCardProps> = ({
  id,
  name,
  symbol,
  element,
  dates,
  color,
  onSelect,
  isSelected,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random stars for constellation effect
    const newStars = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(id);
    }
  };

  const getElementDescription = () => {
    switch (element) {
      case 'fire':
        return 'Passionate, energetic, and natural leaders with boundless enthusiasm and creative drive.';
      case 'earth':
        return 'Grounded, practical, and reliable with strong connections to nature and material world.';
      case 'air':
        return 'Intellectual, communicative, and adaptable with quick wit and social charm.';
      case 'water':
        return 'Intuitive, emotional, and deeply empathetic with psychic abilities and healing energy.';
      default:
        return 'Mysterious and complex with unique cosmic energies.';
    }
  };

  return (
    <motion.div
      className="zodiac-card-container"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isSelected ? 1.02 : 1,
        boxShadow: isSelected ? `0 0 30px ${color}40` : 'none'
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isSelected}
      aria-label={`${name} zodiac sign - ${element} element`}
      aria-describedby={`zodiac-description-${id}`}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isSelected ? color : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '16px',
        padding: '1.5rem',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        color: 'white'
      }}
    >
      {/* Constellation Background */}
      <div className="constellation-bg" aria-hidden="true">
        {stars.map((star, index) => (
          <motion.div
            key={index}
            className="constellation-star"
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: color,
              borderRadius: '50%',
              boxShadow: `0 0 ${star.size * 2}px ${color}60`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.3, 1, 0.5],
              scale: [0, 1, 0.8, 1.2, 1]
            }}
            transition={{
              duration: 3,
              delay: star.delay,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Zodiac Symbol */}
      <motion.div
        className="zodiac-symbol-wrapper"
        animate={{
          rotate: isHovered ? 360 : 0
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          className="zodiac-symbol"
          style={{
            fontSize: '3rem',
            color: color,
            textShadow: `0 0 20px ${color}80`,
            filter: isHovered ? `drop-shadow(0 0 15px ${color})` : 'none',
            transition: 'filter 0.3s ease'
          }}
        >
          {symbol}
        </div>
      </motion.div>

      {/* Card Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h4 className="zodiac-name" style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: 'white'
        }}>
          {name}
        </h4>
        
        <p className="zodiac-dates" style={{
          fontSize: '0.875rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '0.75rem'
        }}>
          {dates}
        </p>

        <div className="zodiac-element-badge" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.75rem',
          background: `linear-gradient(135deg, ${color}20, ${color}10)`,
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          border: `1px solid ${color}40`
        }}>
          <span role="img" aria-label={element}>{elementIcons[element]}</span>
          <span>{element}</span>
        </div>
      </div>

      {/* Progressive Disclosure Content */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            id={`zodiac-description-${id}`}
            className="zodiac-details"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ 
              opacity: 1, 
              height: "auto", 
              marginTop: "1rem",
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '1rem'
            }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: 'relative',
              zIndex: 2
            }}
          >
            <p className="zodiac-description" style={{
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '1rem'
            }}>
              {getElementDescription()}
            </p>
            
            <div className="zodiac-traits" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <div>
                <h5 style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: color,
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase'
                }}>
                  Strengths
                </h5>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  {getStrengths(element)}
                </p>
              </div>
              <div>
                <h5 style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: color,
                  marginBottom: '0.25rem',
                  textTransform: 'uppercase'
                }}>
                  Challenges
                </h5>
                <p style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  {getChallenges(element)}
                </p>
              </div>
            </div>

            <button
              className="zodiac-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: `linear-gradient(135deg, ${color}, ${color}80)`,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to full horoscope
              }}
              aria-label={`Read full ${name} horoscope`}
            >
              Read Full Horoscope
              <span role="img" aria-hidden="true">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="ripple-effect"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper functions
const getStrengths = (element: string): string => {
  switch (element) {
    case 'fire': return 'Courage, passion, leadership';
    case 'earth': return 'Stability, patience, reliability';
    case 'air': return 'Communication, adaptability, intellect';
    case 'water': return 'Empathy, intuition, healing';
    default: return 'Unique cosmic gifts';
  }
};

const getChallenges = (element: string): string => {
  switch (element) {
    case 'fire': return 'Impulsiveness, aggression';
    case 'earth': return 'Stubbornness, materialism';
    case 'air': return 'Indecision, detachment';
    case 'water': return 'Oversensitivity, moodiness';
    default: return 'Personal growth areas';
  }
};

export default ZodiacCard;