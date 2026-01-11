import { screen } from '@testing-library/react';
import EpisodesSection from '@/components/episodes-section';
import { renderWithProviders } from '../../test-utils';

jest.mock('@/components/episodes-list', () => ({
  __esModule: true,
  default: ({ listIndex, selectedCharacterIds }: { 
    listIndex?: number; 
    selectedCharacterIds?: number[];
  }) => (
    <div data-testid={`episodes-list-${listIndex}`}>
      <span data-testid="selected-ids">{JSON.stringify(selectedCharacterIds)}</span>
    </div>
  ),
}));

describe('EpisodesSection', () => {
  describe('visibility', () => {
    it('should be hidden when no characters are selected', () => {
      const { container } = renderWithProviders(
        <EpisodesSection selectedCharacter1={null} selectedCharacter2={null} />
      );
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('opacity-0');
      expect(section).toHaveClass('h-[1px]');
    });

    it('should be hidden when only first character is selected', () => {
      const { container } = renderWithProviders(
        <EpisodesSection selectedCharacter1={1} selectedCharacter2={null} />
      );
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('opacity-0');
    });

    it('should be hidden when only second character is selected', () => {
      const { container } = renderWithProviders(
        <EpisodesSection selectedCharacter1={null} selectedCharacter2={2} />
      );
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('opacity-0');
    });

    it('should be visible when both characters are selected', () => {
      const { container } = renderWithProviders(
        <EpisodesSection selectedCharacter1={1} selectedCharacter2={2} />
      );
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('opacity-100');
      expect(section).toHaveClass('h-[40vh]');
    });
  });

  describe('EpisodesList rendering', () => {
    it('should render three EpisodesList components', () => {
      renderWithProviders(
        <EpisodesSection selectedCharacter1={1} selectedCharacter2={2} />
      );
      
      expect(screen.getByTestId('episodes-list-1')).toBeInTheDocument();
      expect(screen.getByTestId('episodes-list-2')).toBeInTheDocument();
      expect(screen.getByTestId('episodes-list-3')).toBeInTheDocument();
    });

    it('should pass only first character to list 1', () => {
      renderWithProviders(
        <EpisodesSection selectedCharacter1={1} selectedCharacter2={2} />
      );
      
      const list1 = screen.getByTestId('episodes-list-1');
      const selectedIds = list1.querySelector('[data-testid="selected-ids"]');
      expect(selectedIds?.textContent).toBe('[1]');
    });

    it('should pass both characters to list 2', () => {
      renderWithProviders(
        <EpisodesSection selectedCharacter1={1} selectedCharacter2={2} />
      );
      
      const list2 = screen.getByTestId('episodes-list-2');
      const selectedIds = list2.querySelector('[data-testid="selected-ids"]');
      expect(selectedIds?.textContent).toBe('[1,2]');
    });

    it('should pass only second character to list 3', () => {
      renderWithProviders(
        <EpisodesSection selectedCharacter1={1} selectedCharacter2={2} />
      );
      
      const list3 = screen.getByTestId('episodes-list-3');
      const selectedIds = list3.querySelector('[data-testid="selected-ids"]');
      expect(selectedIds?.textContent).toBe('[2]');
    });
  });
});