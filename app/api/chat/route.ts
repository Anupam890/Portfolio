import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverClient } from "@/sanity/lib/serverClient";

export const runtime = "edge"; // optional but recommended

const genAI = new GoogleGenerativeAI("AIzaSyAwTbeOvZPE0vpgpDIvEgZBlc_KvMmCzok");

// Fetch all portfolio data from Sanity
async function getPortfolioData() {
  try {
    const [
      profile,
      projects,
      skills,
      experiences,
      education,
      certifications,
      achievements,
      blogs,
      services,
    ] = await Promise.all([
      serverClient.fetch(`*[_type == "profile"][0]`),
      serverClient.fetch(`*[_type == "project"] | order(startDate desc)`),
      serverClient.fetch(`*[_type == "skill"] | order(proficiency desc)`),
      serverClient.fetch(`*[_type == "experience"] | order(startDate desc)`),
      serverClient.fetch(`*[_type == "education"] | order(startDate desc)`),
      serverClient.fetch(`*[_type == "certification"] | order(issueDate desc)`),
      serverClient.fetch(`*[_type == "achievement"] | order(date desc)`),
      serverClient.fetch(`*[_type == "blog"] | order(publishedAt desc)`),
      serverClient.fetch(`*[_type == "service"]`),
    ]);

    return {
      profile,
      projects,
      skills,
      experiences,
      education,
      certifications,
      achievements,
      blogs,
      services,
    };
  } catch (error) {
    console.error("Error fetching Sanity data:", error);
    return null;
  }
}

