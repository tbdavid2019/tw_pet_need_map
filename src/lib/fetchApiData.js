async function fetchApiData(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
  
  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (res.status !== 200 || !res.ok) {
      throw new Error(
        `[fetchAPIData] Error fetching data: ${res.status} ${res.statusText}`
      );
    }
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export default fetchApiData;
