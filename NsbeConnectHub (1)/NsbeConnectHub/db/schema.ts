import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  major: text("major"),
  graduationYear: integer("graduation_year"),
  profileImage: text("profile_image"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  maxAttendees: integer("max_attendees"),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: text("status").default("pending"),
  feedback: text("feedback"),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // technical, behavioral
  status: text("status").default("scheduled"),
  notes: text("notes"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  status: text("status").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  maxParticipants: integer("max_participants"),
});

export const projectParticipants = pgTable("project_participants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  role: text("role").notNull(),
});

// Relations
export const userRelations = relations(users, ({ many }) => ({
  eventRegistrations: many(eventRegistrations, {
    relationName: "userRegistrations"
  }),
  resumes: many(resumes),
  interviews: many(interviews),
  projectParticipants: many(projectParticipants),
}));

export const eventRelations = relations(events, ({ many }) => ({
  registrations: many(eventRegistrations, {
    relationName: "eventRegistrations"
  }),
}));

export const eventRegistrationRelations = relations(eventRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
    relationName: "userRegistrations"
  }),
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
    relationName: "eventRegistrations"
  }),
}));

export const projectRelations = relations(projects, ({ many }) => ({
  participants: many(projectParticipants),
}));

export const projectParticipantRelations = relations(projectParticipants, ({ one }) => ({
  user: one(users, {
    fields: [projectParticipants.userId],
    references: [users.id]
  }),
  project: one(projects, {
    fields: [projectParticipants.projectId],
    references: [projects.id]
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

// Types
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;