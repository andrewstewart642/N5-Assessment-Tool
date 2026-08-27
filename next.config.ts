import type {
  NextConfig,
} from "next";


const nextConfig:
  NextConfig = {
    serverExternalPackages: [
      "puppeteer-core",
      "@sparticuz/chromium",
      "katex",
    ],


    turbopack: {
      root:
        process.cwd(),
    },


    async rewrites() {
      return [
        {
          source:
            "/compile-assessment",

          destination:
            "/?__vecedRoute=compile-assessment",
        },

        {
          source:
            "/create-assessment",

          destination:
            "/?__vecedRoute=create-assessment",
        },

        {
          source:
            "/create-assessment/builder",

          destination:
            "/?__vecedRoute=assessment-creator",
        },

        {
          source:
            "/my-assessments",

          destination:
            "/?__vecedRoute=my-assessments",
        },

        {
          source:
            "/my-classes",

          destination:
            "/?__vecedRoute=my-classes",
        },

        {
          source:
            "/my-classes/:classId",

          destination:
            "/?__vecedRoute=class-details&classId=:classId",
        },

        {
          source:
            "/dev/generator-tester",

          destination:
            "/?__vecedRoute=generator-tester",
        },
      ];
    },
  };


export default nextConfig;