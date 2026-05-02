import { notFound } from "next/navigation";
import { MotorForm } from "@/components/admin/MotorForm";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Edit Motor | MotoMart Admin",
};

export default async function EditMotorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const motor = await prisma.motor.findUnique({
    where: { id },
    include: {
      photos: {
        select: {
          id: true,
          url: true,
          publicId: true,
          isPrimary: true,
        },
        orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!motor) {
    notFound();
  }

  // Convert for the form
  const initialData = {
    ...motor,
    description: motor.description || "",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <MotorForm initialData={initialData} motorId={motor.id} />
    </div>
  );
}
