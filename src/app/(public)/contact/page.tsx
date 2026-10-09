import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description:
    "تواصل مع فريق Code Tech — نحن هنا للإجابة على استفساراتك ومساعدتك في مشاريعك التقنية.",
};

export default function ContactPage() {
  return <ContactContent />;
}