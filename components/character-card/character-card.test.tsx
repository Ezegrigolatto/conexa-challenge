import { screen } from '@testing-library/react';
import CharacterCard from '@/components/character-card';
import { createMockCharacter, renderWithProviders, userEvent } from '@/test-utils';

describe('CharacterCard', () => {
  const defaultProps = {
    character: createMockCharacter(),
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render character name', () => {
      renderWithProviders(<CharacterCard {...defaultProps} />);
      
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    it('should render character image', () => {
      renderWithProviders(<CharacterCard {...defaultProps} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', defaultProps.character.image);
    });

    it('should render character species', () => {
      renderWithProviders(<CharacterCard {...defaultProps} />);
      
      expect(screen.getByText(/Human/)).toBeInTheDocument();
    });

    it('should render status indicator for alive character', () => {
      const aliveCharacter = createMockCharacter({ status: 'Alive' });
      renderWithProviders(
        <CharacterCard {...defaultProps} character={aliveCharacter} />
      );
      
      expect(screen.getByText(/CharacterCard\.status\.alive/)).toBeInTheDocument();
    });

    it('should render status indicator for dead character', () => {
      const deadCharacter = createMockCharacter({ status: 'Dead' });
      renderWithProviders(
        <CharacterCard {...defaultProps} character={deadCharacter} />
      );
      
      expect(screen.getByText(/CharacterCard\.status\.dead/)).toBeInTheDocument();
    });

    it('should render status indicator for unknown status', () => {
      const unknownCharacter = createMockCharacter({ status: 'unknown' });
      renderWithProviders(
        <CharacterCard {...defaultProps} character={unknownCharacter} />
      );
      
      expect(screen.getByText(/CharacterCard\.status\.unknown/)).toBeInTheDocument();
    });
  });

  describe('selection state', () => {
    it('should show check icon when selected', () => {
      renderWithProviders(<CharacterCard {...defaultProps} selected />);
      
      const card = screen.getByText('Rick Sanchez').closest('div')?.parentElement;
      expect(card).toHaveClass('border-sidebar-primary');
    });
  });

  describe('disabled state', () => {
    it('should show "already selected" text when disabled', () => {
      renderWithProviders(<CharacterCard {...defaultProps} disabled />);
      
      expect(screen.getByText('CharacterCard.already-selected')).toBeInTheDocument();
    });

    it('should have aria-disabled attribute when disabled', () => {
      const { container } = renderWithProviders(
        <CharacterCard {...defaultProps} disabled />
      );
      
      const card = container.firstChild;
      expect(card).toHaveAttribute('aria-disabled', 'true');
    });

    it('should not call onClick when disabled and clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      renderWithProviders(
        <CharacterCard {...defaultProps} onClick={onClick} disabled />
      );
      
      const card = screen.getByText('Rick Sanchez').closest('div')?.parentElement;
      if (card) {
        await user.click(card);
      }
      
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('interactions', () => {
    it('should call onClick when card is clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      
      renderWithProviders(<CharacterCard {...defaultProps} onClick={onClick} />);
      
      const card = screen.getByText('Rick Sanchez').closest('div')?.parentElement;
      if (card) {
        await user.click(card);
      }
      
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});