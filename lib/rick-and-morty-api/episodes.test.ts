import { listEpisodes, getEpisodeById } from '@/lib/rick-and-morty-api/episodes';
import { fetchFromApi } from '@/lib/rick-and-morty-api';

jest.mock('@/lib/rick-and-morty-api', () => ({
  fetchFromApi: jest.fn(),
}));

const mockedFetchFromApi = fetchFromApi as jest.MockedFunction<typeof fetchFromApi>;

describe('Episodes API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listEpisodes', () => {
    it('should fetch episodes without page parameter', async () => {
      const mockResponse = {
        info: { count: 51, pages: 3, next: 'page2', prev: null },
        results: [{ id: 1, name: 'Pilot', episode: 'S01E01' }],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockResponse);

      const result = await listEpisodes();

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/episode');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch episodes with page parameter', async () => {
      const mockResponse = {
        info: { count: 51, pages: 3, next: 'page3', prev: 'page1' },
        results: [{ id: 21, name: 'The Wedding Squanchers', episode: 'S02E10' }],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockResponse);

      const result = await listEpisodes(2);

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/episode?page=2');
      expect(result).toEqual(mockResponse);
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockResponse);

      const result = await listEpisodes(100);

      expect(result.results).toEqual([]);
    });

  });

  describe('getEpisodeById', () => {
    it('should fetch a single episode by id', async () => {
      const mockEpisode = {
        id: 1,
        name: 'Pilot',
        air_date: 'December 2, 2013',
        episode: 'S01E01',
        characters: ['https://rickandmortyapi.com/api/character/1'],
      };
      mockedFetchFromApi.mockResolvedValueOnce(mockEpisode);

      const result = await getEpisodeById(1);

      expect(mockedFetchFromApi).toHaveBeenCalledWith('/episode/1');
      expect(result).toEqual(mockEpisode);
    });
  });
});