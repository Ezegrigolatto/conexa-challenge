import { screen } from '@testing-library/react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { renderWithProviders, userEvent } from '../../../test-utils';

const mockSetTheme = jest.fn();
let mockTheme = 'dark';

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
    resolvedTheme: mockTheme,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = 'dark';
  });

  describe('rendering', () => {
    it('should render a button', () => {
      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have sr-only class on the label', () => {
      renderWithProviders(<ThemeToggle />);

      const label = screen.getByText('Toggle theme');
      expect(label).toHaveClass('sr-only');
    });
  });

  describe('interactivity', () => {
    it('should toggle from dark to light when clicked in dark mode', async () => {
      mockTheme = 'dark';
      const user = userEvent.setup();

      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should toggle from light to dark when clicked in light mode', async () => {
      mockTheme = 'light';
      const user = userEvent.setup();

      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should call setTheme exactly once per click', async () => {
      const user = userEvent.setup();

      renderWithProviders(<ThemeToggle />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });
});
