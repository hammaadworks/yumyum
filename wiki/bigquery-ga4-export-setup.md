# Setting Up Google Analytics 4 (GA4) with BigQuery Export

This document outlines the steps to enable free daily export of your raw Google Analytics 4 (GA4) event data to Google BigQuery. This setup is crucial for enabling advanced analytics, such as identifying the most visited vendor pages, and is a one-time configuration.

## Prerequisites

Before you begin, ensure you have:

1.  **Google Analytics 4 Property:** You must have an active GA4 property.
2.  **Google Cloud Project:** A Google Cloud Project associated with your Google account.
3.  **Google Cloud Billing Account:** A billing account linked to your Google Cloud Project. While BigQuery Export itself is free for GA4, a billing account is required to use BigQuery, but it operates within the BigQuery free tier limits for typical usage.

## Steps to Link GA4 to BigQuery

1.  **Navigate to Google Analytics 4 Admin:**
    *   Go to your [Google Analytics account](https://analytics.google.com/).
    *   Select the GA4 property you want to configure.
    *   Click on **Admin** (the gear icon) in the bottom-left corner.

2.  **Access BigQuery Linking:**
    *   In the "Property" column, under "Product Links," click on **BigQuery Links**.

3.  **Create a New Link:**
    *   Click the **Link** button.

4.  **Choose a Google Cloud Project:**
    *   Click **Choose a BigQuery project** and select the Google Cloud Project you wish to link your GA4 data to. This project is where your raw GA4 event data will be stored.

5.  **Select Data Streams:**
    *   Choose the data streams (e.g., Web, iOS app, Android app) from which you want to export data. Typically, you'll select your primary web data stream.

6.  **Configure Data Export Settings:**
    *   **Frequency:** Select "Daily" export. This is the free option for raw event data.
    *   **Include advertising identifiers for mobile app streams:** (Optional) Keep this checked if you need these identifiers for mobile app data.

7.  **Review and Submit:**
    *   Review your settings.
    *   Click **Submit** to create the link.

## Verification

After setting up the link:

*   **Wait 24-48 hours:** It takes some time for the first data export to occur.
*   **Check BigQuery:** Navigate to your [Google Cloud Console BigQuery interface](https://console.cloud.google.com/bigquery).
    *   In your linked Google Cloud Project, look for a new dataset named `analytics_XXXXXXXXX` (where XXXXXXXXX is your GA4 Property ID).
    *   Within this dataset, you should start seeing daily tables (e.g., `events_20251030`) containing your raw GA4 event data.

This setup ensures that raw GA4 event data is automatically exported to BigQuery daily, providing a foundation for subsequent automated processing to identify top vendors.