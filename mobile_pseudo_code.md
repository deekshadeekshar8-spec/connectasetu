
# Connectasetu Sync Companion (Android Implementation)

The "Source of Truth" engine that prevents faked reports by syncing raw OS-level telephony data directly to the CRM.

## 1. Implementation Architecture
The official implementation is split into the following components:
- `AndroidManifest.xml`: Permission manifest for `READ_CALL_LOG` and `CALL_PHONE`.
- `MainActivity.kt`: Handles the runtime lifecycle and telephony logic.
- `CallLogEntry.kt`: Standardized data model for sync.

## 2. Security Clearance (Permissions)
The app targets **SDK 34 (Android 14)** and requires:
- `android.permission.READ_CALL_LOG` (High Risk)
- `android.permission.CALL_PHONE` (High Risk)

## 3. Automation Features
- **Direct Calling**: CRM-triggered calls using `ACTION_CALL`.
- **Telemetry Fetching**: Background queries to `CallLog.Calls.CONTENT_URI`.

## 4. Google Play Policy Notice
This app must be categorized as a **Default Dialer** or **Enterprise CRM** to maintain access to the `CALL_LOG` group. Unauthorized usage for simple apps will lead to rejection.
