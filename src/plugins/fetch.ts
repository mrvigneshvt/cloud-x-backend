//interface fetchWithRetryType(
//  url:string,
//
//)

export const fetchWithRetry = async (
  url: string,
  options: {
    method: string;
    headers: {
      accept: string;
      Authorization: string;
    };
  },
  retries = 3,
  delay = 1000,
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return await response.json();

      console.log(
        `Attempt ${i + 1} failed: ${response.status} ${response.statusText}`,
      );

      if (response.status >= 500) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
        continue;
      } else {
        return null;
      }
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error}`);
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  return null;
};
