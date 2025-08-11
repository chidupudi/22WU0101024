URL Shortener System Design
Overview
A full-stack URL shortener application built with React frontend, Node.js backend microservice, and comprehensive logging middleware. The system provides URL shortening capabilities with analytics, click tracking, and real-time monitoring through integration with Affordmed's evaluation server.
Architecture Components
Frontend Application (/client)
Technology Stack: React, Material-UI, Axios on port 3000
The frontend provides a user interface for URL creation and analytics. Key components include UrlShortenerPage for creating up to 5 URLs simultaniously, StatisticsPage for viewing analytics, and RedirectHandler for managing URL redirects with countdown timers. The application uses localStorage for data persistance and implements comprehensive client-side validation.
Backend Microservice (/server)
Technology Stack: Node.js, Express.js on port 8080
The backend provides RESTful APIs with three main endpoints:

POST /shorturls - Creates short URLs with optional custom shortcodes
GET /shorturls/:shortcode - Returns URL statistics and click data
GET /:shortcode - Handles redirection to original URLs

Data is stored in-memory using JavaScript Maps for fast lookups. The system validates URLs, generates unique shortcodes, tracks clicks with timestamps and referrer information, and manages URL expiration (default 30 minutes).
Logging Middleware (/logging-middleware)
Custom logging implementation that authenticates both frontend and backend with the evaluation server using JWT tokens. All significant actions are logged with stack identification (frontend/backend), severity levels (info/warn/error), and package categories (component/controller/service).
System Flow
URL Creation Process
Users submit URLs through the frontend form, which validates input and sends requests to the backend. The backend validates URLs, generates or validates custom shortcodes, creates URL entries with expiration times, and returns short links. All steps are logged to the evaluation server.
Redirection Process
When users access short URLs, the backend looks up the original URL, checks expiration status, records click data including timestamp and referrer, then redirects users to the destination. Frontend redirection shows a 3-second countdown before redirecting.
Analytics
The statistics page displays all created URLs with detailed click analytics, including total click counts, individual click timestamps, referrer sources, and geographic location data (mocked as "Hyderabad, IN").
Data Storage Strategy
Frontend uses localStorage for browser-based persistance with keys for URL data and click history. Backend uses in-memory Maps for fast access during the session. For production deployment, this would be replaced with databases like MongoDB or PostgreSQL.
Security & Validation
URLs are validated using JavaScript's URL constructor. Shortcodes must be alphanumeric and at least 3 characters long. The system prevents duplicate shortcodes and protects reserved paths. CORS is configured for frontend-backend communication, and all logging uses JWT authentication.
Technology Justification
React provides component-based development with Material-UI for professional styling. Node.js offers JavaScript consistency across the stack with excellent performance. Custom logging ensures direct evaluation server integration and compliance with assessment requirements.

The system successfully demonstrates full-stack development skills with proper architecture, comprehensive logging, and excellent user experiance while meeting all evaluation requirements.