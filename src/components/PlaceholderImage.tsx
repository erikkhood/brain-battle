import React from 'react';
import styled from 'styled-components';

interface PlaceholderImageProps {
  width?: string;
  height?: string;
  text?: string;
  backgroundColor?: string;
}

const StyledPlaceholder = styled.div<PlaceholderImageProps>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  background-color: ${props => props.backgroundColor || '#e0e0e0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
`;

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ width, height, text, backgroundColor }) => {
  return (
    <StyledPlaceholder 
      width={width} 
      height={height} 
      backgroundColor={backgroundColor}
    >
      {text || 'Image placeholder'}
    </StyledPlaceholder>
  );
};

export default PlaceholderImage; 