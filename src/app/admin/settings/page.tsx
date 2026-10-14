import SettingsManager from "@/components/admin/SettingsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإعدادات",
};

export default function SettingsPage() {
  return <SettingsManager />;
}