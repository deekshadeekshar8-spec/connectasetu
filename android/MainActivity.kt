
package com.connectasetu.crm

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.CallLog
import android.util.Log
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import java.util.*

/**
 * Connectasetu CRM - Mobile Bridge Activity
 * 
 * Target: Android 14 (API 34)
 * Purpose: Secure synchronization of call telemetry and automated outreach.
 */
class MainActivity : AppCompatActivity() {

    private val TAG = "Connectasetu_Bridge"

    // Modern Activity Result API for permission handling
    private val requestPermissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.entries.all { it.value }
        if (allGranted) {
            Toast.makeText(this, "Clearance Granted: Terminal Online", Toast.LENGTH_SHORT).show()
            readCallLog()
        } else {
            Toast.makeText(this, "Security Protocol: Permissions Denied", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        checkAndRequestPermissions()
    }

    private fun checkAndRequestPermissions() {
        val requiredPermissions = arrayOf(
            Manifest.permission.READ_CALL_LOG,
            Manifest.permission.CALL_PHONE
        )

        val missingPermissions = requiredPermissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }.toTypedArray()

        if (missingPermissions.isNotEmpty()) {
            requestPermissionsLauncher.launch(missingPermissions)
        } else {
            readCallLog()
        }
    }

    /**
     * READ CALL LOG
     * Queries the System ContentProvider to extract interaction telemetry.
     */
    private fun readCallLog() {
        val callLogUri = CallLog.Calls.CONTENT_URI
        val projection = arrayOf(
            CallLog.Calls.NUMBER,
            CallLog.Calls.TYPE,
            CallLog.Calls.DATE,
            CallLog.Calls.DURATION,
            CallLog.Calls.CACHED_NAME
        )

        // Sort by DATE DESC to get the latest interaction first
        val sortOrder = "${CallLog.Calls.DATE} DESC"

        contentResolver.query(callLogUri, projection, null, null, sortOrder)?.use { cursor ->
            val numberIndex = cursor.getColumnIndex(CallLog.Calls.NUMBER)
            val typeIndex = cursor.getColumnIndex(CallLog.Calls.TYPE)
            val dateIndex = cursor.getColumnIndex(CallLog.Calls.DATE)
            val durationIndex = cursor.getColumnIndex(CallLog.Calls.DURATION)
            val nameIndex = cursor.getColumnIndex(CallLog.Calls.CACHED_NAME)

            var count = 0
            while (cursor.moveToNext() && count < 50) { // Limit to last 50 for sync efficiency
                val number = cursor.getString(numberIndex)
                val type = cursor.getInt(typeIndex)
                val date = cursor.getLong(dateIndex)
                val duration = cursor.getString(durationIndex)
                val name = cursor.getString(nameIndex) ?: "Unknown Lead"

                val typeString = when (type) {
                    CallLog.Calls.INCOMING_TYPE -> "INBOUND"
                    CallLog.Calls.OUTGOING_TYPE -> "OUTBOUND"
                    CallLog.Calls.MISSED_TYPE -> "MISSED"
                    else -> "UNRESOLVED"
                }

                Log.d(TAG, "Syncing Entry: $name | $number | $typeString | ${Date(date)} | ${duration}s")
                count++
            }
            Log.i(TAG, "Sync Complete: $count entries ready for upload.")
        }
    }

    /**
     * STRATEGY A: Direct Automated Call
     * This starts the call immediately without showing the dial pad.
     * REQUIRES: Manifest.permission.CALL_PHONE
     */
    fun startCall(phoneNumber: String) {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
            try {
                val intent = Intent(Intent.ACTION_CALL).apply {
                    data = Uri.parse("tel:$phoneNumber")
                }
                startActivity(intent)
                Log.i(TAG, "Automated outreach initiated: $phoneNumber")
            } catch (e: SecurityException) {
                Log.e(TAG, "Protocol Error: Call permission revoked at runtime.")
            }
        } else {
            Toast.makeText(this, "Action Blocked: No Calling Clearance", Toast.LENGTH_SHORT).show()
            requestPermissionsLauncher.launch(arrayOf(Manifest.permission.CALL_PHONE))
        }
    }

    /**
     * STRATEGY B: Dialer Intent
     * This opens the dialer with the number pre-filled. User must press 'Call'.
     * REQUIRES: No special permissions. Best for B2C transparency.
     */
    fun startDialer(phoneNumber: String) {
        val intent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:$phoneNumber")
        }
        startActivity(intent)
        Log.i(TAG, "Dialer handover complete for: $phoneNumber")
    }

    /**
     * ADVANCED NOTE (TelecomManager):
     * For self-managed VoIP or building a custom in-app calling UI:
     * 
     * val telecomManager = getSystemService(TelecomManager::class.java)
     * val phoneAccountHandle = PhoneAccountHandle(...)
     * telecomManager.placeCall(Uri.parse("tel:$phoneNumber"), extras)
     * 
     * This requires the app to be set as the Default Dialer or use a 
     * ConnectionService to manage the call lifecycle.
     */
}
