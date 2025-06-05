import React from 'react'

type CardType = 'design-trick' | 'healthy-habit' | 'thinking-trap' | 'alternative-thought' | 'action' | 'card-back'

interface TrickyTechPlaceholderProps {
  type: CardType
  name: string
}

const TrickyTechPlaceholder: React.FC<TrickyTechPlaceholderProps> = ({ type, name }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'design-trick':
      case 'thinking-trap':
        return 'bg-gradient-to-br from-red-100 to-red-200'
      case 'healthy-habit':
      case 'alternative-thought':
        return 'bg-gradient-to-br from-green-100 to-green-200'
      case 'action':
        return 'bg-gradient-to-br from-purple-100 to-purple-200'
      case 'card-back':
        return 'bg-gradient-to-br from-gray-100 to-gray-200'
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200'
    }
  }

  const getEmoji = () => {
    switch (type) {
      case 'design-trick':
      case 'thinking-trap':
        return '🌪️'
      case 'healthy-habit':
      case 'alternative-thought':
        return '🌟'
      case 'action':
        return '✨'
      case 'card-back':
        return '🎴'
      default:
        return '❓'
    }
  }

  return (
    <div className={`w-full h-full ${getBackgroundColor()} flex flex-col items-center justify-center p-4 text-center`}>
      <span className="text-4xl mb-4">{getEmoji()}</span>
      {type !== 'card-back' && (
        <h3 className="font-semibold text-gray-800">{name}</h3>
      )}
    </div>
  )
}

export default TrickyTechPlaceholder 