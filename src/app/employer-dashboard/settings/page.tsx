import EmployerSettingsForm from "@/features/employers/components/employer-setting-form";
import {
  toOrganizationType,
  toTeamSize,
} from "@/features/employers/employers.schema";
import { getCurrentEmployerDetails } from "@/features/employers/server/employers.queries";
import { redirect } from "next/navigation";

const EmployerSettings = async () => {
  const employer = await getCurrentEmployerDetails();
  if (!employer) return redirect("/login");

  console.log("currentEmployer: ", employer);

  return (
    <div>
      <EmployerSettingsForm
        initialData={{
          name: employer.employerDetails.name ?? "",
          description: employer.employerDetails.description ?? "",
          organizationType: toOrganizationType(
            employer.employerDetails.organizationType
          ),
          teamSize: toTeamSize(employer.employerDetails.teamSize),
          location: employer.employerDetails.location ?? "",
          websiteUrl: employer.employerDetails.websiteUrl ?? "",
          yearOfEstablishment:
            employer.employerDetails.yearOfEstablishment?.toString(),
        }}
      />
    </div>
  );
};

export default EmployerSettings;
