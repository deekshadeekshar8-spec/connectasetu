
package com.connectasetu.crm

/**
 * Clean data model for call telemetry.
 * Compatible with JSON serialization for backend syncing.
 */
data class CallLogEntry(
    val id: String,
    val contactName: String,
    val phoneNumber: String,
    val type: String,
    val timestamp: Long,
    val durationSeconds: Int,
    val isVerified: Boolean = true
)
