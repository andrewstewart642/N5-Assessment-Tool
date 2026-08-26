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

import HomePage from "@/app/UI/Application/Home/HomePage";

type ApplicationPageProps = {
  searchParams:
    Promise<{
      __vecedRoute?:
        string | string[];

      classId?:
        string | string[];
    }>;
};

function firstValue(
  value:
    | string
    | string[]
    | undefined,
) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function ApplicationPage({
  searchParams,
}: ApplicationPageProps) {
  const params =
    await searchParams;

  const route =
    firstValue(
      params.__vecedRoute,
    );

  if (!route) {
    return (
      <HomePage />
    );
  }

  if (
    route ===
    "compile-assessment"
  ) {
    return (
      <AssessmentCompilationPage />
    );
  }

  if (
    route ===
    "create-assessment"
  ) {
    return (
      <AssessmentSetupPage />
    );
  }

  if (
    route ===
    "assessment-creator"
  ) {
    return (
      <AssessmentCreatorPage />
    );
  }

  if (
    route ===
    "my-assessments"
  ) {
    return (
      <MyAssessmentsPage />
    );
  }

  if (
    route ===
    "my-classes"
  ) {
    return (
      <MyClassesPage />
    );
  }

  if (
    route ===
    "class-details"
  ) {
    const classId =
      firstValue(
        params.classId,
      );

    if (!classId) {
      notFound();
    }

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
    route ===
    "generator-tester"
  ) {
    return (
      <GeneratorTesterPage />
    );
  }

  notFound();
}