// Format portfolio data into a context string
function formatPortfolioContext(data: any) {
  if (!data) return "";

  const {
    profile,
    projects,
    skills,
    experiences,
    education,
    certifications,
    achievements,
    blogs,
    services,
  } = data;

  let context = "# Portfolio Information\n\n";

  // Profile Section
  if (profile) {
    context += `## Profile\n`;
    context += `Name: ${profile.firstName} ${profile.lastName}\n`;
    context += `Headline: ${profile.headline}\n`;
    if (profile.shortBio) context += `Bio: ${profile.shortBio}\n`;
    if (profile.email) context += `Email: ${profile.email}\n`;
    if (profile.location) context += `Location: ${profile.location}\n`;
    if (profile.yearsOfExperience)
      context += `Years of Experience: ${profile.yearsOfExperience}\n`;
    if (profile.availability)
      context += `Availability: ${profile.availability}\n`;
    context += "\n";
  }

  // Projects Section
  if (projects?.length > 0) {
    context += `## Projects (${projects.length})\n`;
    projects.forEach((project: any, index: number) => {
      context += `${index + 1}. **${project.title}**\n`;
      if (project.description)
        context += `   Description: ${project.description}\n`;
      if (project.technologies?.length)
        context += `   Technologies: ${project.technologies.join(", ")}\n`;
      if (project.category) context += `   Category: ${project.category}\n`;
      if (project.featured) context += `   Featured Project: Yes\n`;
      if (project.githubUrl) context += `   GitHub: ${project.githubUrl}\n`;
      if (project.liveUrl) context += `   Live URL: ${project.liveUrl}\n`;
      context += "\n";
    });
  }

  // Skills Section
  if (skills?.length > 0) {
    context += `## Skills (${skills.length})\n`;
    const grouped = skills.reduce((acc: any, skill: any) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});

    Object.entries(grouped).forEach(
      ([category, categorySkills]: [string, any]) => {
        context += `### ${category}\n`;
        categorySkills.forEach((skill: any) => {
          context += `- ${skill.name}`;
          if (skill.proficiency) context += ` (${skill.proficiency}%)`;
          context += "\n";
        });
        context += "\n";
      },
    );
  }

  // Experience Section
  if (experiences?.length > 0) {
    context += `## Work Experience (${experiences.length})\n`;
    experiences.forEach((exp: any, index: number) => {
      context += `${index + 1}. **${exp.position}** at ${exp.company}\n`;
      if (exp.startDate)
        context += `   Duration: ${exp.startDate} - ${exp.current ? "Present" : exp.endDate || "N/A"}\n`;
      if (exp.location) context += `   Location: ${exp.location}\n`;
      if (exp.description) context += `   Description: ${exp.description}\n`;
      if (exp.responsibilities?.length) {
        context += `   Responsibilities:\n`;
        exp.responsibilities.forEach((resp: string) => {
          context += `   - ${resp}\n`;
        });
      }
      context += "\n";
    });
  }

  // Education Section
  if (education?.length > 0) {
    context += `## Education (${education.length})\n`;
    education.forEach((edu: any, index: number) => {
      context += `${index + 1}. **${edu.degree}** in ${edu.fieldOfStudy || "N/A"}\n`;
      context += `   Institution: ${edu.institution}\n`;
      if (edu.startDate)
        context += `   Duration: ${edu.startDate} - ${edu.current ? "Present" : edu.endDate || "N/A"}\n`;
      if (edu.grade) context += `   Grade: ${edu.grade}\n`;
      if (edu.description) context += `   Description: ${edu.description}\n`;
      context += "\n";
    });
  }

  // Certifications Section
  if (certifications?.length > 0) {
    context += `## Certifications (${certifications.length})\n`;
    certifications.forEach((cert: any, index: number) => {
      context += `${index + 1}. **${cert.name}**\n`;
      context += `   Issuer: ${cert.issuer}\n`;
      if (cert.issueDate) context += `   Issued: ${cert.issueDate}\n`;
      if (cert.expiryDate) context += `   Expires: ${cert.expiryDate}\n`;
      if (cert.credentialUrl)
        context += `   Credential: ${cert.credentialUrl}\n`;
      context += "\n";
    });
  }

  // Achievements Section
  if (achievements?.length > 0) {
    context += `## Achievements (${achievements.length})\n`;
    achievements.forEach((achievement: any, index: number) => {
      context += `${index + 1}. **${achievement.title}**\n`;
      if (achievement.description) context += `   ${achievement.description}\n`;
      if (achievement.date) context += `   Date: ${achievement.date}\n`;
      context += "\n";
    });
  }

  // Services Section
  if (services?.length > 0) {
    context += `## Services Offered (${services.length})\n`;
    services.forEach((service: any, index: number) => {
      context += `${index + 1}. **${service.title}**\n`;
      if (service.description) context += `   ${service.description}\n`;
      context += "\n";
    });
  }

  // Blog Posts Section
  if (blogs?.length > 0) {
    context += `## Blog Posts (${blogs.length})\n`;
    blogs.forEach((blog: any, index: number) => {
      context += `${index + 1}. **${blog.title}**\n`;
      if (blog.excerpt) context += `   ${blog.excerpt}\n`;
      if (blog.publishedAt) context += `   Published: ${blog.publishedAt}\n`;
      if (blog.tags?.length) context += `   Tags: ${blog.tags.join(", ")}\n`;
      context += "\n";
    });
  }

  return context;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    const { messages = [], systemPrompt = "" } = await req.json();

    if (!messages.length) {
      return NextResponse.json(
        { error: "Messages array is empty" },
        { status: 400 },
      );
    }

    // Fetch portfolio data from Sanity
    const portfolioData = await getPortfolioData();
    const portfolioContext = formatPortfolioContext(portfolioData);

    // Build enhanced system prompt with portfolio data
    const enhancedSystemPrompt = `${systemPrompt}

${portfolioContext}

You are a helpful AI assistant with access to complete portfolio information above. 
Use this information to answer questions accurately about the person's profile, projects, 
skills, experience, education, certifications, achievements, blog posts, and services.

When answering questions:
- Be specific and reference actual data from the portfolio
- If asked about projects, skills, or experience, provide detailed and relevant information
- Be professional and concise
- If you don't have information about something, say so clearly
- Format your responses in a clear, readable way`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: enhancedSystemPrompt,
    });

    // Build conversation context
    const prompt = messages
      .map((msg: { role: string; content: string }) => {
        const role =
          msg.role === "assistant"
            ? "Assistant"
            : msg.role === "system"
              ? "System"
              : "User";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
