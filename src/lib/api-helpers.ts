// ============================================
// API Helpers - دوال مساعدة
// ============================================

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || `خطأ ${res.status}` };
    }

    return { success: true, data };
  } catch (error) {
    console.error(`API Error [${options.method || "GET"} ${url}]:`, error);
    return { success: false, error: "تعذر الاتصال بالخادم" };
  }
}