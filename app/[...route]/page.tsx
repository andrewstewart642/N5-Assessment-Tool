import {
  notFound,
} from "next/navigation";

import AssessmentCompilationPage from "@/app/Assessments/Compilation/AssessmentCompilationPage";
import AssessmentCreatorPage from "@/app/Assessments/Creation/AssessmentCreatorPage";
import AssessmentSetupPage from "@/app/Assessments/Creation/AssessmentSetupPage";
import MyAssessmentsPage from "@/app/Assessments/MyAssessments/MyAssessmentsPage";

import ClassDetailsPage from "@/app/Classes/ClassDetailsPage";
import MyClassesPage from "@/app/Classes/MyClassesPage";

import GeneratorTesterPage from "@/app/DeveloperTools/GeneratorTester/GeneratorTesterPage";

type ApplicationRoutePageProps = {
  params:
    Promise<{
      route:
        string[];
    }>;
};

export default async function ApplicationRoutePage({
  params,
}: ApplicationRoutePageProps) {
  const {
    route,
  } =
    await params;

  if (
    route.length === 1 &&
    route[0] === "compile-assessment"
  ) {
    return (
      <AssessmentCompilationPage />
    );
  }

  if (
    route.length === 1 &&
    route[0] === "create-assessment"
  ) {
    return (
      <AssessmentSetupPage />
    );
  }

  if (
    route.length === 2 &&
    route[0] === "create-assessment" &&
    route[1] === "builder"
  ) {
    return (
      <AssessmentCreatorPage />
    );
  }

  if (
    route.length === 1 &&
    route[0] === "my-assessments"
  ) {
    return (
      <MyAssessmentsPage />
    );
  }

  if (
    route.length === 1 &&
    route[0] === "my-classes"
  ) {
    return (
      <MyClassesPage />
    );
  }

  if (
    route.length === 2 &&
    route[0] === "my-classes"
  ) {
    const classId =
      route[1];

    const classParams =
      Promise.resolve({
        classId,
      });

    return (
      <ClassDetailsPage
        params={classParams}
      />
    );
  }

  if (
    route.length === 2 &&
    route[0] === "dev" &&
    route[1] === "generator-tester"
  ) {
    return (
      <GeneratorTesterPage />
    );
  }

  notFound();
}