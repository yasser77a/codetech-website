// ============================================
// CodeTech Website - API Client
// دوال مساعدة للتواصل مع API Routes
// ============================================

// ============================================
// Types
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Record<string, string>;
  }
  
  // ============================================
  // معالج موحد للطلبات
  // ============================================
  async function apiRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
        return {
          success: false,
          error: data.error || `خطأ ${res.status}`,
          errors: data.errors,
        };
      }
  
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Error [${options.method || "GET"} ${url}]:`, error);
      return {
        success: false,
        error: "تعذر الاتصال بالخادم",
      };
    }
  }
  
  // ============================================
  // GET
  // ============================================
  export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(url, { method: "GET" });
  }
  
  // ============================================
  // POST
  // ============================================
  export async function apiPost<T>(
    url: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  
  // ============================================
  // PATCH
  // ============================================
  export async function apiPatch<T>(
    url: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    return apiRequest<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }
  
  // ============================================
  // DELETE
  // ============================================
  export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
    return apiRequest<T>(url, { method: "DELETE" });
  }
  
  // ============================================
  // رفع ملف
  // ============================================
  export async function apiUpload(
    url: string,
    formData: FormData
  ): Promise<ApiResponse<{ url: string; path: string }>> {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        return {
          success: false,
          error: data.error || "فشل الرفع",
        };
      }
  
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`Upload Error [${url}]:`, error);
      return {
        success: false,
        error: "تعذر الاتصال بالخادم",
      };
    }
  }