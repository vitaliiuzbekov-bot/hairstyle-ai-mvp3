export const trackEvent = async (event: string, metadata: any = {}) => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId || userId === "local-user") return;

    // Use sendBeacon for best effort, non-blocking delivery if supported and body is small enough
    // But fetch is fine since we catch errors.
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, event, timestamp: Date.now(), ...metadata })
    }).catch(() => {
        // fail-open
    });
  } catch (e) {
    // fail-open
  }
};
