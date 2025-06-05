import React from 'react';
import styled from 'styled-components';

interface CardImageProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
}

const StyledPlaceholder = styled.div<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  min-height: 200px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const CardImage: React.FC<CardImageProps> = ({ src, alt, width, height }) => {
  // If the src starts with '/placeholder/', render a placeholder
  if (src.startsWith('/placeholder/')) {
    const text = alt || src.split('/').pop()?.split('.')[0].replace(/-/g, ' ');
    return (
      <StyledPlaceholder width={width} height={height}>
        {text}
      </StyledPlaceholder>
    );
  }

  // Otherwise render the actual image
  return (
    <img 
      src={src} 
      alt={alt} 
      style={{ 
        width: width || '100%', 
        height: height || '100%',
        objectFit: 'cover',
        borderRadius: '8px'
      }} 
    />
  );
};

export default CardImage; 