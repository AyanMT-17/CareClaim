# CareClaim
A Secure Claims Processing and Insurance Management system combines the strengths of blockchain technology with the popular MERN software stack (MongoDB, Express.js, React.js, Node.js) to deliver a robust, secure, and seamless platform for health insurance operations.

This project is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js) that provides a simple, secure, and transparent way for individual insurance policyholders to file and track their claims without requiring direct insurer API integrations. It helps users link their insurance policies, report incidents (First Notice of Loss - FNOL), upload supporting documents, submit claims through official insurer channels, and track claim progress while providing a tamper-evident audit trail using blockchain events.

Workflow of the Entire Project
1. User Onboarding and Policy Linking
Users sign in using OAuth.
Users upload their official e-policy documents (PDF/image).
The backend extracts key policy metadata via OCR: policy number, insurer name, insured name, coverage dates, and sum insured.
The extracted data is validated and saved in the database to create linked policies.
Policies are marked Verified or Pending based on validation.

2. First Notice of Loss (FNOL) Intake and Drafting
Users choose a linked policy to file a claim.
A guided multi-step FNOL wizard collects incident details: type, date, location, description, and estimated claim amount.
Users upload supporting evidence such as photos, bills, and police reports.
Backend validates inputs and stores the claim as a draft until submitted.

3. Document Upload and Validation
All uploaded evidence is scanned for file type, size, and malware.
Documents are securely stored with metadata including checksum and timestamps.
OCR is optionally run on uploads to extract further structured data.

4. Claim Submission to Insurer and Acknowledgement Capture
Upon final submission, the backend generates a claim pack summarizing FNOL and attached documents.
Users submit this claim pack to insurers via their official channels (portal, email, or phone).
Users upload insurer acknowledgements/reference numbers back into the portal.
Backend records these acknowledgements and updates claim status.

5. Claim Status Tracking and Timeline Management
Users can view real-time claim progress, status chips, and milestone history.


6. Blockchain Auditing and Tamper-Evident Logging
Backend hashes critical claim milestone data and emits blockchain events (smart contract).
This creates an immutable, privacy-preserving audit trail of claim events.
Users can verify claim integrity through blockchain-linked proof badges in the timeline.


Additional Information
The backend handles all business logic, data storage, and blockchain interaction.
The frontend is a React-based UI providing forms, dashboards, and timelines.
The smart contract is simple and records claim creation and status updates as events without storing personal data.
The project is designed with privacy, security, and usability as core principles.
