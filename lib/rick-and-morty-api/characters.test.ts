import { listCharacters, getCharacterById } from '@/lib/rick-and-morty-api/characters';
import { fetchFromApi } from '@/lib/rick-and-morty-api';

jest.mock('@/lib/rick-and-morty-api', () => ({
  fetchFromApi: jest.fn(),
}));

const mockedFetchFromApi = fetchFromApi as jest.MockedFunction<typeof fetchFromApi>;

describe('Characters API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listCharacters', () => {
    it('should fetch characters without parameters', async () => {
      const mockResponse = {
        info: { count: 826, pages: 42, next: null, prev: null },
        results: [{ id: 1, name: 'Rick' }],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockResponse);

      const result = await listCharacters();

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/character');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch characters with page parameter', async () => {
      const mockResponse = {
        info: { count: 826, pages: 42, next: 'page3', prev: 'page1' },
        results: [{ id: 21, name: 'Aqua Morty' }],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockResponse);

      const result = await listCharacters(2);

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/character?page=2');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch characters with name filter', async () => {
      const mockResponse = {
        info: { count: 107, pages: 6, next: null, prev: null },
        results: [{ id: 1, name: 'Rick Sanchez' }],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockResponse);

      const result = await listCharacters(undefined, { name: 'Rick' });

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/character?name=Rick');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getCharacterById', () => {
    it('should fetch a single character by id', async () => {
      const mockCharacter = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockCharacter);

      const result = await getCharacterById(1);

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/character/1');
      expect(result).toEqual(mockCharacter);
    });
  });
});