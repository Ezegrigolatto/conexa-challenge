import { screen } from '@testing-library/react';
import EpisodeCard from '@/components/episodes-card';
import { createMockEpisode, renderWithProviders } from '@/test-utils';

jest.mock('@/components/episode-popup', () => ({
  __esModule: true,
  default: ({
    children,
    episodeId,
  }: {
    children: React.ReactNode;
    episodeId: number;
  }) => <div data-testid={`episode-popover-${episodeId}`}>{children}</div>,
}));

describe('EpisodeCard', () => {
  const defaultProps = {
    episode: createMockEpisode(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render episode name', () => {
      renderWithProviders(<EpisodeCard {...defaultProps} />);

      expect(screen.getByText('Pilot')).toBeInTheDocument();
    });

    it('should render episode and season number', () => {
      renderWithProviders(<EpisodeCard {...defaultProps} />);

      expect(screen.getByText('S01E01')).toBeInTheDocument();
    });

    it('should render air date with label', () => {
      renderWithProviders(<EpisodeCard {...defaultProps} />);

      expect(screen.getByText(/EpisodeCard\.air-date/)).toBeInTheDocument();
      expect(screen.getByText(/December 2, 2013/)).toBeInTheDocument();
    });

    it('should be wrapped in EpisodeDetailsPopover', () => {
      renderWithProviders(<EpisodeCard {...defaultProps} />);

      expect(screen.getByTestId('episode-popover-1')).toBeInTheDocument();
    });
  });

  describe('popover integration', () => {
    it('should pass episodeId to popover', () => {
      const episode = createMockEpisode({ id: 42 });

      renderWithProviders(<EpisodeCard {...defaultProps} episode={episode} />);

      expect(screen.getByTestId('episode-popover-42')).toBeInTheDocument();
    });

    it('should pass onPopoverOpenChange callback', () => {
      const onPopoverOpenChange = jest.fn();

      renderWithProviders(
        <EpisodeCard {...defaultProps} onPopoverOpenChange={onPopoverOpenChange} />
      );
      expect(screen.getByTestId('episode-popover-1')).toBeInTheDocument();
    });
  });
});
