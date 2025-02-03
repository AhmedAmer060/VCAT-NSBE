import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { 
  users, events, resumes, interviews, projects,
  eventRegistrations, projectParticipants
} from "@db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { sendNotificationEmail } from "./utils/email";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Events
  app.get("/api/events", async (req, res) => {
    const upcomingEvents = await db.query.events.findMany({
      where: gte(events.date, new Date()),
      orderBy: [desc(events.date)],
      with: {
        registrations: {
          columns: {
            id: true,
            userId: true,
          },
        },
      },
    });
    res.json(upcomingEvents);
  });
  
  app.post("/api/events/register", async (req, res) => {
    const { userId, eventId } = req.body;
    const result = await db.insert(eventRegistrations).values({
      userId,
      eventId,
    }).returning();

    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId)
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    await sendNotificationEmail(
      "New Event Registration",
      `
      <h2>New Event Registration</h2>
      <p><strong>Event:</strong> ${event?.title}</p>
      <p><strong>Student:</strong> ${user?.fullName}</p>
      <p><strong>Email:</strong> ${user?.email}</p>
      <p><strong>Major:</strong> ${user?.major}</p>
      `
    );

    res.json(result[0]);
  });

  // Resume Upload
  app.post("/api/resumes", async (req, res) => {
    const { userId, fileUrl } = req.body;
    const result = await db.insert(resumes).values({
      userId,
      fileUrl,
      status: "pending",
    }).returning();

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    await sendNotificationEmail(
      "New Resume Submission",
      `
      <h2>New Resume Submission</h2>
      <p><strong>Student:</strong> ${user?.fullName}</p>
      <p><strong>Email:</strong> ${user?.email}</p>
      <p><strong>Major:</strong> ${user?.major}</p>
      <p><strong>Resume Link:</strong> <a href="${fileUrl}">View Resume</a></p>
      `
    );

    res.json(result[0]);
  });

  // Interview Scheduling
  app.post("/api/interviews", async (req, res) => {
    const { userId, date, type } = req.body;
    const result = await db.insert(interviews).values({
      userId,
      date: new Date(date),
      type,
      status: "scheduled",
    }).returning();

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    await sendNotificationEmail(
      "New Interview Request",
      `
      <h2>New Mock Interview Request</h2>
      <p><strong>Student:</strong> ${user?.fullName}</p>
      <p><strong>Email:</strong> ${user?.email}</p>
      <p><strong>Major:</strong> ${user?.major}</p>
      <p><strong>Interview Type:</strong> ${type}</p>
      <p><strong>Requested Date:</strong> ${new Date(date).toLocaleString()}</p>
      `
    );

    res.json(result[0]);
  });

  app.get("/api/interviews/:userId", async (req, res) => {
    const { userId } = req.params;
    const userInterviews = await db.query.interviews.findMany({
      where: eq(interviews.userId, parseInt(userId)),
      orderBy: [desc(interviews.date)],
    });
    res.json(userInterviews);
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    const activeProjects = await db.query.projects.findMany({
      where: eq(projects.status, "active"),
      with: {
        participants: {
          columns: {
            id: true,
            userId: true,
            role: true,
          },
        },
      },
    });
    res.json(activeProjects);
  });

  app.post("/api/projects/join", async (req, res) => {
    const { userId, projectId, role } = req.body;
    const result = await db.insert(projectParticipants).values({
      userId,
      projectId,
      role,
    }).returning();

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId)
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    await sendNotificationEmail(
      "New Project Participant",
      `
      <h2>New Project Join Request</h2>
      <p><strong>Project:</strong> ${project?.title}</p>
      <p><strong>Student:</strong> ${user?.fullName}</p>
      <p><strong>Email:</strong> ${user?.email}</p>
      <p><strong>Major:</strong> ${user?.major}</p>
      <p><strong>Role:</strong> ${role}</p>
      `
    );

    res.json(result[0]);
  });

  return httpServer;
}