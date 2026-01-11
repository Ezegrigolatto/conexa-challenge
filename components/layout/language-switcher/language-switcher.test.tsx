import { screen, waitFor } from '@testing-library/react';
import LanguageSwitcher from '@/components/layout/language-switcher';
import { renderWithProviders, userEvent } from '../../../test-utils';

const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => '/en/some-page',
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  });

  describe('rendering', () => {
    it('should render the language button', () => {
      renderWithProviders(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should display English as default language', () => {
      renderWithProviders(<LanguageSwitcher />);
      
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should display Spanish when cookie is set to es', () => {
      document.cookie = 'NEXT_LOCALE=es; path=/';
      
      renderWithProviders(<LanguageSwitcher />);
      
      expect(screen.getByText('Español')).toBeInTheDocument();
    });
  });

  describe('dropdown menu', () => {
    it('should open dropdown when button is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<LanguageSwitcher />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(2);
      });
    });
  });

  describe('language switching', () => {
    it('should change to Spanish when Español is clicked', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<LanguageSwitcher />);
      
      await user.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        return menuItems.length === 2;
      });
      
      const spanishOption = screen.getAllByRole('menuitem')[1];
      await user.click(spanishOption);
      
      expect(mockPush).toHaveBeenCalledWith('/es/some-page');
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('should change to English when English is clicked', async () => {
      document.cookie = 'NEXT_LOCALE=es; path=/';
      const user = userEvent.setup();
      
      renderWithProviders(<LanguageSwitcher />);
      
      await user.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        return menuItems.length === 2;
      });
      
      const englishOption = screen.getAllByRole('menuitem')[0];
      await user.click(englishOption);
      
      expect(mockPush).toHaveBeenCalledWith('/en/some-page');
      expect(mockRefresh).toHaveBeenCalled();
    });

    it('should set cookie when language is changed', async () => {
      const user = userEvent.setup();
      
      renderWithProviders(<LanguageSwitcher />);
      
      await user.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        return menuItems.length === 2;
      });
      
      const spanishOption = screen.getAllByRole('menuitem')[1];
      await user.click(spanishOption);
      
      expect(document.cookie).toContain('NEXT_LOCALE=es');
    });
  });
});