import { notFound } from "next/navigation";

import AssessmentCompilationPage from "@/app/Assessments/Compilation/AssessmentCompilationPage";
import AssessmentCreatorPage from "@/app/Assessments/Creation/AssessmentCreatorPage";
import AssessmentSetupPage from "@/app/Assessments/Creation/AssessmentSetupPage";
import ClassDetailsPage from "@/app/Classes/ClassDetailsPage";
import MyClassesPage from "@/app/Classes/MyClassesPage";
import A7GeneratorTesterPage from "@/app/DeveloperTools/GeneratorTester/A7GeneratorTesterPage";
import G1GeneratorTesterPage from "@/app/DeveloperTools/GeneratorTester/G1GeneratorTesterPage";
import GeneratorTesterHubPage from "@/app/DeveloperTools/GeneratorTester/GeneratorTesterHubPage";
import GeneratorTesterPage from "@/app/DeveloperTools/GeneratorTester/GeneratorTesterPage";
import N2GeneratorTesterPage from "@/app/DeveloperTools/GeneratorTester/N2GeneratorTesterPage";
import HomePage from "@/app/Home/HomePage";
import MyAssessmentsPage from "@/app/MyAssessments/MyAssessmentsPage";

type ApplicationPageProps = {
  searchParams: Promise<{
    __vecedRoute?: string | string[];
    classId?: string | string[];
  }>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ApplicationPage({ searchParams }: ApplicationPageProps) {
  const params = await searchParams;
  const route = firstValue(params.__vecedRoute);

  if (!route) return <HomePage />;
  if (route === "compile-assessment") return <AssessmentCompilationPage />;
  if (route === "create-assessment") return <AssessmentSetupPage />;
  if (route === "assessment-creator") return <AssessmentCreatorPage />;
  if (route === "my-assessments") return <MyAssessmentsPage />;
  if (route === "my-classes") return <MyClassesPage />;

  if (route === "class-details") {
    const classId = firstValue(params.classId);
    if (!classId) notFound();
    return <ClassDetailsPage params={Promise.resolve({ classId })} />;
  }

  // Legacy query-route compatibility now lands on the same one-stop developer hub.
  if (route === "generator-tester") return <GeneratorTesterHubPage />;
  if (route === "generator-tester-a7-debug") return <A7GeneratorTesterPage />;
  if (route === "generator-tester-a8") return <GeneratorTesterPage />;
  if (route === "generator-tester-n2") return <N2GeneratorTesterPage />;
  if (route === "generator-tester-g1") return <G1GeneratorTesterPage />;

  notFound();
}
