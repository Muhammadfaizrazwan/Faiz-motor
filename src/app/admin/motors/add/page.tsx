import { MotorForm } from "@/components/admin/MotorForm";

export const metadata = {
  title: "Tambah Motor | MotoMart Admin",
};

export default function AddMotorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <MotorForm />
    </div>
  );
}
