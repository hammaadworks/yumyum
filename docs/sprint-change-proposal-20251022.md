# Sprint Change Proposal

**Date:** 2025-10-22
**Author:** John (Product Manager)

## 1. Summary of Changes

This document outlines the approved changes to the current sprint. The initial trigger was a strategic decision to switch the media management provider from Cloudinary to ImageKit. This led to a comprehensive course correction that includes documentation updates, a change in a recurring task schedule, and an adjustment to the current sprint's scope.

## 2. Initial Trigger

The course correction was initiated by the Vibe CEO's decision to replace Cloudinary with ImageKit as the sole provider for media hosting, optimization, and delivery for the entire project.

## 3. Impact Analysis

- **Epic Impact:** The change directly impacts stories in **Epic 2 (Backend Foundation)** and **Epic 3 (In-App Vendor Dashboard)**. Specifically, any stories related to database schemas, vendor mapping, and media uploading required modification. The overall epic structure remains valid.
- **Artifact Impact:** All major project documents required updates. The following artifacts have been updated to replace all references to "Cloudinary" with "ImageKit" and reflect related changes:
  - `docs/prd.md` (and sharded files)
  - `docs/architecture.md` (and sharded files)
  - `docs/front-end-spec.md`
  - `docs/stories/*.md`
  - `docs/archived_sprints/**/*.md`

## 4. Path Forward & Resolution

The following resolutions have been agreed upon:

- **Technology Switch:** ImageKit is now the official media management provider. All development will proceed with this technology.
- **Pruning Schedule Change:** The serverless cron job for pruning unused media assets will now run on a **biweekly** schedule, not daily.
- **Sprint Scope Adjustment:**
  - The current sprint has been **extended by two weeks** to accommodate the new scope.
  - Two new stories have been added to the current sprint to address the implementation of the new technology.

## 5. New User Stories Added to Sprint

The following two stories have been drafted, approved, and added to the current sprint backlog:

---

### **Story 2.6: Implement ImageKit Uploader for Dishes**

- **Story:** As a vendor adding or editing a dish, I want to upload an image directly from the form, so that I don't have to manually manage URLs and can update my menu visuals efficiently.
- **Acceptance Criteria:**
  1.  The "Add/Edit Dish" form must include a dedicated image upload component.
  2.  The uploader must authenticate with the vendor's specific ImageKit account using the `imagekit_account_id` from the `vendor_mappings` table.
  3.  Upon a successful upload, the component must return the full ImageKit URL for the image.
  4.  This URL must be automatically populated into the `image` field of the dish form.
  5.  The uploader must display a loading state during the upload and provide clear feedback for both success and failure.

---

### **Story 2.7 (v2): Create Secure Vendor Media Uploader**

- **Story:** As an authenticated vendor, I need a private and secure page to upload my media assets, so that I can manage my content without having to log in repeatedly.
- **Acceptance Criteria:**
  1.  A **private** page is created at `/vendor/upload`.
  2.  Access to this page is protected. Any unauthenticated users attempting to access it must be redirected to the `/login` page.
  3.  The page must use the existing magic link authentication system. If the vendor has a valid, active session, they must be granted access without needing to re-authenticate.
  4.  The uploader automatically uses the authenticated vendor's mapped ImageKit account (no manual selection needed).
  5.  On successful upload, the public URL of the asset is displayed with a "Copy URL" button.
  6.  The interface provides clear feedback on the upload status (uploading, success, error).
- **Dependencies:** This story is dependent on the successful completion of **Story 2.3 (Implement Magic Link Authentication)** and **Story 2.4 (Create Protected Dashboard Route & Logout)**.

---

## 6. Final Approval

Please review this document. Your final approval will conclude this course correction process, and we will proceed with the updated sprint plan.
