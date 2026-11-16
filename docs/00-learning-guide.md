
# 00 — Learning Guide

## Audience and prerequisites
This course assumes backend experience with HTTP, REST, TypeScript/Node.js, databases, authentication, testing, Git and Docker. You should know async functions, NestJS modules/providers/DI, JWT basics, SQL joins, indexes and transactions. Note any weak prerequisite and fill it as needed.

## Five-hour daily protocol
1. Understand (60 min): read, draw the flow and explain it without notes.
2. Build (120 min): implement the day's feature in the capstone.
3. Break it (60 min): invalid input, missing records, unauthorized access, concurrency and slow dependencies.
4. Prove it (60 min): tests, logs/SQL review, decision notes and interview explanation.

## Lesson template
For every topic answer: What problem does it solve? What happens internally? What is the smallest runnable example? What happens on invalid input/failure? What are the security and performance implications? What alternatives exist? How do I test it? How would I explain it in an interview?

## Mastery gates
A topic is complete only when you can explain it without notes, implement it independently, write positive/negative/boundary tests, identify failure modes and describe a production trade-off.

## Environment
Use a Node.js LTS release compatible with the selected NestJS version. Add NestJS GraphQL integration, Apollo driver/server, GraphQL runtime, PostgreSQL, Prisma, Jest and Docker Compose. Pin versions and commit the lockfile. Follow current official NestJS and Apollo docs for compatible versions.

## Learning log
Record date/day, topic, concept in your own words, implementation, tests, failure reproduced, root cause, production trade-off, 60–90 second interview explanation and unanswered questions.

## Safe use of examples
Verify package APIs against official docs. Treat generated code as untrusted until reviewed and tested. Never place credentials, production data or private customer logs in learning prompts.
