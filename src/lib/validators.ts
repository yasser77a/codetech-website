// ============================================
// CodeTech Website - Validators
// التحقق من صحة المدخلات (بدون مكتبات خارجية)
// ============================================

// ============================================
// أنواع الأخطاء
// ============================================
export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
  }
  
  // ============================================
  // التحقق من نص
  // ============================================
  export function validateString(
    value: unknown,
    fieldName: string,
    minLength = 1,
    maxLength = 10000
  ): { error?: string; value?: string } {
    if (typeof value !== "string") {
      return { error: `${fieldName} يجب أن يكون نصاً` };
    }
    const trimmed = value.trim();
    if (trimmed.length < minLength) {
      return { error: `${fieldName} يجب أن يكون ${minLength} أحرف على الأقل` };
    }
    if (trimmed.length > maxLength) {
      return { error: `${fieldName} يجب أن يكون أقل من ${maxLength} حرف` };
    }
    return { value: trimmed };
  }
  
  // ============================================
  // التحقق من slug
  // ============================================
  export function validateSlug(value: unknown): { error?: string; value?: string } {
    if (typeof value !== "string") {
      return { error: "الرابط يجب أن يكون نصاً" };
    }
    const trimmed = value.trim();
    if (!/^[a-z0-9-]+$/.test(trimmed)) {
      return { error: "الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط" };
    }
    return { value: trimmed };
  }
  
  // ============================================
  // توليد slug من النص العربي/الإنجليزي
  // ============================================
  export function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 80);
  }
  
  // ============================================
  // التحقق من عنوان URL
  // ============================================
  export function validateUrl(value: unknown): { error?: string; value?: string } {
    if (value === null || value === undefined || value === "") {
      return { value: undefined };
    }
    if (typeof value !== "string") {
      return { error: "الرابط يجب أن يكون نصاً" };
    }
    try {
      const url = new URL(value);
      return { value: url.toString() };
    } catch {
      return { error: "رابط غير صحيح" };
    }
  }
  
  // ============================================
  // التحقق من المشروع (Project)
  // ============================================
  export interface ProjectInput {
    title: unknown;
    description: unknown;
    category: unknown;
    client?: unknown;
    technologies?: unknown;
    coverImage?: unknown;
    liveUrl?: unknown;
    githubUrl?: unknown;
    status?: unknown;
    featured?: unknown;
  }
  
  const VALID_CATEGORIES = ["WEBSITES", "APPS", "SYSTEMS", "GRADUATION"];
  const VALID_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  
  export function validateProject(input: ProjectInput): ValidationResult {
    const errors: Record<string, string> = {};
  
    // العنوان
    const titleResult = validateString(input.title, "العنوان", 3, 200);
    if (titleResult.error) errors.title = titleResult.error;
  
    // الوصف
    const descResult = validateString(input.description, "الوصف", 10, 5000);
    if (descResult.error) errors.description = descResult.error;
  
    // التصنيف
    if (typeof input.category !== "string" || !VALID_CATEGORIES.includes(input.category)) {
      errors.category = "التصنيف غير صحيح";
    }
  
    // الحالة (اختياري، افتراضي DRAFT)
    if (input.status !== undefined) {
      if (typeof input.status !== "string" || !VALID_STATUSES.includes(input.status)) {
        errors.status = "الحالة غير صحيحة";
      }
    }
  
    // العميل (اختياري)
    if (input.client !== undefined && input.client !== null && input.client !== "") {
      const clientResult = validateString(input.client, "العميل", 1, 200);
      if (clientResult.error) errors.client = clientResult.error;
    }
  
    // التقنيات (مصفوفة)
    if (input.technologies !== undefined) {
      if (!Array.isArray(input.technologies)) {
        errors.technologies = "التقنيات يجب أن تكون قائمة";
      } else if (input.technologies.some((t) => typeof t !== "string")) {
        errors.technologies = "كل تقنية يجب أن تكون نصاً";
      }
    }
  
    // الروابط
    if (input.liveUrl) {
      const result = validateUrl(input.liveUrl);
      if (result.error) errors.liveUrl = result.error;
    }
    if (input.githubUrl) {
      const result = validateUrl(input.githubUrl);
      if (result.error) errors.githubUrl = result.error;
    }
  
    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }