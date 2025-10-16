export const getBygningAtPunkt = async (x: number, y: number) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const query = `https://bygning.api.norkart.no/bygninger/byposition?x=${x}&y=${y}&MaxRadius=1&GeometryTextFormat=GeoJson&IncludeFkbData=true`;

  try {
    const apiResult = await fetch(query, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-WAAPI-TOKEN': `${apiKey}`,
      },
    });

    if (apiResult.ok) {
      const data = await apiResult.json();
      return data;
    } else {
      console.error('API request failed with status:', apiResult.status);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
    return null;
  }
};
